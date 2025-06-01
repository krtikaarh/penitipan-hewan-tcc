// update

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/route.js";
import { sequelize } from "./models/Index.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// CORS configuration - lebih permisif untuk debugging
const corsOptions = {
  origin: true, // Izinkan semua origin untuk sementara (debugging)
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Authorization"],
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('Body:', req.body);
  console.log('Headers:', req.headers);
  next();
});

// Routes dengan prefix /api
app.use("/api", router);

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    status: "healthy",
    message: "API is running ✅",
    timestamp: new Date().toISOString(),
    endpoints: [
      "POST /api/register",
      "POST /api/login", 
      "GET /api/token",
      "DELETE /api/logout"
    ]
  });
});

// Database connection check
app.get("/db-status", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ 
      database: "connected",
      host: process.env.DB_HOST,
      name: process.env.DB_NAME 
    });
  } catch (error) {
    res.status(500).json({ 
      database: "disconnected", 
      error: error.message 
    });
  }
});

// 404 handler untuk routes yang tidak ditemukan
app.use("*", (req, res) => {
  console.log(`❌ Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: "Route not found",
    method: req.method,
    path: req.originalUrl,
    availableRoutes: [
      "POST /api/register",
      "POST /api/login",
      "GET /api/token",
      "DELETE /api/logout"
    ]
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error: ${err.message}`);
  console.error('Stack:', err.stack);

  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ error: "Invalid token" });
  }

  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`🌐 Health check: http://localhost:${port}/`);
  console.log(`📊 DB status: http://localhost:${port}/db-status`);
});