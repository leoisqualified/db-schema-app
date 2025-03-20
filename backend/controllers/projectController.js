import Project from "../models/Project.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

// 📌 Generate a new project with AI-generated schema
export const createProject = async (req, res) => {
  try {
    const { prompt } = req.body; // ✅ Use "prompt" instead of "title"

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required." });
    }

    // ✅ Generate AI prompt using the user-provided request
    const aiPrompt = `Generate an SQL database schema based on the following user request:

    "${prompt}"

    - Output ONLY a valid JSON object.
    - DO NOT wrap the response in markdown (no triple backticks).
    - DO NOT include any explanations.
    - The JSON format should include:
      - "tables": an array of table objects.
      - Each table object should have:
        - "name" (string, table name)
        - "columns" (array of columns)
      - Each column object should have:
        - "name" (string, column name)
        - "type" (string, SQL data type)
        - (Optional) "primaryKey" (boolean, if it's a primary key)
        - (Optional) "foreignKey" (boolean, if it's a foreign key)
        - (Optional) "references" (string, table and column it references)

    Example JSON output format:

    {
      "tables": [
        {
          "name": "Users",
          "columns": [
            { "name": "UserID", "type": "INTEGER", "primaryKey": true },
            { "name": "Username", "type": "VARCHAR(255)", "notNull": true },
            { "name": "Email", "type": "VARCHAR(255)", "unique": true }
          ]
        },
        {
          "name": "Orders",
          "columns": [
            { "name": "OrderID", "type": "INTEGER", "primaryKey": true },
            { "name": "UserID", "type": "INTEGER", "foreignKey": true, "references": "Users(UserID)" },
            { "name": "TotalAmount", "type": "DECIMAL(10, 2)" }
          ]
        }
      ]
    }

    Return only valid JSON in this format.`;

    // Call AI API
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const aiResponse = await model.generateContent({
      contents: [{ parts: [{ text: aiPrompt }] }],
    });

    // Extract AI response safely
    const candidate = aiResponse.response?.candidates?.[0];

    if (!candidate || !candidate.content?.parts?.[0]?.text) {
      console.error("Unexpected AI response format:", aiResponse);
      return res
        .status(500)
        .json({ error: "Invalid schema format received from AI." });
    }

    // Extract text and clean it
    let aiGeneratedText = candidate.content.parts[0].text.trim();

    // Remove markdown wrapping if AI still adds it
    aiGeneratedText = aiGeneratedText
      .replace(/^```json/, "")
      .replace(/```$/, "")
      .trim();

    let schemaDefinition;
    try {
      schemaDefinition = JSON.parse(aiGeneratedText);
    } catch (error) {
      console.error("Failed to parse AI response:", aiGeneratedText);
      return res
        .status(500)
        .json({ error: "Invalid schema format received from AI." });
    }

    // ✅ Validate Schema Format
    if (!schemaDefinition.tables || !Array.isArray(schemaDefinition.tables)) {
      return res
        .status(400)
        .json({ error: "Invalid schema format. Expected an array of tables." });
    }

    console.log("Generated Schema:", JSON.stringify(schemaDefinition, null, 2));

    // ✅ Save project
    const newProject = new Project({
      title: prompt, // ✅ Store the user's request as "title"
      schemaType: "SQL",
      schemaDefinition,
    });
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
    const { prompt } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: "Project not found." });
    }

    // ✅ Ensure project is an SQL schema project
    if (project.schemaType !== "SQL") {
      return res
        .status(400)
        .json({ error: "Only SQL schemas can be updated." });
    }

    // ✅ Define a structured AI prompt for SQL schema update
    const aiPrompt = `Modify the following SQL database schema based on user instructions:

    - Current Schema:
    ${JSON.stringify(project.schemaDefinition)}

    - User's Request: ${prompt}

    - Return ONLY a valid JSON object.
    - DO NOT wrap the response in markdown (no triple backticks).
    - DO NOT include any explanations.
    - The JSON should include:
      - "tables": an array of table objects.
      - Each table object should have:
        - "name" (string, table name)
        - "columns" (array of columns)
      - Each column object should have:
        - "name" (string, column name)
        - "type" (string, SQL data type)
        - (Optional) "primaryKey" (boolean, if it's a primary key)
        - (Optional) "foreignKey" (boolean, if it's a foreign key)
        - (Optional) "references" (string, table and column it references)

    Example JSON output:

    {
      "tables": [
        {
          "name": "Patients",
          "columns": [
            { "name": "PatientID", "type": "INTEGER", "primaryKey": true },
            { "name": "Name", "type": "VARCHAR(255)" },
            { "name": "DOB", "type": "DATE" }
          ]
        }
      ]
    }

    Ensure **every column has a "type" value**. Return only valid JSON in this format.`;

    // ✅ Generate updated schema using Gemini AI
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const aiResponse = await model.generateContent({
      contents: [{ parts: [{ text: aiPrompt }] }],
    });

    // Extract the raw text response
    const rawText =
      aiResponse.response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!rawText) {
      return res.status(500).json({ error: "Invalid response from AI." });
    }

    // ✅ Remove Markdown Formatting (if AI still adds it)
    const cleanedText = rawText.replace(/^```json|```$/g, "").trim();

    // ✅ Parse JSON correctly
    let updatedSchema;
    try {
      updatedSchema = JSON.parse(cleanedText);
    } catch (error) {
      console.error("Failed to parse AI response:", cleanedText);
      return res.status(500).json({ error: "Invalid JSON from AI response." });
    }

    // ✅ Validate schema structure
    if (!updatedSchema.tables || !Array.isArray(updatedSchema.tables)) {
      return res
        .status(400)
        .json({ error: "Invalid schema format. Expected an array of tables." });
    }

    // ✅ Update project with new schema & history
    project.history.push({ role: "user", content: prompt });
    project.history.push({
      role: "ai",
      content: "Schema updated successfully.",
    });

    project.schemaDefinition = updatedSchema; // ✅ Store full schema object
    await project.save();

    res.json({
      schemaDefinition: project.schemaDefinition,
      history: project.history,
    });
  } catch (error) {
    console.error("Schema Update Error:", error);
    res.status(500).json({ error: "Error updating schema" });
  }
};

// 📌 Get all projects (for chat history)
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({}, "title _id"); // Fetch only title & ID
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Error fetching projects" });
  }
};
