import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://penitipan-hewan-backend-353267785618.asia-southeast2.run.app/api",
  withCredentials: true,
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor - menambahkan token ke header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request untuk debugging
    console.log(`[${config.method?.toUpperCase()}] ${config.url}`, {
      headers: config.headers,
      data: config.data
    });
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle response dan error
axiosInstance.interceptors.response.use(
  (response) => {
    // Log successful response
    console.log(`[${response.config.method?.toUpperCase()}] ${response.config.url} - ${response.status}`, response.data);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Log error untuk debugging
    console.error('Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    // Jika 401 dan belum retry, coba refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshResponse = await axios.get(
          `${axiosInstance.defaults.baseURL}token`,
          { withCredentials: true }
        );
        
        const newToken = refreshResponse.data.accessToken;
        localStorage.setItem("token", newToken);
        
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem("token");
        localStorage.removeItem('username');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;