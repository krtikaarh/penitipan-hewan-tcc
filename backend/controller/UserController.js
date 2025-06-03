// update

import User from "../models/UserModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

// Ambil semua user
export const getUser = async (req, res) => {
  try {
    const users = await User.findAll()
    res.json(users)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
}

// Register
export const Register = async (req, res) => {
  console.log("🔄 Register controller called")
  console.log("Request body:", req.body)

  const { username, password } = req.body

  // Validasi input
  if (!username || !password) {
    console.log("❌ Validation failed: Missing username or password")
    return res.status(400).json({
      message: "Username dan password harus diisi",
    })
  }

  try {
    // Cek apakah username sudah terdaftar
    const existingUser = await User.findOne({ where: { username } })

    if (existingUser) {
      console.log("❌ Username already exists:", username)
      return res.status(400).json({
        message: "Username sudah terdaftar",
      })
    }

    const salt = await bcrypt.genSalt()
    const hashPassword = await bcrypt.hash(password, salt)

    const newUser = await User.create({
      username,
      password: hashPassword,
    })

    console.log("✅ User registered successfully:", newUser.id)
    res.status(201).json({
      message: "Registrasi berhasil",
      data: {
        id: newUser.id,
        username: newUser.username,
      },
    })
  } catch (error) {
    console.error("❌ Registration error:", error)
    res.status(500).json({
      message: "Registrasi gagal",
      error: error.message,
    })
  }
}

// Login
export const Login = async (req, res) => {
  console.log("🔄 Login controller called")
  const { username, password } = req.body

  try {
    const user = await User.findOne({ where: { username } })

    if (!user) {
      console.log("❌ User not found:", username)
      return res.status(404).json({ message: "User tidak ditemukan" })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      console.log("❌ Invalid password for user:", username)
      return res.status(401).json({ message: "Password salah" })
    }

    // Buat access token dan refresh token
    const accessToken = jwt.sign({ id: user.id, username: user.username }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    })
    const refreshToken = jwt.sign({ id: user.id, username: user.username }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
    })

    await User.update({ refresh_token: refreshToken }, { where: { id: user.id } })

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    })

    console.log("✅ Login successful for user:", username)
    return res.status(200).json({
      accessToken,
      message: "Login berhasil",
    })
  } catch (error) {
    console.error("❌ Login error:", error)
    res.status(500).json({
      message: "Login gagal",
      error: error.message,
    })
  }
}

// Refresh access token
export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) return res.sendStatus(401)

    const user = await User.findOne({
      where: { refresh_token: refreshToken },
    })
    if (!user) return res.sendStatus(403)

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: "Invalid refresh token" })

      const accessToken = jwt.sign({ id: user.id, username: user.username }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
      })

      res.json({ accessToken })
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Terjadi Kesalahan",
      error: error.message,
    })
  }
}

// Logout
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) return res.sendStatus(204)

    const user = await User.findOne({
      where: { refresh_token: refreshToken },
    })
    if (!user) return res.sendStatus(204)

    await User.update({ refresh_token: null }, { where: { id: user.id } })

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })

    res.status(200).json({
      message: "Logout Berhasil",
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Terjadi Kesalahan pada server",
      error: error.message,
    })
  }
}
