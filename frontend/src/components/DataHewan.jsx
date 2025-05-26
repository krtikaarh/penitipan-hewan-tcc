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
      const response = await axiosInstance.get('https://penitipan-hewan-backend-353267785618.asia-southeast2.run.app/', {
        withCredentials: true,
      });
      console.log('Pemilik data fetched:', response.data);
      setPemilikData(response.data.data || []);
    } catch (error) {
      console.error('Error fetching pemilik data:', error);
    }
  };

  const fetchHewanData = async () => {
    try {
      const response = await axiosInstance.get(`https://penitipan-hewan-backend-353267785618.asia-southeast2.run.app/`, {
        withCredentials: true
      });
      const hewan = response.data.data;
      setFormData({
        nama_hewan: hewan.nama_hewan,
        bobot_hewan: hewan.bobot_hewan,
        keterangan_khusus: hewan.keterangan_khusus,
        ras: hewan.ras,
        gambar: hewan.gambar,
        pemilikId: hewan.pemilikId
      });
    } catch (error) {
      console.error('Error fetching hewan data:', error);
      alert('Data hewan tidak ditemukan');
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

    console.log("Token sekarang:", localStorage.getItem("accessToken"));

    try {
      if (isEdit) {
        await axiosInstance.put(`https://penitipan-hewan-backend-353267785618.asia-southeast2.run.app/`, formData, {
          withCredentials: true
        });
        alert('Data hewan berhasil diperbarui!');
      } else {
        await axiosInstance.post('https://penitipan-hewan-backend-353267785618.asia-southeast2.run.app/', formData, {
          withCredentials: true
        });
        alert('Data hewan berhasil ditambahkan!');
      }
      navigate('/home');
    } catch (error) {
      console.error('Error saving hewan:', error);
      alert('Error menyimpan data hewan: ' + (error.response?.data?.message || error.message));
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
              min="0"
              step="0.1"
              required
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
            />
            {formData.gambar && (
              <div className="image-preview">
                <img src={formData.gambar} alt="Preview" />
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
            >
              <option value="">Pilih Pemilik</option>
              {pemilikData.map((pemilik) => (
                <option key={pemilik.id} value={pemilik.id}>
                  {pemilik.nama_pemilik} - {pemilik.no_hp}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
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
      </div>
    </div>
  );
};

export default DataHewan;