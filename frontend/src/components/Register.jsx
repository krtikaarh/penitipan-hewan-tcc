// update

import React, { useState } from 'react';
import '../css/login.css';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axiosInstance.js';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    // Validasi input
    if (!username.trim() || !password.trim()) {
      setErrorMsg('Username dan password tidak boleh kosong');
      setIsLoading(false);
      return;
    }

    if (password.length < 4) {
      setErrorMsg('Password minimal 4 karakter');
      setIsLoading(false);
      return;
    }

    try {
      console.log('🚀 Attempting registration for:', username);
      
      const response = await axios.post('/register', { 
        username: username.trim(), 
        password 
      });
      
      console.log('✅ Registrasi berhasil:', response.data);
      setSuccessMsg('Registrasi berhasil! Mengalihkan ke halaman login...');
      
      // Delay sebelum redirect untuk menampilkan pesan sukses
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      console.error('❌ Registrasi gagal:', error);
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || 'Registrasi gagal';
        
        console.log('📝 Error details:', {
          status,
          message,
          data: error.response.data
        });
        
        switch (status) {
          case 400:
            setErrorMsg(message || 'Username sudah digunakan atau data tidak valid');
            break;
          case 404:
            setErrorMsg('Endpoint tidak ditemukan. Hubungi administrator.');
            break;
          case 500:
            if (message.includes('Access denied') || message.includes('connect ECONNREFUSED')) {
              setErrorMsg('Database tidak dapat diakses. Silakan coba lagi nanti.');
            } else {
              setErrorMsg('Server error. Silakan coba lagi nanti.');
            }
            break;
          default:
            setErrorMsg(`Error ${status}: ${message}`);
        }
      } else if (error.request) {
        console.log('📡 No response received:', error.request);
        setErrorMsg('Tidak dapat terhubung ke server. Periksa koneksi internet.');
      } else if (error.code === 'ECONNABORTED') {
        setErrorMsg('Request timeout. Server terlalu lama merespon.');
      } else {
        console.log('⚠️ Other error:', error.message);
        setErrorMsg('Terjadi kesalahan: ' + error.message);
      }
    } finally {
      setIsLoading(false);
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
            minLength={3}
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="masukkan password (minimal 4 karakter)"
            required
            autoComplete="new-password"
            disabled={isLoading}
            minLength={4}
          />

          {errorMsg && (
            <div className="error-message" role="alert" aria-live="assertive">
              ❌ {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="success-message" role="alert" aria-live="assertive">
              ✅ {successMsg}
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