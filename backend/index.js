import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/route.js";
import { sequelize } from "./models/Index.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

const allowedOrigins = [
  "http://localhost:3000",
  "https://mimetic-sweep-450606-j0.uc.r.appspot.com",
  "https://penitipan-hewan-backend-353267785618.asia-southeast2.run.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`Blocked by CORS: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Authorization"],
  optionsSuccessStatus: 200,
};

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, {
    body: req.body,
    headers: req.headers,
    query: req.query
  });
  next();
});

app.post("/register", (req, res) => {
  res.json({ message: "Test register route hit" });
});

app.use("/", router);
console.log("Available routes:");
router.stack.forEach(layer => {
  if (layer.route) {
    const path = layer.route.path;
    const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
    console.log(`${methods} ${path}`);
  }
});

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    status: "healthy",
    message: "API is running ✅",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
  });
});

// Database connection check
app.get("/db-status", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ database: "connected" });
  } catch (error) {
    res.status(500).json({ database: "disconnected", error: error.message });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error: ${err.message}`);

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
});
