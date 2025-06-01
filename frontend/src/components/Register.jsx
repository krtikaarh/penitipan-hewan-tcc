import React, { useState } from 'react';
import '../css/login.css';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axiosInstance.js';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    console.log('🚀 Starting registration process...');
    console.log('📝 Form data:', { username, password: '***' });
    console.log('🌐 Base URL:', axios.defaults.baseURL);

    try {
      console.log('📤 Sending POST request to /register...');
      const response = await axios.post('/register', { username, password });
      
      console.log('✅ Registration successful:', response.data);
      console.log('📊 Response status:', response.status);
      
      // Redirect ke login setelah berhasil register
      navigate('/login');
    } catch (error) {
      console.error('❌ Registration failed:', error);
      
      // Log complete error object
      console.log('🔍 Full error object:', {
        message: error.message,
        code: error.code,
        request: error.request,
        response: error.response
      });
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data || 'Registrasi gagal';
        
        console.log('📨 Error response data:', error.response.data);
        console.log('🚨 Error status:', status);
        console.log('📄 Response headers:', error.response.headers);
        
        if (status === 404) {
          setErrorMsg('❌ Endpoint tidak ditemukan. Server mungkin sedang bermasalah.');
        } else if (status === 400) {
          setErrorMsg('Username sudah digunakan atau data tidak valid');
        } else if (status === 500) {
          // Handle specific database errors
          if (message.includes('Access denied') || message.includes('User gagal dibuat')) {
            setErrorMsg('Sistem sedang dalam perbaikan. Silakan coba lagi nanti.');
          } else {
            setErrorMsg('Server error. Silakan coba lagi nanti.');
          }
        } else {
          setErrorMsg(`Error ${status}: ${message}`);
        }
      } else if (error.request) {
        // Request was made but no response received
        console.log('🔌 No response received:', error.request);
        setErrorMsg('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
      } else {
        // Something else happened
        console.log('⚠️ Unknown error:', error.message);
        setErrorMsg('Terjadi kesalahan: ' + error.message);
      }
    } finally {
      setIsLoading(false);
      console.log('🏁 Registration process completed');
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <h2>Daftar</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
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
            onChange={e => setPassword(e.target.value)}
            placeholder="masukkan password"
            required
            autoComplete="new-password"
            disabled={isLoading}
          />

          {errorMsg && (
            <div className="error-message" role="alert" aria-live="assertive">
              {errorMsg}
            </div>
          )}

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Mendaftar...' : 'Register'}
          </button>
        </form>
        <div className="form-footer">
          Sudah punya akun? <Link to="/login">Masuk</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;