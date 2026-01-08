import { useState } from 'react';
import "../styles/TripCard.css";

const TripCard = ({ trip }) => {
  const [activeDay, setActiveDay] = useState(0);
  const [expandedSections, setExpandedSections] = useState({
    about: true,
    stay: true,
    plan: true,
    food: true
  });

  if (!trip) return <p className="no-data">No trip data available</p>;

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="trip-card">
      <div className="trip-hero">
        <div className="hero-background"></div>
        <div className="hero-content">
          <div className="destination-badge">{trip.destination}</div>
          <h1 className="trip-title">{trip.destination} Adventure</h1>
          <div className="trip-meta">
            <span className="meta-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {trip.travelStyle}
            </span>
            <span className="meta-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {trip.days} Days
            </span>
            <span className="meta-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              {trip.budget}
            </span>
          </div>
          {trip.interests && trip.interests.length > 0 && (
            <div className="interests-tags">
              {trip.interests.map((interest, idx) => (
                <span key={idx} className="interest-tag">{interest}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {trip.aboutTheLocation && trip.aboutTheLocation.length > 0 && (
        <div className="section">
          <button 
            className="section-header"
            onClick={() => toggleSection('about')}
          >
            <h3>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              About the Location
            </h3>
            <svg 
              className={`chevron ${expandedSections.about ? 'expanded' : ''}`}
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          <div className={`section-content ${expandedSections.about ? 'expanded' : ''}`}>
            <div className="info-cards">
              {trip.aboutTheLocation.map((info, idx) => (
                <div key={idx} className="info-card">
                  <div className="info-icon">📍</div>
                  <p>{info}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {trip.stay && trip.stay.length > 0 && (
        <div className="section">
          <button 
            className="section-header"
            onClick={() => toggleSection('stay')}
          >
            <h3>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              Stay Options
            </h3>
            <svg 
              className={`chevron ${expandedSections.stay ? 'expanded' : ''}`}
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          <div className={`section-content ${expandedSections.stay ? 'expanded' : ''}`}>
            <div className="stay-grid">
              {trip.stay.map((hotel, idx) => (
                <div key={idx} className="stay-card">
                  <div className="stay-icon">🏨</div>
                  <h4>{hotel.name}</h4>
                  <p className="location">{hotel.location}</p>
                  <div className="stay-details">
                    <span className="price">{hotel.pricePerNight}</span>
                    <span className="rating">⭐ {hotel.rating}</span>
                  </div>
                  <a 
                    href={hotel.bookingLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="book-button"
                  >
                    Book Now
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {trip.plan && trip.plan.length > 0 && (
        <div className="section">
          <button 
            className="section-header"
            onClick={() => toggleSection('plan')}
          >
            <h3>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Daily Itinerary
            </h3>
            <svg 
              className={`chevron ${expandedSections.plan ? 'expanded' : ''}`}
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          <div className={`section-content ${expandedSections.plan ? 'expanded' : ''}`}>
            <div className="day-selector">
              {trip.plan.map((day, idx) => (
                <button
                  key={idx}
                  className={`day-button ${activeDay === idx ? 'active' : ''}`}
                  onClick={() => setActiveDay(idx)}
                >
                  Day {day.dayNo}
                </button>
              ))}
            </div>
            
            <div className="day-content">
              {trip.plan[activeDay] && (
                <div className="timeline">
                  {trip.plan[activeDay].schedule.map((activity, aIdx) => (
                    <div key={aIdx} className="activity-card">
                      <div className="timeline-marker"></div>
                      <div className="activity-content">
                        <span className="activity-time">{activity.time}</span>
                        <h4 className="activity-place">{activity.place}</h4>
                        <p className="activity-description">{activity.activity}</p>
                        <div className="activity-footer">
                          <span className="activity-cost">{activity.estimatedCost}</span>
                          {activity.googleMapLink && (
                            <a 
                              href={activity.googleMapLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="map-link"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                <circle cx="12" cy="10" r="3"/>
                              </svg>
                              View Map
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {trip.foodRecommendation && trip.foodRecommendation.length > 0 && (
        <div className="section">
          <button 
            className="section-header"
            onClick={() => toggleSection('food')}
          >
            <h3>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                <line x1="6" y1="1" x2="6" y2="4"/>
                <line x1="10" y1="1" x2="10" y2="4"/>
                <line x1="14" y1="1" x2="14" y2="4"/>
              </svg>
              Food Recommendations
            </h3>
            <svg 
              className={`chevron ${expandedSections.food ? 'expanded' : ''}`}
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          <div className={`section-content ${expandedSections.food ? 'expanded' : ''}`}>
            <div className="food-grid">
              {trip.foodRecommendation.map((food, idx) => (
                <div key={idx} className="food-card">
                  <div className="food-icon">🍽️</div>
                  <h4>{food.name}</h4>
                  <p className="cuisine">{food.cuisine}</p>
                  <div className="food-details">
                    <span className="rating">⭐ {food.rating}</span>
                    <p className="location">{food.location}</p>
                  </div>
                  <a 
                    href={food.googleMapLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="map-button"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    View on Map
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripCard;