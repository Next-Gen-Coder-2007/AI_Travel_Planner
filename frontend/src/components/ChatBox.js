import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "../styles/ChatBox.css";

const ChatBox = ({ tripId, messages }) => {
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const chatWindowRef = useRef(null);
  const inputRef = useRef(null);

  const processMessages = (chatString) => {
    const parts = chatString.split(/(User:|AI:)/g);
    let currentFrom = null;
    const formatted = [];

    parts.forEach(p => {
      if (p === "User:") currentFrom = "user";
      else if (p === "AI:") currentFrom = "ai";
      else if (currentFrom && p.trim()) {
        formatted.push({ from: currentFrom, text: p.trim() });
      }
    });

    return formatted;
  };

  useEffect(() => {
    setChatMessages(processMessages(messages));
  }, [messages]);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const sendChat = async () => {
    const msg = chatInput.trim();
    if (!msg) return;
    setChatMessages((prev) => [...prev, { from: "user", text: msg }]);
    setChatInput("");
    setIsTyping(true);

    try {
      const res = await axios.post(
        "https://ai-travel-planner-w8jd.onrender.com/plan/chat",
        {
          tripId,
          message: msg,
        },
        { withCredentials: true }
      );

      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          { from: "ai", text: res.data.reply },
        ]);
        setIsTyping(false);
      }, 500);
    } catch {
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          { from: "ai", text: "Error: Unable to get reply" },
        ]);
        setIsTyping(false);
      }, 500);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendChat();
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className={`trip-chat-box ${isMinimized ? 'minimized' : ''}`}>
      <div className="chat-header">
        <div className="header-content">
          <div className="bot-avatar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              <circle cx="8.5" cy="16" r="0.5" fill="currentColor"/>
              <circle cx="15.5" cy="16" r="0.5" fill="currentColor"/>
              <path d="M9 19c.8.5 1.8.8 3 .8s2.2-.3 3-.8"/>
            </svg>
          </div>
          <div className="header-text">
            <h3>Trip Assistant</h3>
            <span className="status">
              <span className="status-dot"></span>
              Online
            </span>
          </div>
        </div>
        <button className="minimize-btn" onClick={toggleMinimize}>
          {isMinimized ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="18 15 12 9 6 15"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          )}
        </button>
      </div>

      <div className="chat-content">
        <div className="chat-window" ref={chatWindowRef}>
          {chatMessages.length === 0 ? (
            <div className="welcome-message">
              <div className="welcome-icon">👋</div>
              <h4>Welcome to Trip Assistant!</h4>
              <p>Ask me anything about your trip - activities, recommendations, or changes to your itinerary.</p>
              <div className="suggestion-chips">
                <button 
                  className="suggestion-chip"
                  onClick={() => {
                    setChatInput("What are the best places to visit?");
                    inputRef.current?.focus();
                  }}
                >
                  Best places to visit?
                </button>
                <button 
                  className="suggestion-chip"
                  onClick={() => {
                    setChatInput("Recommend local food spots");
                    inputRef.current?.focus();
                  }}
                >
                  Local food spots
                </button>
                <button 
                  className="suggestion-chip"
                  onClick={() => {
                    setChatInput("What's the weather like?");
                    inputRef.current?.focus();
                  }}
                >
                  Weather info
                </button>
              </div>
            </div>
          ) : (
            <>
              {chatMessages.map((m, i) => (
                <div
                  key={i}
                  className={`chat-message ${m.from === "user" ? "chat-user" : "chat-ai"}`}
                >
                  {m.from === "ai" && (
                    <div className="message-avatar">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    </div>
                  )}
                  <div className="message-bubble">
                    {m.text}
                  </div>
                  {m.from === "user" && (
                    <div className="message-avatar user-avatar">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="chat-message chat-ai typing-indicator">
                  <div className="message-avatar">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </div>
                  <div className="message-bubble">
                    <div className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="chat-bar">
          <div className="input-wrapper">
            <input
              ref={inputRef}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about your trip..."
              onKeyPress={handleKeyPress}
              disabled={isTyping}
            />
            <button 
              className="send-button" 
              onClick={sendChat}
              disabled={!chatInput.trim() || isTyping}
            >
              {isTyping ? (
                <svg className="loading-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="12" y1="2" x2="12" y2="6"/>
                  <line x1="12" y1="18" x2="12" y2="22"/>
                  <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
                  <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
                  <line x1="2" y1="12" x2="6" y2="12"/>
                  <line x1="18" y1="12" x2="22" y2="12"/>
                  <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
                  <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              )}
            </button>
          </div>
          <div className="chat-footer">
            <span className="footer-text">Press Enter to send</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;