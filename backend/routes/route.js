// update

import express from "express"
import { verifyToken } from "../middleware/VerifyToken.js"

import { getUser, Register, Login, refreshToken, logout } from "../controller/UserController.js"

import {
  createHewan,
  getHewan,
  getHewanById,
  getHewanByPemilik,
  updateHewan,
  deleteHewan,
} from "../controller/DaftarHewanController.js"

import {
  createPemilik,
  getPemilik,
  getPemilikById,
  updatePemilik,
  deletePemilik,
} from "../controller/DaftarPemilikController.js"

const router = express.Router()

// Debug middleware untuk router
router.use((req, res, next) => {
  console.log(`🔍 Router: ${req.method} ${req.path}`)
  next()
})

// User routes - PASTIKAN INI ADA
console.log("🔄 Setting up user routes...")
router.get("/user", getUser)
router.post("/register", (req, res, next) => {
  console.log("✅ Register route hit!")
  console.log("Request body:", req.body)
  Register(req, res, next)
})
router.post("/login", (req, res, next) => {
  console.log("✅ Login route hit!")
  console.log("Request body:", req.body)
  Login(req, res, next)
})
router.get("/token", refreshToken)
router.delete("/logout", logout)

// Hewan routes
console.log("🔄 Setting up hewan routes...")
router.get("/daftarhewan", verifyToken, getHewan)
router.get("/daftarhewan/:id", verifyToken, getHewanById)
router.get("/pemilik/:id/hewan", getHewanByPemilik)
router.post("/daftarhewan", verifyToken, createHewan)
router.put("/daftarhewan/:id", verifyToken, updateHewan)
router.delete("/daftarhewan/:id", verifyToken, deleteHewan)

// Pemilik routes
console.log("🔄 Setting up pemilik routes...")
router.get("/daftarpemilik", getPemilik)
router.get("/daftarpemilik/:id", verifyToken, getPemilikById)
router.post("/daftarpemilik", verifyToken, createPemilik)
router.put("/daftarpemilik/:id", verifyToken, updatePemilik)
router.delete("/daftarpemilik/:id", verifyToken, deletePemilik)

console.log("✅ All routes configured")

export default router
