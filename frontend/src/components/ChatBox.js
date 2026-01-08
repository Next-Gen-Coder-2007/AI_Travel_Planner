import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/ChatBox.css";

const ChatBox = ({ tripId, messages }) => {
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

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
  }, []);

  const sendChat = async () => {
    const msg = chatInput.trim();
    if (!msg) return;

    setChatMessages((prev) => [...prev, { from: "user", text: msg }]);
    setChatInput("");

    try {
      const res = await axios.post(
        "http://localhost:5000/plan/chat",
        {
          tripId,
          message: msg,
        },
        { withCredentials: true }
      );

      setChatMessages((prev) => [
        ...prev,
        { from: "ai", text: res.data.reply },
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { from: "ai", text: "Error: Unable to get reply" },
      ]);
    }
  };

  return (
    <div className="trip-chat-box">
      <h3>Trip Assistant Chatbot</h3>

      <div className="chat-window">
        {chatMessages.map((m, i) => (
          <div key={i} className={m.from === "user" ? "chat-user" : "chat-ai"}>
            {m.text}
          </div>
        ))}
      </div>

      <div className="chat-bar">
        <input
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Ask your trip doubts..."
          onKeyPress={(e) => e.key === "Enter" && sendChat()}
        />
        <button onClick={sendChat}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
