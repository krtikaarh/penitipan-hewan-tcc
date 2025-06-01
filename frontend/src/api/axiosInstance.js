// update

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://penitipan-hewan-backend-353267785618.asia-southeast2.run.app/api",
  withCredentials: true,
  timeout: 15000, // Tingkatkan timeout jadi 15 detik
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log(`🚀 [${config.method?.toUpperCase()}] ${config.baseURL}${config.url}`);
    console.log('📤 Request data:', config.data);
    
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ [${response.config.method?.toUpperCase()}] ${response.status}`, response.data);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    console.error('❌ Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });

    // Auto refresh token untuk 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        console.log('🔄 Attempting token refresh...');
        const refreshResponse = await axios.get(
          `${axiosInstance.defaults.baseURL}/token`,
          { withCredentials: true }
        );
        
        const newToken = refreshResponse.data.accessToken;
        localStorage.setItem("token", newToken);
        
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        console.log('✅ Token refreshed successfully');
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError);
        localStorage.removeItem("token");
        localStorage.removeItem('username');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;