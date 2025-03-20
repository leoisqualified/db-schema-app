import { useNavigate } from "react-router-dom";
import "./ChatHistory.css";
import Navbar from "../components/Navbar";

function ChatHistory() {
  const navigate = useNavigate();

  // Sample chat history (Replace with real data from backend)
  const chatHistory = [
    { id: "67dab3edd05af7bbd530dfb6", title: "Create User Schema" },
    { id: "67dac8fed05af7bbd530dfb8", title: "Create a User Model" },
  ];

  return (
    <>
      <Navbar />
      <div className="chat-history-container">
        <h1>Chat History</h1>
        <ul>
          {chatHistory.map((chat) => (
            <li key={chat.id} onClick={() => navigate(`/project/${chat.id}`)}>
              {chat.title}
            </li>
          ))}
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
