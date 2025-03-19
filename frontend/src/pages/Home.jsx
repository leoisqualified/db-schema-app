import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import Navbar from "../components/Navbar";

function HomePage() {
  const [prompt, setPrompt] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!prompt) return alert("Please enter a prompt.");

    try {
      const response = await axios.post("http://localhost:5000/api/generate", {
        prompt,
      });
      navigate(`/project/${response.data.id}`);
    } catch (error) {
      alert("Error generating schema.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="welcome-box">
          <h1>Welcome, user!</h1>
          <p>What are we building today?</p>
        </div>

        <div className="input-container">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your database schema..."
          />
          <button onClick={handleSubmit}>Send</button>
        </div>
      </div>
    </>
  );
}

export default HomePage;
