import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance'; // import axiosInstance bukan axios
import '../css/home.css';
import useAuth from '../auth/useAuth';

const Home = () => {
  const [hewanData, setHewanData] = useState([]);
  const [pemilikData, setPemilikData] = useState([]);
  const { accessToken, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      // Kalau belum login, redirect ke login
      navigate('/login');
      return;
    }
    // Kalau sudah login, fetch data
    fetchHewanData();
    fetchPemilikData();
  }, [isAuthenticated, navigate]);

  const fetchHewanData = async () => {
    try {
      const response = await axiosInstance.get('/daftarhewan');
      setHewanData(response.data.data || []);
    } catch (error) {
      console.error('Error fetching hewan data:', error);
    }
  };

  const fetchPemilikData = async () => {
    try {
      const response = await axiosInstance.get('/daftarpemilik');
      setPemilikData(response.data.data || []);
    } catch (error) {
      console.error('Error fetching pemilik data:', error);
    }
  };

  const handleDeleteHewan = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data hewan ini?')) {
      try {
        await axiosInstance.delete(`/daftarhewan/${id}`);
        fetchHewanData();
      } catch (error) {
        console.error('Error deleting hewan:', error);
        alert('Error menghapus data hewan');
      }
    }
  };

  const handleDeletePemilik = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data pemilik ini?')) {
      try {
        await axiosInstance.delete(`/daftarpemilik/${id}`);
        fetchPemilikData();
      } catch (error) {
        console.error('Error deleting pemilik:', error);
        alert('Error menghapus data pemilik');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.delete('/logout');
      localStorage.removeItem('accessToken'); // hapus token juga saat logout
      navigate('/login');
    } catch (error) {
      console.error('Error logout:', error);
    }
  };

  return (
    <div className="home-container">
      <div className="header">
        <h1>Penitipan Hewan Corner.</h1>
        <button className="logout-btn" onClick={handleLogout}>Keluar</button>
      </div>

      <div className="content">
        {/* Section Data Hewan */}
        <div className="data-section">
          <button 
            className="add-btn"
            onClick={() => navigate('/datahewan')}
          >
            Tambah Data Hewan
          </button>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Nama Hewan</th>
                  <th>Berat</th>
                  <th>Keterangan</th>
                  <th>Ras</th>
                  <th>Gambar</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {hewanData.map((hewan) => (
                  <tr key={hewan.id}>
                    <td>{hewan.id}</td>
                    <td>{hewan.nama_hewan}</td>
                    <td>{hewan.bobot_hewan} kg</td>
                    <td>{hewan.keterangan_khusus}</td>
                    <td>{hewan.ras}</td>
                    <td>
                      {hewan.gambar ? (
                        <img 
                          src={hewan.gambar} 
                          alt={hewan.nama_hewan}
                          className="table-image"
                        />
                      ) : (
                        'No Image'
                      )}
                    </td>
                    <td>
                      <button 
                        className="edit-btn"
                        onClick={() => navigate(`/datahewan/${hewan.id}`)}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteHewan(hewan.id)}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
                {hewanData.length === 0 && (
                  <tr>
                    <td colSpan="7" className="no-data">
                      Belum ada data hewan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section Data Pemilik */}
        <div className="data-section">
          <button 
            className="add-btn"
            onClick={() => navigate('/datapemilik')}
          >
            Tambah Data Pemilik
          </button>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Nama Pemilik</th>
                  <th>No Hp</th>
                  <th>Alamat</th>
                  <th>Email</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pemilikData.map((pemilik) => (
                  <tr key={pemilik.id}>
                    <td>{pemilik.id}</td>
                    <td>{pemilik.nama_pemilik}</td>
                    <td>{pemilik.no_hp}</td>
                    <td>{pemilik.alamat}</td>
                    <td>{pemilik.email}</td>
                    <td>
                      <button 
                        className="edit-btn"
                        onClick={() => navigate(`/datapemilik/${pemilik.id}`)}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeletePemilik(pemilik.id)}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
                {pemilikData.length === 0 && (
                  <tr>
                    <td colSpan="6" className="no-data">
                      Belum ada data pemilik
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;