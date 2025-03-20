import express from "express";
import {
  createProject,
  getProject,
  updateProject,
  getAllProjects,
} from "../controllers/projectController.js";

// Initialize Router
const router = express.Router();

// Define the routes
router.post("/new", createProject);
router.get("/:id", getProject);
router.get("/", getAllProjects);
router.put("/:id/update", updateProject);

export default router;
