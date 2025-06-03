// update

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuthContext } from "../auth/AuthProvider"
import "../css/login.css"

function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const { login, isLoading } = useAuthContext()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg("")

    if (!username.trim() || !password.trim()) {
      setErrorMsg("Username dan password harus diisi")
      return
    }

    const result = await login(username, password)

    if (result.success) {
      console.log("✅ Login successful, redirecting to home")
      navigate("/home")
    } else {
      setErrorMsg(result.error)
    }
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <h2>Penitipan Hewan</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="masukkan username"
            required
            autoComplete="username"
            disabled={isLoading}
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="masukkan password"
            required
            autoComplete="current-password"
            disabled={isLoading}
          />

          {errorMsg && (
            <div className="error-message" role="alert" aria-live="assertive">
              {errorMsg}
            </div>
          )}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="form-footer">
          Belum punya akun? <Link to="/register">Daftar</Link>
        </div>
      </div>
    </div>
  )
}

export default Login
