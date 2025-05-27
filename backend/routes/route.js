import express from "express";

import { verifyToken } from "../middleware/VerifyToken.js";

import {
  getUser,
  Register,
  Login,
  refreshToken,
  logout,
} from "../controller/UserController.js";

import {
  createHewan,
  getHewan,
  getHewanById,
  updateHewan,
  deleteHewan,
} from "../controller/DaftarHewanController.js";

import {
  createPemilik,
  getPemilik,
  getPemilikById,
  updatePemilik,
  deletePemilik,
} from "../controller/DaftarPemilikController.js";

const router = express.Router();

router.get('/user', verifyToken, getUser);
router.post("/register", Register);
router.post("/login", verifyToken, Login);
router.get("/token", verifyToken, refreshToken);
router.delete("/logout", logout);

router.get("/daftarhewan", verifyToken, getHewan); 
router.get("/daftarhewan/:id", verifyToken, getHewanById); 
router.post("/daftarhewan", verifyToken, createHewan);
router.put("/daftarhewan/:id", verifyToken, updateHewan);
router.delete("/daftarhewan/:id", verifyToken, deleteHewan);

router.get("/daftarpemilik", getPemilik); 
router.get("/daftarpemilik/:id", verifyToken, getPemilikById); 
router.post("/daftarpemilik", verifyToken, createPemilik);
router.put("/daftarpemilik/:id", verifyToken, updatePemilik);
router.delete("/daftarpemilik/:id", verifyToken, deletePemilik);

export default router;
