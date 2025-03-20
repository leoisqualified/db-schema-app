import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons"; // Import up arrow icon

function HomePage() {
  const [prompt, setPrompt] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!prompt.trim()) return alert("Please enter a valid prompt.");

    try {
      const schemaType = "SQL"; // Change this later if user selects between SQL/NoSQL

      const response = await axios.post("http://localhost:5000/api/new", {
        title: prompt.trim(),
        schemaType,
      });

      if (response.status === 201) {
        setPrompt(""); // Clears the textarea only if the request is successful
        navigate(`/project/${response.data.id}`, {
          state: { title: prompt.trim() },
        });
      } else {
        alert("Unexpected response from the server.");
      }
    } catch (error) {
      console.error("Error generating schema:", error.response?.data || error);
      alert(error.response?.data?.error || "Error generating schema.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="welcome-box">
          <h1>
            Welcome, <span className="highlight">User.</span>
          </h1>
          <p>What are we building today?</p>
        </div>

        <div className="input-container">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask Anything"
          />
          <button onClick={handleSubmit} className="send-button">
            <FontAwesomeIcon icon={faArrowUp} />
          </button>
        </div>
      </div>
    </>
  );
}

export default HomePage;
