import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/RecentPlans.css";

const RecentPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/plan", { withCredentials: true })
      .then((response) => {
        setPlans(response.data.trips.slice(0, 5));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch plans");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading recent plans...</p>;
  if (error) return <p>{error}</p>;
  if (plans.length === 0) return <p>No Plans Found</p>;

  return (
    <div className="plans-section">
      <h3 className="section-title">Recent Plans</h3>

      <div className="plans-grid">
        {plans.map((plan) => (
          <div
            key={plan._id}
            className="plan-card"
            onClick={() => navigate(`/plan/${plan._id}`)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={plan.imageURL}
              alt={plan.destination}
              className="plan-photo"
            />

            <div className="plan-content">
              <h4>{plan.destination}</h4>
              <p className="budget">Budget: {plan.budget}</p>

              <div className="interests">
                {plan.interests.map((interest, i) => (
                  <span key={i} className="interest-tag">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="view-more-btn">View More</button>
    </div>
  );
};

export default RecentPlans;