import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TripPlannerDashboard from "./pages/Dashboard";
import CreatePlan from "./pages/CreatePlan";
import TripPage from "./pages/TripPage";
import Plans from "./pages/Plans";
import ProtectedLayout from "./components/ProtectedLayout";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<TripPlannerDashboard />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/create-plan" element={<CreatePlan />} />
          <Route path="/plan/:id" element={<TripPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;