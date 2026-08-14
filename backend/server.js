import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Check environment variables
console.log("Environment variables loaded");

if (!process.env.MONGODB_URI) {
    console.error("ERROR: MONGODB_URI is not defined in .env");
    process.exit(1);
}

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB connected successfully");
        console.log("Database:", mongoose.connection.name);
    } catch (error) {
        console.error("MongoDB connection failed:");
        console.error(error.message);
    }
};

// Connect to MongoDB
connectDB();

// Test route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "LMS Backend is running"
    });
});

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        server: "running",
        mongodb:
            mongoose.connection.readyState === 1
                ? "connected"
                : "disconnected"
    });
});

// Server port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});