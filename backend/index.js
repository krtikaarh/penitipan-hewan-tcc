// update

import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import { sequelize } from "./models/Index.js"

// Import controllers langsung
import { Register, Login, refreshToken, logout, getUser } from "./controller/UserController.js"
import { verifyToken } from "./middleware/VerifyToken.js"
import {
  createHewan,
  getHewan,
  getHewanById,
  getHewanByPemilik,
  updateHewan,
  deleteHewan,
} from "./controller/DaftarHewanController.js"
import {
  createPemilik,
  getPemilik,
  getPemilikById,
  updatePemilik,
  deletePemilik,
} from "./controller/DaftarPemilikController.js"

dotenv.config()

const app = express()
const port = process.env.PORT || 8080

// CORS configuration
const allowedOrigins = [
  "http://localhost:3000",
  "https://mimetic-sweep-450606-j0.uc.r.appspot.com",
  "https://penitipan-hewan-backend-353267785618.asia-southeast2.run.app",
]

const corsOptions = {
  origin: (origin, callback) => {
    console.log(`🔍 CORS check for origin: ${origin}`)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      console.warn(`❌ Blocked by CORS: ${origin}`)
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Authorization"],
  optionsSuccessStatus: 200,
}

// Middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors(corsOptions))

// Debug middleware - log semua request
app.use((req, res, next) => {
  console.log(`🔍 [${new Date().toISOString()}] ${req.method} ${req.path}`)
  console.log(`   Headers:`, {
    "content-type": req.headers["content-type"],
    origin: req.headers.origin,
    authorization: req.headers.authorization ? "Bearer ***" : "none",
  })
  if (req.method !== "GET") {
    console.log(`   Body:`, req.body)
  }
  next()
})

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    status: "healthy",
    message: "API is running ✅",
    timestamp: new Date().toISOString(),
  })
})

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    message: "API is running ✅",
    timestamp: new Date().toISOString(),
  })
})

// Database status
app.get("/db-status", async (req, res) => {
  try {
    await sequelize.authenticate()
    res.json({
      database: "connected ✅",
      host: process.env.DB_HOST,
      name: process.env.DB_NAME,
      user: process.env.DB_USERNAME,
    })
  } catch (error) {
    res.status(500).json({
      database: "disconnected ❌",
      error: error.message,
      host: process.env.DB_HOST,
      name: process.env.DB_NAME,
    })
  }
})

// ===== ROUTES LANGSUNG (TANPA ROUTER) =====

// User routes
console.log("🔄 Setting up user routes...")
app.get("/user", getUser)
app.post("/register", (req, res, next) => {
  console.log("✅ Register route hit!")
  console.log("Request body:", req.body)
  Register(req, res, next)
})
app.post("/login", (req, res, next) => {
  console.log("✅ Login route hit!")
  console.log("Request body:", req.body)
  Login(req, res, next)
})
app.get("/token", refreshToken)
app.delete("/logout", logout)

// Hewan routes
console.log("🔄 Setting up hewan routes...")
app.get("/daftarhewan", verifyToken, getHewan)
app.get("/daftarhewan/:id", verifyToken, getHewanById)
app.get("/pemilik/:id/hewan", getHewanByPemilik)
app.post("/daftarhewan", verifyToken, createHewan)
app.put("/daftarhewan/:id", verifyToken, updateHewan)
app.delete("/daftarhewan/:id", verifyToken, deleteHewan)

// Pemilik routes
console.log("🔄 Setting up pemilik routes...")
app.get("/daftarpemilik", getPemilik)
app.get("/daftarpemilik/:id", verifyToken, getPemilikById)
app.post("/daftarpemilik", verifyToken, createPemilik)
app.put("/daftarpemilik/:id", verifyToken, updatePemilik)
app.delete("/daftarpemilik/:id", verifyToken, deletePemilik)

// Print all routes for debugging
console.log("📋 Available routes:")
app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`   ${Object.keys(r.route.methods).join(", ").toUpperCase()} ${r.route.path}`)
  }
})

// Catch all 404 handler
app.use("*", (req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`)
  res.status(404).json({
    error: "Route not found",
    method: req.method,
    path: req.originalUrl,
    message: "The requested endpoint does not exist",
    availableRoutes: [
      "GET /health",
      "GET /db-status",
      "POST /register",
      "POST /login",
      "GET /daftarhewan",
      "GET /daftarpemilik",
    ],
  })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error(`❌ [${new Date().toISOString()}] Error:`, {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  })

  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ error: "Invalid token" })
  }

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ error: "CORS policy violation" })
  }

  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  })
})

app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${port}`)
  console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`)
  console.log(`🌐 CORS origins:`, allowedOrigins)
})
