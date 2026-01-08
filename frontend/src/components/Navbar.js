import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-title">AI Travel Planner</div>

      <div className="nav-links">
        <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>
          <i className="fa fa-gauge"></i> Dashboard
        </Link>

        <Link to="/plans" className={location.pathname === "/plans" ? "active" : ""}>
          <i className="fa fa-map"></i> Plans
        </Link>

        <Link to="/create-plan" className={location.pathname === "/create-plan" ? "active" : ""}>
          <i className="fa fa-plus-circle"></i> Create Plan
        </Link>
      </div>

      <div className="nav-actions">
        <button className="icon-btn">
          <i className="fa fa-user"></i>
        </button>

        <button className="logout-text-btn">
          <i className="fa fa-power-off"></i> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
