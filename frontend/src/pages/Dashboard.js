import "../styles/TripPlannerDashboard.css";
import RecentPlans from "../components/RecentPlans";
import { Link } from "react-router-dom";

const TripPlannerDashboard = () => {
  return (
    <div>
      <div className="dashboard-container">
        <Link to="/create-plan">
          <button className="create-plan-btn">
            <i className="fa fa-plus"></i> Create New Plan
          </button>
        </Link>
      </div>
      <RecentPlans />
    </div>
  );
};

export default TripPlannerDashboard;