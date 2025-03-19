import express from "express";
import cors from "cors";
import connectDB from "./config/db";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Routes
app.get("/", (req, res) => res.send("API is running..."));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
