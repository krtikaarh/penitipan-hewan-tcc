// import express from "express";
// import { verifyToken } from "../middleware/VerifyToken.js";


// import {
//   getUser,
//   Register,
//   Login,
//   refreshToken,
//   logout,
// } from "../controller/UserController.js";

// import {
//   createHewan,
//   getHewan,
//   getHewanById,
//   getHewanByPemilik, 
//   updateHewan,
//   deleteHewan,
// } from "../controller/DaftarHewanController.js";

// import {
//   createPemilik,
//   getPemilik,
//   getPemilikById,
//   updatePemilik,
//   deletePemilik,
// } from "../controller/DaftarPemilikController.js";

// const router = express.Router();

// // User routes
// router.get("/user", getUser);
// router.post("/register", Register);
// router.post("/login", Login);
// router.get("/token", refreshToken);
// router.delete("/logout", logout);

// // Hewan routes
// router.get("/daftarhewan", verifyToken, getHewan); 
// router.get("/daftarhewan/:id", verifyToken, getHewanById); 
// router.get("/pemilik/:id/hewan", getHewanByPemilik); // ✅ Tambahkan route yang hilang
// router.post("/daftarhewan", verifyToken, createHewan);
// router.put("/daftarhewan/:id", verifyToken, updateHewan);
// router.delete("/daftarhewan/:id", verifyToken, deleteHewan);

// // Pemilik routes
// router.get("/daftarpemilik", getPemilik); 
// router.get("/daftarpemilik/:id", verifyToken, getPemilikById); 
// router.post("/daftarpemilik", verifyToken, createPemilik);
// router.put("/daftarpemilik/:id", verifyToken, updatePemilik);
// router.delete("/daftarpemilik/:id", verifyToken, deletePemilik);

// export default router;