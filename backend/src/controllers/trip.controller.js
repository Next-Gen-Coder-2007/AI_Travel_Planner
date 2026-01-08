const Trip = require("../models/trip");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generatePlan = async (req, res) => {
  try {
    const userId = req.user._id;
    const { destination, days, budget, interests, travelStyle } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Generate a comprehensive travel plan for ${destination} for ${days} days. 
    Budget: ${budget}. Interests: ${interests.join(
      ", "
    )}. Style: ${travelStyle}.

    Return a JSON object with this exact structure:
    {
      "imageURL": "string",
      "aboutTheLocation": ["string"],
      "stay": [{
        "name": "string",
        "location": "string",
        "pricePerNight": "string",
        "rating": "string",
        "bookingLink": "string",
        "googleMapLink": "string"
      }],
      "plan": [{
        "dayNo": number,
        "schedule": [{
          "time": "string",
          "place": "string",
          "activity": "string",
          "estimatedCost": "string",
          "googleMapLink": "string"
        }]
      }],
      "foodRecommendation": [{
        "name": "string",
        "cuisine": "string",
        "rating": "string",
        "location": "string",
        "googleMapLink": "string"
      }]
    }

    INSTRUCTIONS:
    - Use Unsplash/Pexels/Pixabay images
    - Return ONLY raw JSON`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanedText = text.replace(/```json|```/g, "").trim();
    const aiData = JSON.parse(cleanedText);
    const newTrip = await Trip.create({
      userId,
      destination,
      days,
      budget,
      interests,
      travelStyle,
      imageURL: aiData.imageURL,
      aboutTheLocation: aiData.aboutTheLocation,
      stay: aiData.stay,
      plan: aiData.plan,
      foodRecommendation: aiData.foodRecommendation,
    });
    res.status(201).json({ data: newTrip });
  } catch (error) {
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
