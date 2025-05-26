import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import '../css/detail.css';

const DataPemilik = () => {
  const [formData, setFormData] = useState({
    nama_pemilik: '',
    no_hp: '',
    alamat: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setIsEdit(true);
      fetchPemilikData();
    }
  }, [id]);

  const fetchPemilikData = async () => {
    try {
      const response = await axiosInstance.get(`https://penitipan-hewan-backend-353267785618.asia-southeast2.run.app/`, {
        withCredentials: true
      });
      const pemilik = response.data.data;
      setFormData({
        nama_pemilik: pemilik.nama_pemilik,
        no_hp: pemilik.no_hp,
        alamat: pemilik.alamat,
        email: pemilik.email
      });
    } catch (error) {
      console.error('Error fetching pemilik data:', error);
      alert('Data pemilik tidak ditemukan');
      navigate('/home');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        await axiosInstance.put(`https://penitipan-hewan-backend-353267785618.asia-southeast2.run.app/`, formData, {
          withCredentials: true
        });
        alert('Data pemilik berhasil diperbarui!');
      } else {
        await axiosInstance.post('https://penitipan-hewan-backend-353267785618.asia-southeast2.run.app/', formData, {
          withCredentials: true
        });
        alert('Data pemilik berhasil ditambahkan!');
      }
      navigate('/home');
    } catch (error) {
      console.error('Error saving pemilik:', error);
      alert('Error menyimpan data pemilik: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/home');
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone);
  };

  const isFormValid = () => {
    return (
      formData.nama_pemilik.trim() &&
      formData.no_hp.trim() &&
      formData.alamat.trim() &&
      formData.email.trim() &&
      validateEmail(formData.email) &&
      validatePhone(formData.no_hp)
    );
  };

  return (
    <div className="data-container">
      <div className="data-header">
        <h1>{isEdit ? 'Edit Data Pemilik' : 'Tambah Data Pemilik'}</h1>
        <button className="back-btn" onClick={handleCancel}>
          Kembali
        </button>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="data-form">
          <div className="form-group">
            <label htmlFor="nama_pemilik">Nama Pemilik *</label>
            <input
              type="text"
              id="nama_pemilik"
              name="nama_pemilik"
              value={formData.nama_pemilik}
              onChange={handleInputChange}
              placeholder="Masukkan nama lengkap pemilik"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="no_hp">Nomor HP *</label>
            <input
              type="tel"
              id="no_hp"
              name="no_hp"
              value={formData.no_hp}
              onChange={handleInputChange}
              placeholder="Masukkan nomor HP (contoh: 081234567890)"
              required
            />
            {formData.no_hp && !validatePhone(formData.no_hp) && (
              <span className="error-text">Format nomor HP tidak valid</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Masukkan alamat email"
              required
            />
            {formData.email && !validateEmail(formData.email) && (
              <span className="error-text">Format email tidak valid</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="alamat">Alamat Lengkap *</label>
            <textarea
              id="alamat"
              name="alamat"
              value={formData.alamat}
              onChange={handleInputChange}
              placeholder="Masukkan alamat lengkap pemilik"
              rows="4"
              required
            />
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading || !isFormValid()}
            >
              {loading ? 'Menyimpan...' : (isEdit ? 'Perbarui Data' : 'Simpan Data')}
            </button>
            <button 
              type="button" 
              className="cancel-btn"
              onClick={handleCancel}
              disabled={loading}
            >
              Batal
            </button>
          </div>
        </form>

        <div className="form-info">
          <h3>Informasi:</h3>
          <ul>
            <li>Semua field yang bertanda (*) wajib diisi</li>
            <li>Pastikan email menggunakan format yang benar</li>
            <li>Nomor HP harus berupa angka yang valid</li>
            <li>Alamat harus diisi dengan lengkap</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DataPemilik;