import React, { useState } from 'react';
import axios from '../api/axiosInstance';
import '../css/login.css';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const response = await axios.post('/login', { username, password });
      const { accessToken } = response.data;
      
      // Fix: Use 'accessToken' consistently (matching axiosInstance)
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('username', username);
      navigate('/home');
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message;
        
        if (status === 404) {
          setErrorMsg('❌ Endpoint tidak ditemukan. Server mungkin sedang bermasalah.');
        } else if (status === 401) {
          setErrorMsg('Username atau password salah');
        } else if (status === 500) {
          setErrorMsg('Server error. Silakan coba lagi nanti.');
        } else {
          setErrorMsg(message || 'Login gagal');
        }
      } else if (error.request) {
        setErrorMsg('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
      } else {
        setErrorMsg('Terjadi kesalahan: ' + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

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
            autoComplete="current-password"
            disabled={isLoading}
          />

          {errorMsg && (
            <div className="error-message" role="alert" aria-live="assertive">
              {errorMsg}
            </div>
          )}

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Masuk...' : 'Login'}
          </button>
        </form>
        <div className="form-footer">
          Belum punya akun? <Link to="/register">Daftar</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;