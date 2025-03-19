import express from "express";
import {
  createProject,
  getProject,
  updateProject,
} from "../controllers/projectController.js";

// Initialize Router
const router = express.Router();

// Define the routes
router.post("/new", createProject);
router.get("/:id", getProject);
router.put("/:id/update", updateProject);

export default router;
