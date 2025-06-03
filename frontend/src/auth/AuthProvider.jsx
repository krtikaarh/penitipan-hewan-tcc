//update

import { createContext, useContext, useState, useEffect } from "react"
import Cookies from "js-cookie"
import axiosInstance from "../api/axiosInstance.js"
import PropTypes from "prop-types"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem("token") || null
  })
  const [user, setUser] = useState(() => {
    return localStorage.getItem("username") || null
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(!!accessToken)

  // Update isAuthenticated when accessToken changes
  useEffect(() => {
    setIsAuthenticated(!!accessToken)
  }, [accessToken])

  const login = async (username, password) => {
    setIsLoading(true)
    try {
      console.log("🔄 Attempting login...")
      const res = await axiosInstance.post("/login", { username, password })
      const token = res.data.accessToken

      console.log("✅ Login successful")

      // Update state
      setAccessToken(token)
      setUser(username)
      setIsAuthenticated(true)

      // Save to localStorage
      localStorage.setItem("token", token)
      localStorage.setItem("username", username)

      // Note: Refresh token sudah disimpan sebagai httpOnly cookie oleh backend
      // Jadi kita tidak perlu mengelolanya di frontend

      return { success: true }
    } catch (err) {
      console.error("❌ Login failed:", err)

      const errorMessage = err.response?.data?.message || err.message || "Login gagal"
      return {
        success: false,
        error: errorMessage,
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      console.log("🔄 Attempting logout...")

      // Call backend logout to clear refresh token
      await axiosInstance.delete("/logout")
      console.log("✅ Logout successful")
    } catch (err) {
      console.error("⚠️ Logout API call failed:", err)
      // Continue with local logout even if API fails
    } finally {
      // Clear local state regardless of API call result
      setAccessToken(null)
      setUser(null)
      setIsAuthenticated(false)
      localStorage.removeItem("token")
      localStorage.removeItem("username")

      // Clear any cookies (backup, though backend should handle this)
      Cookies.remove("refreshToken")

      setIsLoading(false)
      console.log("✅ Local logout completed")
    }
  }

  const refreshAccessToken = async () => {
    try {
      console.log("🔄 Refreshing access token...")
      const res = await axiosInstance.get("/token")
      const newToken = res.data.accessToken

      console.log("✅ Token refreshed successfully")

      setAccessToken(newToken)
      localStorage.setItem("token", newToken)

      return newToken
    } catch (err) {
      console.error("❌ Token refresh failed:", err)

      // If refresh fails, logout user
      await logout()
      return null
    }
  }

  // Check if user is still authenticated on app start
  useEffect(() => {
    const checkAuth = async () => {
      if (accessToken) {
        try {
          // Try to refresh token to verify it's still valid
          await refreshAccessToken()
        } catch (err) {
          console.log("Token validation failed, logging out...")
          await logout()
        }
      }
    }

    checkAuth()
  }, []) // Only run on mount

  const contextValue = {
    // State
    accessToken,
    user,
    isAuthenticated,
    isLoading,

    // Actions
    login,
    logout,
    refreshAccessToken,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider")
  }
  return context
}

// Custom hook for protected routes
export const useRequireAuth = () => {
  const { isAuthenticated, isLoading } = useAuthContext()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login if not authenticated
      window.location.href = "/login"
    }
  }, [isAuthenticated, isLoading])

  return { isAuthenticated, isLoading }
}
