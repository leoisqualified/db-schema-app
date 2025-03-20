import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ChatHistory.css";
import Navbar from "../components/Navbar";

function ChatHistory() {
  const navigate = useNavigate();
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/projects") // Fetch all projects
      .then((response) => setChatHistory(response.data))
      .catch((error) => console.error("Error fetching chat history:", error));
  }, []);

  return (
    <>
      <Navbar />
      <div className="chat-history-container">
        <ul>
          {chatHistory.length > 0 ? (
            chatHistory.map((chat) => (
              <li
                key={chat._id}
                onClick={() => navigate(`/project/${chat._id}`)}
              >
                {chat.title}
              </li>
            ))
          ) : (
            <p>No chat history found.</p>
          )}
        </ul>

        {/* New Project Button */}
        <button className="new-project-btn" onClick={() => navigate("/")}>
          + New Project
        </button>
      </div>
    </>
  );
}

export default ChatHistory;
