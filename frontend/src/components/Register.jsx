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

  try {
    const response = await axios.post('/api/register', { 
      username, 
      password 
    });
    
    console.log('Registrasi berhasil:', response.data);
    navigate('/login');
  } catch (error) {
    console.error('Registrasi gagal:', error);
    
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || 'Registrasi gagal';
      
      if (status === 400) {
        setErrorMsg(message);
      } else {
        setErrorMsg(`Error: ${message}`);
      }
    } else {
      setErrorMsg('Tidak dapat terhubung ke server');
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