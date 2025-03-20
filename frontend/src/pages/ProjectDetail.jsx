import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import "./ProjectDetail.css";

function ProjectDetail() {
  const { id: rawId } = useParams();
  const id = rawId.split(":")[0]; // ✅ Ensure ID is correct
  const location = useLocation();
  const [schema, setSchema] = useState(null);
  const [updatePrompt, setUpdatePrompt] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/projects/${id}`)
      .then((response) => {
        setSchema(
          response.data.schemaDefinition || {
            test_table: [{ name: "id", type: "INT PRIMARY KEY" }],
          }
        );
        setHistory(response.data.history || []);
      })
      .catch((error) => console.error("Error fetching schema:", error));
  }, [id]);

  const handleUpdate = async () => {
    if (!updatePrompt) return alert("Please enter a new prompt.");

    try {
      const response = await axios.put(
        `http://localhost:5000/api/projects/${id}`,
        { prompt: updatePrompt }
      );

      setSchema(response.data.schemaDefinition);
      setHistory(response.data.history);
      setUpdatePrompt("");
    } catch (error) {
      alert("Error updating schema.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="project-container">
        <h1>{location.state?.title || "Project Schema"}</h1>

        {/* Schema Display (Scrollable) */}
        <div className="schema-container">
          {schema && Object.keys(schema).length > 0 ? (
            Object.entries(schema).map(([tableName, columns]) => (
              <div key={tableName} className="schema-table">
                <h3>{tableName}</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Column</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {columns.map((col, index) => (
                      <tr key={index}>
                        <td>{col.name}</td>
                        <td>{col.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          ) : (
            <p>Loading schema or no schema found...</p>
          )}
        </div>

        {/* Chat History */}
        <div className="chat-history">
          {history.slice(-2).map((entry, index) => (
            <div
              key={index}
              className={entry.role === "user" ? "user-bubble" : "ai-bubble"}
            >
              <p>{entry.content}</p>
            </div>
          ))}
        </div>

        {/* Update Input (Static) */}
        <div className="input-container">
          <textarea
            value={updatePrompt}
            onChange={(e) => setUpdatePrompt(e.target.value)}
            placeholder="Enter an update prompt..."
          />
          <button onClick={handleUpdate}>Update</button>
        </div>
      </div>
    </>
  );
}

export default ProjectDetail;
