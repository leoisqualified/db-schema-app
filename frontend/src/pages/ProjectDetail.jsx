import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/projects/${id}`)
      .then((response) => {
        setProject(response.data);
        setLoading(false);
      })
      .catch(() => {
        alert("Error fetching project");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="container">Loading...</div>;
  if (!project) return <div className="container">Project not found</div>;

  return (
    <div className="container">
      <h2>
        {project.title} - {project.schemaType} Schema
      </h2>
      {project.schemaType === "SQL" ? (
        <SQLSchemaDisplay schema={project.schemaDefinition.tables} />
      ) : (
        <NoSQLSchemaDisplay schema={project.schemaDefinition.collections} />
      )}
    </div>
  );
}

function SQLSchemaDisplay({ schema }) {
  return Object.entries(schema).map(([tableName, columns]) => (
    <div key={tableName} className="table-container">
      <h3>{tableName}</h3>
      <table>
        <thead>
          <tr>
            <th>Column</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(columns).map(([column, type]) => (
            <tr key={column}>
              <td>{column}</td>
              <td>{type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ));
}

function NoSQLSchemaDisplay({ schema }) {
  return Object.entries(schema).map(([collectionName, fields]) => (
    <div key={collectionName} className="table-container">
      <h3>{collectionName}</h3>
      <table>
        <thead>
          <tr>
            <th>Field</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(fields).map(([field, type]) => (
            <tr key={field}>
              <td>{field}</td>
              <td>{type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ));
}

export default ProjectDetail;
