import Project from "../models/Project.js";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const createProject = async (req, res) => {
  try {
    const { title, schemaType } = req.body;

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `Generate a ${schemaType} database schema.`,
        },
        { role: "user", content: `I need a ${schemaType} schema for ${title}` },
      ],
    });

    const schemaDefinition = JSON.parse(aiResponse.choices[0].message.content);
    const newProject = new Project({ title, schemaType, schemaDefinition });
    await newProject.save();

    res.status(201).json({ id: newProject._id, schemaDefinition });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate schema" });
  }
};

export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: "Project not found" });
  }
};

export const updateProject = async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: "Error updating project" });
  }
};
