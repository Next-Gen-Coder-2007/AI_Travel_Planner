import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import axios from 'axios';

const ProtectedLayout = () => {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("https://ai-travel-planner-w8jd.onrender.com/user/check", {
          withCredentials: true,
        });
        if (!res.data.authenticated) {
          navigate("/login", { replace: true });
        }
      } catch (err) {
        navigate("/login", { replace: true });
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, [navigate]);

  if (!authChecked) return null;

  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default ProtectedLayout;