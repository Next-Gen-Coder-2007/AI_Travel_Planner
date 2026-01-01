import "../styles/Home.css";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const heroRef = useRef(null);
  const cardsRef = useRef([]);
  const stepsRef = useRef([]);
  const navigate = useNavigate();

  const aiFeatures = [
    {
      title: "Personalized Itineraries",
      description:
        "AI builds trips based on your budget, interests, and travel style.",
    },
    {
      title: "Smart Budget Planner",
      description:
        "Get cost estimates for hotels, food, transport, and activities.",
    },
    {
      title: "Real-Time Suggestions",
      description:
        "Weather updates, crowd levels, and best time-to-visit insights.",
    },
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Tell Us Your Preferences",
      description: "Budget, destination, travel dates, and interests.",
    },
    {
      step: "2",
      title: "AI Builds Your Trip",
      description: "Optimized itinerary with cost & time efficiency.",
    },
    {
      step: "3",
      title: "Enjoy Your Journey",
      description: "Travel confidently with real-time suggestions.",
    },
  ];

  useEffect(() => {
    gsap.from(heroRef.current, {
      opacity: 0,
      y: 60,
      duration: 1.2,
      ease: "power3.out",
    });
    cardsRef.current.forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        delay: i * 0.15,
        ease: "power3.out",
      });
    });
    stepsRef.current.forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        delay: i * 0.15,
        ease: "power3.out",
      });
    });
  }, []);

  return (
    <div className="home">
      <div className="navbar-home">
        <div className="icon-and-title">
          <img src="/assets/logo.png" alt="logo" />
          <p>AI Travel Planner</p>
        </div>
        <div className="login-and-register">
          <button
            className="login-btn"
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </button>
          <button
            className="register-btn"
            onClick={() => {
              navigate("register");
            }}
          >
            Register
          </button>
        </div>
      </div>
      <div className="hero-section">
        <div className="video-bg">
          <video autoPlay muted loop playsInline>
            <source src="/assets/video.mp4" type="video/mp4" />
          </video>
          <div className="content" ref={heroRef}>
            <h1>Plan Smarter. Travel Better.</h1>
            <p>
              AI-powered travel planning that saves time, money, and effort.
            </p>
            <button
              onClick={() => {
                navigate("/login");
              }}
            >
              Start Planning
            </button>
          </div>
        </div>
      </div>
      <section className="ai-features">
        <h1>AI Features</h1>
        <div className="container">
          {aiFeatures.map((item, index) => (
            <div
              key={index}
              className="card"
              ref={(el) => (cardsRef.current[index] = el)}
            >
              <h3 className="title">{item.title}</h3>
              <p className="desc">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          {howItWorks.map((item, index) => (
            <div
              key={index}
              className="step"
              ref={(el) => (stepsRef.current[index] = el)}
            >
              <span>{item.step}</span>
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta">
        <h2>Ready to Plan Your Next Adventure?</h2>
        <p>Let AI do the heavy lifting while you enjoy the journey.</p>
        <button
          onClick={() => {
            navigate("/login");
          }}
        >
          Get Started Free
        </button>
      </section>
      <footer>
        <p>Copyright &copy; All Rights Reserved By Subash B</p>
      </footer>
    </div>
  );
};

export default Home;
