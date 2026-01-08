import "../styles/TripCard.css";

const TripCard = ({ trip }) => {
  if (!trip) return <p className="no-data">No trip data available</p>;

  return (
    <div className="trip-card">
      <div className="trip-header">
        <div className="trip-info">
          <h2 className="trip-destination">{trip.destination}</h2>
          <p className="trip-style">{trip.travelStyle}</p>
          <p>Days: {trip.days}</p>
          <p>Budget: {trip.budget}</p>
          {trip.interests && trip.interests.length > 0 && (
            <p>Interests: {trip.interests.join(", ")}</p>
          )}
        </div>
      </div>

      {trip.aboutTheLocation && trip.aboutTheLocation.length > 0 && (
        <div className="section">
          <h3>About the Location</h3>
          <ul>
            {trip.aboutTheLocation.map((info, idx) => (
              <li key={idx}>{info}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Stay Options */}
      {trip.stay && trip.stay.length > 0 && (
        <div className="section">
          <h3>Stay Options</h3>
          <div className="stay-grid">
            {trip.stay.map((hotel, idx) => (
              <div key={idx} className="stay-card">
                <div className="stay-info">
                  <h4>{hotel.name}</h4>
                  <p>{hotel.location}</p>
                  <p>Price/Night: {hotel.pricePerNight}</p>
                  <p>Rating: {hotel.rating}</p>
                  <a href={hotel.bookingLink} target="_blank" rel="noopener noreferrer">
                    Book Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Plans */}
      {trip.plan && trip.plan.length > 0 && (
        <div className="section">
          <h3>Daily Plans</h3>
          {trip.plan.map((day, idx) => (
            <div key={idx} className="day-card">
              <h4>Day {day.dayNo}</h4>
              {day.schedule.map((activity, aIdx) => (
                <div key={aIdx} className="activity-card">
                  <div>
                    <p><strong>{activity.time} - {activity.place}</strong></p>
                    <p>{activity.activity}</p>
                    <p>Cost: {activity.estimatedCost}</p>
                    {activity.googleMapLink && (
                      <a href={activity.googleMapLink} target="_blank" rel="noopener noreferrer">
                        View on Map
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Food Recommendations */}
      {trip.foodRecommendation && trip.foodRecommendation.length > 0 && (
        <div className="section">
          <h3>Food Recommendations</h3>
          <div className="food-grid">
            {trip.foodRecommendation.map((food, idx) => (
              <div key={idx} className="food-card">
                <div className="food-info">
                  <h4>{food.name}</h4>
                  <p>{food.cuisine}</p>
                  <p>Rating: {food.rating}</p>
                  <p>{food.location}</p>
                  <a href={food.googleMapLink} target="_blank" rel="noopener noreferrer">
                    View on Map
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TripCard;
