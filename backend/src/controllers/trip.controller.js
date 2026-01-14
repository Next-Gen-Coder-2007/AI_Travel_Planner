const Trip = require("../models/trip");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getMapLink = (place) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`;


const generatePlan = async (req, res) => {
  try {
    const userId = req.user._id;
    let { destination, days, budget, interests, travelStyle } = req.body;

    if (!destination || !days) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const interestsArray = Array.isArray(interests)
      ? interests
      : interests?.split(",").map((i) => i.trim()) || [];

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

const prompt = `
Generate a sightseeing-only travel plan for ${destination} for ${days} days.

User Preferences:
- Budget: ${budget}
- Interests: ${interestsArray.join(", ")}
- Travel Style: ${travelStyle}

IMPORTANT RULES (STRICT):
- The "plan" section MUST include ONLY sightseeing places and activities.
- DO NOT include:
  ❌ Restaurants
  ❌ Cafes
  ❌ Food places
  ❌ Travel/transport details
  ❌ Check-in / Check-out
  ❌ Hotels or stays
- Each schedule entry must represent:
  ✔ A place to visit
  ✔ What to do or see at that place
- Time should be realistic (Morning / Afternoon / Evening and if want add more also).

Return ONLY valid JSON in the following exact structure:

{
  "aboutTheLocation": ["string"],
  "stay": [{
    "name": "string",
    "location": "string",
    "pricePerNight": "string",
    "rating": "string",
    "bookingLink": "string"
  }],
  "plan": [{
    "dayNo": number,
    "schedule": [{
      "time": "string",
      "place": "string",
      "activity": "string",
      "estimatedCost": "string"
    }]
  }],
  "foodRecommendation": [{
    "name": "string",
    "cuisine": "string",
    "rating": "string",
    "location": "string"
  }]
}

ADDITIONAL CONSTRAINTS:
- The "plan" array must NOT contain any food-related or travel-related places.
- Restaurants and food places are allowed ONLY inside "foodRecommendation".
- Do not include markdown, explanation, or text outside JSON.
- Return raw JSON only.
`;


    const result = await model.generateContent(prompt);
    const rawText = result.response.text();
    const cleanedText = rawText.replace(/```json|```/g, "").trim();

    let aiData;
    try {
      aiData = JSON.parse(cleanedText);
    } catch (err) {
      console.error("❌ AI RAW RESPONSE:", rawText);
      return res.status(500).json({
        message: "AI returned invalid JSON",
      });
    }

    aiData.stay = Array.isArray(aiData.stay) ? aiData.stay : [];
    aiData.plan = Array.isArray(aiData.plan) ? aiData.plan : [];
    aiData.foodRecommendation = Array.isArray(aiData.foodRecommendation)
      ? aiData.foodRecommendation
      : [];

    aiData.stay = aiData.stay.map((h) => ({
      ...h,
      googleMapLink: getMapLink(`${h.name}, ${destination}`),
    }));

    aiData.plan = aiData.plan.map((d) => ({
      ...d,
      schedule: d.schedule.map((s) => ({
        ...s,
        googleMapLink: getMapLink(`${s.place}, ${destination}`),
      })),
    }));

    aiData.foodRecommendation = aiData.foodRecommendation.map((f) => ({
      ...f,
      googleMapLink: getMapLink(`${f.name}, ${destination}`),
    }));

    const newTrip = await Trip.create({
      userId,
      destination,
      days,
      budget,
      interests: interestsArray,
      travelStyle,
      aboutTheLocation: aiData.aboutTheLocation || [],
      stay: aiData.stay,
      plan: aiData.plan,
      foodRecommendation: aiData.foodRecommendation,
      chatContext: "",
    });

    res.status(201).json({ data: newTrip });
  } catch (error) {
    console.error("🔥 GENERATE PLAN ERROR:", error);
    res.status(500).json({
      message: "Failed to generate travel plan",
      error: error.message,
    });
  }
};

const tripChatBotGemini = async (req, res) => {
  try {
    const { tripId, message } = req.body;

    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const context = `
    You are a specialized travel chatbot for ONE TRIP ONLY.

    Your knowledge sources:
    1. Use the below trip data STRICTLY for:
      - Destination
    2. You may use real-world knowledge
    3. You should able to suggest some other places in that destination to visit and you can suggest some other also (hotels , stay, food) but you should not suggest anything outside that destination.

    Hard constraints (never break these):
    - The destination is permanently fixed: ${trip.destination}
    - You are not a trip planner. You are a trip assistant for this exact plan.

    Stay Options (ONLY choose from this list):
    ${trip.stay
      .map(
        (h) =>
          `- ${h.name}, ${h.pricePerNight}/night, Rating ${h.rating}, ${h.location}`
      )
      .join("\n")}

    Itinerary (DO NOT create any new schedule, use ONLY this plan):
    ${trip.plan
      .map(
        (d) =>
          `Day ${d.dayNo}:\n${d.schedule
            .map(
              (s) =>
                `${s.time} – ${s.place} (${s.activity}), Cost ₹${s.estimatedCost}`
            )
            .join("\n")}`
      )
      .join("\n\n")}

    Food Recommendations (ONLY from this list):
    ${trip.foodRecommendation
      .map(
        (f) => `- ${f.name}, ${f.cuisine}, Rating ${f.rating}, ${f.location}`
      )
      .join("\n")}

    Response style:
    - Always answer in 2–4 lines total.
    - Keep it helpful and concise.
    - You may give 1–2 travel tips, but they must NOT include new hotels or new itinerary suggestions.

    Remember: Stay loyal to the provided trip. Do not hallucinate new hotels or new plans.
    `;

    const prompt =
      context +
      `
    Previous conversation (use this to continue the chat naturally):
    ${trip.chatContext}

    User question: ${message}`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    trip.chatContext += `\nUser: ${message}\nAI: ${reply}\n`;
    await trip.save();

    res.json({ reply });
  } catch (err) {
    res.status(500).json({ message: "Gemini chat failed", error: err.message });
  }
};

const getPlans = async (req, res) => {
  try {
    const userId = req.user._id;
    const myTrips = await Trip.find({ userId })
      .select("destination days budget interests imageURL")
      .lean();
    res.status(200).json({ trips: myTrips });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const getPlan = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const trip = await Trip.findOne({ _id: id, userId });
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    res.status(200).json({ data: trip });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch trip",
      error: error.message,
    });
  }
};

module.exports = {
  generatePlan,
  getPlans,
  getPlan,
  tripChatBotGemini,
};
