// update

import express from "express"
import { verifyToken } from "../middleware/VerifyToken.js"

// Import controllers
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
  console.log(`🔍 Router middleware: ${req.method} ${req.path}`)
  next()
})

// ===== USER ROUTES =====
console.log("🔄 Setting up user routes in router...")

router.get("/user", (req, res, next) => {
  console.log("✅ GET /user route hit")
  getUser(req, res, next)
})

router.post("/register", (req, res, next) => {
  console.log("✅ POST /register route hit!")
  console.log("Request body:", req.body)
  console.log("Request headers:", req.headers)
  Register(req, res, next)
})

router.post("/login", (req, res, next) => {
  console.log("✅ POST /login route hit!")
  console.log("Request body:", req.body)
  Login(req, res, next)
})

router.get("/token", (req, res, next) => {
  console.log("✅ GET /token route hit")
  refreshToken(req, res, next)
})

router.delete("/logout", (req, res, next) => {
  console.log("✅ DELETE /logout route hit")
  logout(req, res, next)
})

// ===== HEWAN ROUTES =====
console.log("🔄 Setting up hewan routes in router...")

router.get("/daftarhewan", verifyToken, (req, res, next) => {
  console.log("✅ GET /daftarhewan route hit")
  getHewan(req, res, next)
})

router.get("/daftarhewan/:id", verifyToken, (req, res, next) => {
  console.log("✅ GET /daftarhewan/:id route hit")
  getHewanById(req, res, next)
})

router.get("/pemilik/:id/hewan", (req, res, next) => {
  console.log("✅ GET /pemilik/:id/hewan route hit")
  getHewanByPemilik(req, res, next)
})

router.post("/daftarhewan", verifyToken, (req, res, next) => {
  console.log("✅ POST /daftarhewan route hit")
  createHewan(req, res, next)
})

router.put("/daftarhewan/:id", verifyToken, (req, res, next) => {
  console.log("✅ PUT /daftarhewan/:id route hit")
  updateHewan(req, res, next)
})

router.delete("/daftarhewan/:id", verifyToken, (req, res, next) => {
  console.log("✅ DELETE /daftarhewan/:id route hit")
  deleteHewan(req, res, next)
})

// ===== PEMILIK ROUTES =====
console.log("🔄 Setting up pemilik routes in router...")

router.get("/daftarpemilik", (req, res, next) => {
  console.log("✅ GET /daftarpemilik route hit")
  getPemilik(req, res, next)
})

router.get("/daftarpemilik/:id", verifyToken, (req, res, next) => {
  console.log("✅ GET /daftarpemilik/:id route hit")
  getPemilikById(req, res, next)
})

router.post("/daftarpemilik", verifyToken, (req, res, next) => {
  console.log("✅ POST /daftarpemilik route hit")
  createPemilik(req, res, next)
})

router.put("/daftarpemilik/:id", verifyToken, (req, res, next) => {
  console.log("✅ PUT /daftarpemilik/:id route hit")
  updatePemilik(req, res, next)
})

router.delete("/daftarpemilik/:id", verifyToken, (req, res, next) => {
  console.log("✅ DELETE /daftarpemilik/:id route hit")
  deletePemilik(req, res, next)
})

console.log("✅ All routes configured in router")

export default router
