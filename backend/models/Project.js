import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  schemaType: { type: String, enum: ["SQL", "NoSQL"] },
  schemaDefinition: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Project = mongoose.model("Project", projectSchema);
