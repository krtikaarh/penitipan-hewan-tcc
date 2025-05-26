import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://penitipan-hewan-backend-353267785618.asia-southeast2.run.app/",
  withCredentials: true, // untuk kirim cookie kalau ada
});

// Interceptor supaya tiap request otomatis kirim header Authorization kalau ada token di localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;