const Trip = require("../models/trip");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generatePlan = async (req, res) => {
  try {
    const userId = req.user._id;
    const { destination, days, budget, interests, travelStyle } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Generate a comprehensive travel plan for ${destination} for ${days} days. 
    Budget: ${budget}. Interests: ${interests.join(", ")}. Style: ${travelStyle}.

    Return a JSON object with this exact structure:
    {
      "imageURL": "string",
      "aboutTheLocation": ["string"],
      "stay": [{
        "name": "string",
        "location": "string",
        "imageURL": "string",
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
          "imageURL": "string",
          "estimatedCost": "string",
          "googleMapLink": "string"
        }]
      }],
      "foodRecommendation": [{
        "name": "string",
        "cuisine": "string",
        "rating": "string",
        "imageURL": "string",
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
};