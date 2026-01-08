const mongoose = require("mongoose");

const tripSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  destination: {
    type: String,
  },
  days: {
    type: Number,
  },
  budget: {
    type: String,
  },
  interests: [
    {
      type: String,
    },
  ],
  travelStyle: {
    type: String,
  },
  aboutTheLocation: [
    {
      type: String,
    },
  ],
  stay: [
    {
      name: {
        type: String,
      },
      loaction: {
        type: String,
      },
      pricePerNight: {
        type: String,
      },
      rating: {
        type: String,
      },
      bookingLink: {
        type: String,
      },
      googleMapLink: {
        type: String,
      },
    },
  ],
  plan: [
    {
      dayNo: {
        type: Number,
      },
      schedule: [
        {
          time: {
            type: String,
          },
          place: {
            type: String,
          },
          activity: {
            type: String,
          },
          estimatedCost: {
            type: String,
          },
          googleMapLink: {
            type: String,
          },
        },
      ],
    },
  ],
  foodRecommendation: [
    {
      name: {
        type: String,
      },
      cuisine: {
        type: String,
      },
      rating: {
        type: String,
      },
      location: {
        type: String,
      },
      googleMapLink: {
        type: String,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  chatContext: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Trip", tripSchema);
