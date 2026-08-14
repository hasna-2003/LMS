import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Import Routers
import bookingRouter from "./routes/bookingRouter.js";
import courseRouter from "./routes/courseRouter.js";

import dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
// Load Environment Variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors());

// Routes
app.use("/api/booking", bookingRouter);
app.use("/api/course", courseRouter);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});