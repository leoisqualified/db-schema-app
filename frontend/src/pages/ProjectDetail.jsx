import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import "./ProjectDetail.css";

function ProjectDetail() {
  const { id: rawId } = useParams();
  const id = rawId.split(":")[0]; // ✅ Ensure ID is correctly extracted
  const location = useLocation();
  const navigate = useNavigate();
  const [schema, setSchema] = useState(null);
  const [updatePrompt, setUpdatePrompt] = useState("");
  const [history, setHistory] = useState([]); // ✅ Keeps only the last two messages
  const [projectTitle, setProjectTitle] = useState(location.state?.title || ""); // ✅ Store title

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/projects/${id}`)
      .then((response) => {
        setSchema(response.data.schemaDefinition || { tables: [] }); // ✅ Ensure tables array exists
        setHistory(response.data.history.slice(-2) || []); // ✅ Keep only last two messages

        // ✅ If no title exists in state, get it from the backend
        if (!projectTitle && response.data.title) {
          setProjectTitle(response.data.title);

          // ✅ Update location state with the new title
          navigate(location.pathname, {
            state: {
              title: response.data.title,
              prompt: location.state?.prompt || "",
            },
          });
        }
      })
      .catch((error) => console.error("Error fetching schema:", error));
  }, [id, navigate, location.pathname, location.state?.prompt, projectTitle]);

  const handleUpdate = async () => {
    if (!updatePrompt.trim()) return alert("Please enter a prompt.");

    // ✅ 1. Add user's message
    const newHistory = [{ role: "user", content: updatePrompt }];

    try {
      const response = await axios.put(
        `http://localhost:5000/api/projects/${id}`,
        { prompt: updatePrompt.trim() }
      );

      // ✅ 2. Update schema
      setSchema(response.data.schemaDefinition);

      // ✅ 3. AI's response (Schema + Confirmation)
      const aiResponse = {
        role: "ai",
        content: "Here is the updated schema. Are you satisfied?",
      };

      // ✅ 4. Keep only the last two messages
      setHistory([newHistory[0], aiResponse]);

      setUpdatePrompt("");
    } catch (error) {
      alert("Error updating schema.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="project-container">
        <h1>{projectTitle || "Project Schema"}</h1>

        {/* ✅ Schema Display */}
        <div className="schema-container">
          {schema && schema.tables ? (
            schema.tables.length > 0 ? (
              schema.tables.map((table) => (
                <div key={table.name} className="schema-table">
                  <table>
                    <thead>
                      <tr>
                        <th colSpan="2" className="table-title">
                          {table.name}
                        </th>{" "}
                        {/* ✅ Title spans two columns */}
                      </tr>
                    </thead>
                    <tbody>
                      {table.columns.map((col, index) => (
                        <tr key={index}>
                          <td>{col.name}</td>
                          <td>{col.type || "UNKNOWN"}</td>{" "}
                          {/* ✅ Handle empty type */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))
            ) : (
              <p>No tables found in schema.</p>
            )
          ) : (
            <p>Loading schema or no schema found...</p>
          )}
        </div>

        {/* ✅ Chat History (Only Last 2 Messages) */}
        <div className="chat-history">
          {history.map((entry, index) => (
            <div
              key={index}
              className={entry.role === "user" ? "user-bubble" : "ai-bubble"}
            >
              <p>{entry.content}</p>
            </div>
          ))}
        </div>

        {/* ✅ Update Input */}
        <div className="input-container">
          <textarea
            value={updatePrompt}
            onChange={(e) => setUpdatePrompt(e.target.value)}
            placeholder="Say Anything"
          />
          <button onClick={handleUpdate} className="update-button">
            <FontAwesomeIcon icon={faArrowUp} />
          </button>
        </div>
      </div>
    </>
  );
}

export default ProjectDetail;
