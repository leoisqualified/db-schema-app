import Project from "../models/Project.js";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 📌 Generate a new project with AI-generated schema
export const createProject = async (req, res) => {
  try {
    const { title, schemaType } = req.body;

    if (!title || !schemaType) {
      return res
        .status(400)
        .json({ error: "Title and schema type are required." });
    }

    // Define the AI prompt
    const aiPrompt =
      schemaType === "SQL"
        ? `Generate a SQL schema for a ${title} database. Include table names, columns, data types, and relationships in JSON format.`
        : `Generate a NoSQL schema for a ${title} database. Represent it as MongoDB collections with sample fields and data types in JSON format.`;

    // Call OpenAI API
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: aiPrompt }],
    });

    // Extract and validate AI-generated schema
    let schemaDefinition;
    try {
      schemaDefinition = JSON.parse(aiResponse.choices[0].message.content);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Invalid schema format received from AI." });
    }

    // Save project to database
    const newProject = new Project({ title, schemaType, schemaDefinition });
    await newProject.save();

    res.status(201).json({ id: newProject._id, schemaDefinition });
  } catch (error) {
    console.error("Schema Generation Error:", error);
    res.status(500).json({ error: "Failed to generate schema" });
  }
};

// 📌 Retrieve a project by ID
export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: "Error fetching project" });
  }
};

// 📌 Update an existing project
export const updateProject = async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProject) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: "Error updating project" });
  }
};
