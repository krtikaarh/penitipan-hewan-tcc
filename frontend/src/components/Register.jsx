// update

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axiosInstance from "../api/axiosInstance"
import "../css/login.css"

function Register() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg("")
    setIsLoading(true)

    // Validation
    if (!username.trim() || !password.trim()) {
      setErrorMsg("Username dan password harus diisi")
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setErrorMsg("Password dan konfirmasi password tidak sama")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setErrorMsg("Password minimal 6 karakter")
      setIsLoading(false)
      return
    }

    try {
      console.log("🔄 Attempting registration...")
      console.log("Request data:", { username: username.trim(), password })

      // Test direct fetch untuk debugging
      const response = await fetch(`${axiosInstance.defaults.baseURL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      })

      const data = await response.json()
      console.log("✅ Registration response:", response.status, data)

      if (response.ok) {
        alert("Registrasi berhasil! Silakan login.")
        navigate("/login")
      } else {
        setErrorMsg(data.message || "Registrasi gagal")
      }
    } catch (error) {
      console.error("❌ Registration failed:", error)

      if (error.response) {
        const status = error.response.status
        const message = error.response.data?.message || "Registrasi gagal"

        switch (status) {
          case 400:
            setErrorMsg(message)
            break
          case 409:
            setErrorMsg("Username sudah digunakan")
            break
          case 500:
            setErrorMsg("Terjadi kesalahan server. Silakan coba lagi nanti.")
            break
          default:
            setErrorMsg(`Error: ${message}`)
        }
      } else if (error.code === "ECONNABORTED") {
        setErrorMsg("Koneksi timeout. Silakan coba lagi.")
      } else {
        setErrorMsg("Tidak dapat terhubung ke server")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <h2>Daftar Akun Baru</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Masukkan username"
            required
            autoComplete="username"
            disabled={isLoading}
            minLength={3}
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan password (minimal 6 karakter)"
            required
            autoComplete="new-password"
            disabled={isLoading}
            minLength={6}
          />

          <label htmlFor="confirmPassword">Konfirmasi Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Ulangi password"
            required
            autoComplete="new-password"
            disabled={isLoading}
            minLength={6}
          />

          {errorMsg && (
            <div className="error-message" role="alert" aria-live="assertive">
              ❌ {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !username.trim() || !password.trim() || password !== confirmPassword}
          >
            {isLoading ? "⏳ Mendaftar..." : "Register"}
          </button>
        </form>

        <div className="form-footer">
          Sudah punya akun? <Link to="/login">Masuk</Link>
        </div>

        <div className="form-info">
          <h4>Syarat Password:</h4>
          <ul>
            <li>Minimal 6 karakter</li>
            <li>Username minimal 3 karakter</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Register
