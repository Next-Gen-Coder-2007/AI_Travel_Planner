import { useState } from "react";
import axios from "axios";
import "../styles/CreatePlan.css";

const CreatePlan = () => {
  const [trip, setTrip] = useState({
    destination: "",
    days: "",
    budgetFrom: "",
    budgetTo: "",
    interests: [],
    travelStyle: "",
  });

  const [customInterest, setCustomInterest] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiPlan, setAiPlan] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setTrip({ ...trip, [e.target.name]: e.target.value });
  };

  const handleInterest = (e) => {
    const value = e.target.value;
    const updated = trip.interests.includes(value)
      ? trip.interests.filter((i) => i !== value)
      : [...trip.interests, value];

    setTrip({ ...trip, interests: updated });
  };

  const addCustomInterest = () => {
    const value = customInterest.trim();
    if (!value) return;

    if (!trip.interests.includes(value)) {
      setTrip({ ...trip, interests: [...trip.interests, value] });
    }

    setCustomInterest("");
  };

  const removeInterest = (interest) => {
    setTrip({
      ...trip,
      interests: trip.interests.filter((i) => i !== interest),
    });
  };

  const generateAIPlan = async () => {
    setLoading(true);
    setError("");
    setAiPlan(null);

    try {
      const response = await axios.post(
        "https://ai-travel-planner-w8jd.onrender.com/plan/generate-plan",
        {
          destination: trip.destination,
          days: trip.days,
          budget: `${trip.budgetFrom}-${trip.budgetTo}`,
          interests: trip.interests,
          travelStyle: trip.travelStyle || "Relaxed",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true
        }
      );

      setAiPlan(response.data.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to generate plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-plan-container">
      <h2>Create Trip Plan</h2>

      <div className="form-card">
        <input
          name="destination"
          placeholder="Enter Destination"
          value={trip.destination}
          onChange={handleChange}
        />

        <input
          type="number"
          name="days"
          placeholder="Number of Days"
          value={trip.days}
          onChange={handleChange}
        />

        <div className="budget-range">
          <input
            type="number"
            name="budgetFrom"
            placeholder="Budget From (₹)"
            value={trip.budgetFrom}
            onChange={handleChange}
          />
          <input
            type="number"
            name="budgetTo"
            placeholder="Budget To (₹)"
            value={trip.budgetTo}
            onChange={handleChange}
          />
        </div>

        <div className="interests">
          {["Beach", "Food", "Trekking", "Shopping", "Culture"].map(
            (item) => (
              <label key={item}>
                <input
                  type="checkbox"
                  value={item}
                  checked={trip.interests.includes(item)}
                  onChange={handleInterest}
                />
                {item}
              </label>
            )
          )}
        </div>

        <div className="custom-interest-box">
          <input
            value={customInterest}
            onChange={(e) => setCustomInterest(e.target.value)}
            placeholder="Add your own interest"
          />
          <button onClick={addCustomInterest} className="add-interest-btn">
            <i className="fa fa-plus"></i>
          </button>
        </div>

        {trip.interests.length > 0 && (
          <div className="interest-tags">
            {trip.interests.map((interest, i) => (
              <span key={i} className="interest-tag">
                {interest}
                <i
                  className="fa fa-times remove-tag"
                  onClick={() => removeInterest(interest)}
                ></i>
              </span>
            ))}
          </div>
        )}

        <button onClick={generateAIPlan} disabled={loading}>
          {loading ? "Generating..." : "Generate Plan (AI)"}
        </button>

        {error && <p className="error">{error}</p>}

        {aiPlan && (
          <div className="ai-plan-result">
            <h3>{aiPlan.destination}</h3>
            <img src={aiPlan.imageURL} alt={aiPlan.destination} />
            <p>Days: {aiPlan.days}</p>
            <p>Budget: {aiPlan.budget}</p>
            <h4>About the location:</h4>
            <ul>
              {aiPlan.aboutTheLocation.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePlan;
