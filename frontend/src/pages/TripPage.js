import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import TripCard from "../components/TripCard";
import ChatBox from "../components/ChatBox";
import "../styles/TripPage.css";

const TripPage = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/plan/${id}`,
          {
            withCredentials: true,
          }
        );
        setTrip(res.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id]);

  if (loading) return <p style={{ textAlign: "center" }}>Loading trip...</p>;
  if (error)
    return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;
  if (!trip) return <p style={{ textAlign: "center" }}>No trip found</p>;

  return (
    <div className="trip-page-container">
      <div className="trip-card-container">
        <TripCard trip={trip} />
      </div>

      <div className="trip-chat-container">
        <ChatBox tripId={trip._id} messages={trip.chatContext} />
      </div>
    </div>
  );
};

export default TripPage;
