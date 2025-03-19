import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import projectRoutes from "./routes/projectRoutes.js";
import connectDB from "./config/db.js";

dotenv.config(); // To load environment variables

// Instantiate express
const app = express();

const PORT = process.env.PORT;

app.use(cors());
app.use(express.json()); // express middleware to parse body requests

// Database Connection
connectDB();

// Routes
app.use("/api", projectRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
