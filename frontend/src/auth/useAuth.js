import { useState, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";
// import { BASE_URL } from "../utils/utils";

const useAuth = () => {
  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem("accessToken") || null;
  });

  // Simpan token ke localStorage & state
  const saveAccessToken = (token) => {
    localStorage.setItem("accessToken", token);
    setAccessToken(token);
  };

  // Login: POST ke backend, simpan token
  const login = async (username, password) => {
    try {
      const res = await axiosInstance.post('/login', { username, password });
      const token = res.data.accessToken;

    // Simpan token ke localStorage dan state di sini
    localStorage.setItem("accessToken", token);  // <-- Ini tempatnya
    setAccessToken(token);
    
      return true;
    } catch (err) {
      throw err;
    }
  };

  // Logout: hapus token dan panggil API logout
  const logout = useCallback(async () => {
    try {
      await axiosInstance.delete("/logout");
    } catch (_) {
      // ignore error logout
    }
    localStorage.removeItem("accessToken");
    setAccessToken(null);
    // Bisa redirect ke halaman login di komponen yang pakai hook ini
  }, []);

  // Refresh token: panggil API refresh token (backend harus kirim cookie HttpOnly)
  const refreshAccessToken = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/token");
      const newToken = res.data.accessToken;
      saveAccessToken(newToken);
      return newToken;
    } catch (err) {
      logout();
      return null;
    }
  }, [logout]);

  // Cek apakah user sudah login
  const isAuthenticated = !!accessToken;

  return {
    accessToken,
    isAuthenticated,
    login,
    logout,
    refreshAccessToken,
  };
};

export default useAuth;
