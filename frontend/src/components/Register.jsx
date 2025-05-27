import React, { useState } from 'react';
import '../css/login.css';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axiosInstance.js';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    // Validasi client-side
    if (!formData.username.trim() || !formData.password.trim()) {
      setErrorMsg('Username dan password wajib diisi');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg('Password minimal 6 karakter');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('/register', formData);
      
      if (response.data.success) {
        navigate('/login', { 
          state: { 
            registrationSuccess: true,
            username: formData.username 
          } 
        });
      } else {
        setErrorMsg(response.data.message || 'Registrasi gagal');
      }
    } catch (error) {
      let errorMessage = 'Terjadi kesalahan';
      
      if (error.response) {
        // Error dari server
        const { status, data } = error.response;
        
        if (status === 400) {
          errorMessage = data.message || 'Data tidak valid';
        } 
        else if (status === 409) {
          errorMessage = 'Username sudah digunakan';
        }
        else if (status === 500) {
          errorMessage = 'Server error. Silakan coba lagi nanti.';
        }
      } 
      else if (error.request) {
        errorMessage = 'Tidak ada respon dari server';
      } 
      else {
        errorMessage = error.message;
      }

      setErrorMsg(errorMessage);
      console.error('Registration error:', error);
    } 
    finally {
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