import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function NewProject() {
  const [title, setTitle] = useState("");
  const [schemaType, setSchemaType] = useState("SQL");
  const navigate = useNavigate();

  const handleCreate = async () => {
    const res = await axios.post("http://localhost:5000/api/projects/new", {
      title,
      schemaType,
    });
    navigate(`/project/${res.data.id}`);
  };

  return (
    <div className="container">
      <h2>Create New Project</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <select
        value={schemaType}
        onChange={(e) => setSchemaType(e.target.value)}
      >
        <option>SQL</option>
        <option>NoSQL</option>
      </select>
      <button onClick={handleCreate}>Create</button>
    </div>
  );
}

export default NewProject;
