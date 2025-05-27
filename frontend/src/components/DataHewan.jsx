import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import '../css/detail.css';

const DataHewan = () => {
  const [formData, setFormData] = useState({
    nama_hewan: '',
    bobot_hewan: '',
    keterangan_khusus: '',
    ras: '',
    gambar: '',
    pemilikId: ''
  });
  const [pemilikData, setPemilikData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchPemilikData();
    if (id) {
      setIsEdit(true);
      fetchHewanData();
    }
  }, [id]);

  const fetchPemilikData = async () => {
    try {
      console.log('🔄 Fetching pemilik data...');
      // Gunakan endpoint yang benar untuk mengambil data pemilik
      const response = await axiosInstance.get('/pemilik');
      console.log('✅ Pemilik data fetched:', response.data);
      
      // Adjust sesuai struktur response dari backend
      setPemilikData(response.data.data || response.data || []);
    } catch (error) {
      console.error('❌ Error fetching pemilik data:', error);
      setError('Gagal mengambil data pemilik');
      
      // Set data dummy untuk development/testing
      setPemilikData([
        { id: 1, nama_pemilik: 'John Doe', no_hp: '081234567890' },
        { id: 2, nama_pemilik: 'Jane Smith', no_hp: '089876543210' }
      ]);
    }
  };

  const fetchHewanData = async () => {
    try {
      console.log('🔄 Fetching hewan data for ID:', id);
      // Gunakan endpoint yang benar dengan ID
      const response = await axiosInstance.get(`/hewan/${id}`);
      console.log('✅ Hewan data fetched:', response.data);
      
      const hewan = response.data.data || response.data;
      setFormData({
        nama_hewan: hewan.nama_hewan || '',
        bobot_hewan: hewan.bobot_hewan || '',
        keterangan_khusus: hewan.keterangan_khusus || '',
        ras: hewan.ras || '',
        gambar: hewan.gambar || '',
        pemilikId: hewan.pemilikId || ''
      });
    } catch (error) {
      console.error('❌ Error fetching hewan data:', error);
      setError('Data hewan tidak ditemukan');
      alert('Data hewan tidak ditemukan');
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

  const validateForm = () => {
    if (!formData.nama_hewan.trim()) {
      setError('Nama hewan harus diisi');
      return false;
    }
    if (!formData.bobot_hewan || formData.bobot_hewan <= 0) {
      setError('Bobot hewan harus diisi dan lebih dari 0');
      return false;
    }
    if (!formData.pemilikId) {
      setError('Pemilik hewan harus dipilih');
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
      console.log('🔄 Saving hewan data:', formData);
      
      if (isEdit) {
        // PUT untuk update data existing
        await axiosInstance.put(`/hewan/${id}`, formData);
        console.log('✅ Hewan data updated successfully');
        alert('Data hewan berhasil diperbarui!');
      } else {
        // POST untuk create data baru
        await axiosInstance.post('/hewan', formData);
        console.log('✅ Hewan data created successfully');
        alert('Data hewan berhasil ditambahkan!');
      }
      navigate('/home');
    } catch (error) {
      console.error('❌ Error saving hewan:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Terjadi kesalahan';
      setError(`Error menyimpan data hewan: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/home');
  };

  return (
    <div className="data-container">
      <div className="data-header">
        <h1>{isEdit ? 'Edit Data Hewan' : 'Tambah Data Hewan'}</h1>
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
            <label htmlFor="nama_hewan">Nama Hewan *</label>
            <input
              type="text"
              id="nama_hewan"
              name="nama_hewan"
              value={formData.nama_hewan}
              onChange={handleInputChange}
              placeholder="Masukkan nama hewan"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="bobot_hewan">Bobot Hewan (kg) *</label>
            <input
              type="number"
              id="bobot_hewan"
              name="bobot_hewan"
              value={formData.bobot_hewan}
              onChange={handleInputChange}
              placeholder="Masukkan bobot hewan"
              min="0.1"
              step="0.1"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="ras">Ras Hewan</label>
            <input
              type="text"
              id="ras"
              name="ras"
              value={formData.ras}
              onChange={handleInputChange}
              placeholder="Masukkan ras hewan"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="keterangan_khusus">Keterangan Khusus</label>
            <textarea
              id="keterangan_khusus"
              name="keterangan_khusus"
              value={formData.keterangan_khusus}
              onChange={handleInputChange}
              placeholder="Masukkan keterangan khusus"
              rows="4"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="gambar">URL Gambar</label>
            <input
              type="url"
              id="gambar"
              name="gambar"
              value={formData.gambar}
              onChange={handleInputChange}
              placeholder="Masukkan URL gambar hewan"
              disabled={loading}
            />
            {formData.gambar && (
              <div className="image-preview">
                <img 
                  src={formData.gambar} 
                  alt="Preview" 
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="pemilikId">Pemilik Hewan *</label>
            <select
              id="pemilikId"
              name="pemilikId"
              value={formData.pemilikId}
              onChange={handleInputChange}
              required
              disabled={loading}
            >
              <option value="">Pilih Pemilik</option>
              {pemilikData.map((pemilik) => (
                <option key={pemilik.id} value={pemilik.id}>
                  {pemilik.nama_pemilik} - {pemilik.no_hp}
                </option>
              ))}
            </select>
            {pemilikData.length === 0 && (
              <small className="form-text">
                Tidak ada data pemilik. Tambahkan data pemilik terlebih dahulu.
              </small>
            )}
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading || pemilikData.length === 0}
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
            <li>Field bertanda (*) wajib diisi</li>
            <li>Bobot hewan dalam satuan kilogram</li>
            <li>Pastikan memilih pemilik yang sesuai</li>
            <li>URL gambar harus valid (opsional)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DataHewan;