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
  const [error, setError] = useState('');
  
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
      console.log('🔄 Fetching pemilik data for ID:', id);
      // Gunakan endpoint yang benar dengan ID
      const response = await axiosInstance.get(`/pemilik/${id}`);
      console.log('✅ Pemilik data fetched:', response.data);
      
      const pemilik = response.data.data || response.data;
      setFormData({
        nama_pemilik: pemilik.nama_pemilik || '',
        no_hp: pemilik.no_hp || '',
        alamat: pemilik.alamat || '',
        email: pemilik.email || ''
      });
    } catch (error) {
      console.error('❌ Error fetching pemilik data:', error);
      setError('Data pemilik tidak ditemukan');
      alert('Data pemilik tidak ditemukan');
      navigate('/home');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error saat user mulai mengetik
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  };

  const validateForm = () => {
    if (!formData.nama_pemilik.trim()) {
      setError('Nama pemilik harus diisi');
      return false;
    }
    if (!formData.no_hp.trim()) {
      setError('Nomor HP harus diisi');
      return false;
    }
    if (!validatePhone(formData.no_hp)) {
      setError('Format nomor HP tidak valid (minimal 10 digit)');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email harus diisi');
      return false;
    }
    if (!validateEmail(formData.email)) {
      setError('Format email tidak valid');
      return false;
    }
    if (!formData.alamat.trim()) {
      setError('Alamat harus diisi');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      console.log('🔄 Saving pemilik data:', formData);
      
      // Trim whitespace dari semua field
      const cleanFormData = {
        nama_pemilik: formData.nama_pemilik.trim(),
        no_hp: formData.no_hp.trim(),
        alamat: formData.alamat.trim(),
        email: formData.email.trim().toLowerCase()
      };

      if (isEdit) {
        // PUT untuk update data existing
        await axiosInstance.put(`/pemilik/${id}`, cleanFormData);
        console.log('✅ Pemilik data updated successfully');
        alert('Data pemilik berhasil diperbarui!');
      } else {
        // POST untuk create data baru
        await axiosInstance.post('/pemilik', cleanFormData);
        console.log('✅ Pemilik data created successfully');
        alert('Data pemilik berhasil ditambahkan!');
      }
      navigate('/home');
    } catch (error) {
      console.error('❌ Error saving pemilik:', error);
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        switch (status) {
          case 400:
            setError(data.message || 'Data yang dimasukkan tidak valid');
            break;
          case 409:
            setError('Email atau nomor HP sudah digunakan');
            break;
          case 500:
            setError('Terjadi kesalahan server. Silakan coba lagi nanti.');
            break;
          default:
            setError(data.message || `Error ${status}: Gagal menyimpan data`);
        }
      } else {
        setError('Tidak dapat terhubung ke server');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/home');
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
        {error && (
          <div className="error-message" role="alert">
            ❌ {error}
          </div>
        )}

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
              disabled={loading}
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
              disabled={loading}
            />
            {formData.no_hp && !validatePhone(formData.no_hp) && (
              <span className="error-text">
                Format nomor HP tidak valid (minimal 10 digit)
              </span>
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading || !isFormValid()}
            >
              {loading ? '⏳ Menyimpan...' : (isEdit ? '📝 Perbarui Data' : '💾 Simpan Data')}
            </button>
            <button 
              type="button" 
              className="cancel-btn"
              onClick={handleCancel}
              disabled={loading}
            >
              ❌ Batal
            </button>
          </div>
        </form>

        <div className="form-info">
          <h3>Informasi:</h3>
          <ul>
            <li>Semua field yang bertanda (*) wajib diisi</li>
            <li>Email harus menggunakan format yang benar (contoh: user@email.com)</li>
            <li>Nomor HP harus berupa angka dan minimal 10 digit</li>
            <li>Alamat harus diisi dengan lengkap dan jelas</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DataPemilik;