const Trip = require("../models/trip");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generatePlan = async (req, res) => {
  try {
    const { destination, days, budget, interests, travelStyle, userId } =
      req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Generate a comprehensive travel plan for ${destination} for ${days} days. 
    Budget: ${budget}. Interests: ${interests.join(", ")}. Style: ${travelStyle}.

    Return a JSON object with this exact structure:
    {
    "imageURL": "string", // Direct URL to a high-quality landscape image of ${destination}
    "aboutTheLocation": ["string"],
    "stay": [{ 
        "name": "string", 
        "location": "string", 
        "imageURL": "string", // Real web image URL of this hotel or property
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
        "imageURL": "string", // Real web image URL of this specific place or activity
        "estimatedCost": "string", 
        "googleMapLink": "string" 
        }] 
    }],
    "foodRecommendation": [{ 
        "name": "string", 
        "cuisine": "string", 
        "rating": "string", 
        "imageURL": "string", // Real web image URL of the food or restaurant
        "location": "string", 
        "googleMapLink": "string" 
    }]
    }

    INSTRUCTIONS FOR IMAGES:
    1. Provide a working web image URL from free websites use unsplash website.
    2. Sources can include travel blogs, official tourism sites, Pixabay, Pexels, or hotel websites.
    3. Ensure the URLs are publicly accessible and highly relevant to the specific context.
    4. Return ONLY the raw JSON object. No markdown, no conversational text.`;
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
      aboutTheLocation: aiData.aboutTheLocation,
      stay: aiData.stay,
      plan: aiData.plan,
      foodRecommendation: aiData.foodRecommendation,
    });
    res.status(201).json({
      data: newTrip,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate travel plan",
      error: error.message,
    });
  }
};

module.exports = { generatePlan };
