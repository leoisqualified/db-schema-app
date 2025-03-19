import Project from "../models/Project.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

// 📌 Generate a new project with AI-generated schema
export const createProject = async (req, res) => {
  try {
    const { title, schemaType } = req.body;

    if (!title || !schemaType) {
      return res
        .status(400)
        .json({ error: "Title and schema type are required." });
    }

    // Define AI prompt with explicit instruction to avoid Markdown formatting
    const aiPrompt =
      schemaType === "SQL"
        ? `Generate a SQL schema for a ${title} database. Output ONLY a raw JSON object. Do NOT wrap in markdown (no triple backticks). Do NOT add any explanations.`
        : `Generate a NoSQL schema for a ${title} database in MongoDB format. Output ONLY a raw JSON object. Do NOT wrap in markdown (no triple backticks). Do NOT add any explanations.`;

    // Call Google's Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const aiResponse = await model.generateContent({
      contents: [{ parts: [{ text: aiPrompt }] }],
    });

    // Log the raw AI response before parsing
    console.log("Raw AI Response:", JSON.stringify(aiResponse, null, 2));

    // Extract AI response safely
    const candidate = aiResponse.response?.candidates?.[0];

    if (!candidate || !candidate.content?.parts?.[0]?.text) {
      console.error("Unexpected AI response format:", aiResponse);
      return res
        .status(500)
        .json({ error: "Invalid schema format received from AI." });
    }

    // Extract AI-generated text and clean it
    let aiGeneratedText = candidate.content.parts[0].text.trim();

    // Remove Markdown formatting if AI still adds it
    aiGeneratedText = aiGeneratedText
      .replace(/^```json/, "")
      .replace(/```$/, "")
      .trim();

    let schemaDefinition;
    try {
      schemaDefinition = JSON.parse(aiGeneratedText); // Ensure valid JSON
    } catch (error) {
      console.error("Failed to parse AI response text:", aiGeneratedText);
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
    const { prompt } = req.body;
    const project = await Project.findById(req.params.id);

    // AI generates a new schema based on updated prompt
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: `Modify this schema: ${prompt}` }],
    });

    const updatedSchema = JSON.parse(aiResponse.choices[0].message.content);

    // Update project with new schema & keep history
    project.history.push({ role: "user", content: prompt });
    project.history.push({
      role: "ai",
      content: "Schema updated successfully.",
    });

    project.schemaDefinition = updatedSchema;
    await project.save();

    res.json({ schemaDefinition: updatedSchema, history: project.history });
  } catch (error) {
    res.status(500).json({ error: "Error updating schema" });
  }
};
