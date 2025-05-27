import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';


import Login from './components/Login';
import Register from './components/Register';
import DataHewan from './components/DataHewan';
import DataPemilik from './components/DataPemilik';
import EditPemilik from './components/EditPemilik'; 
import EditHewan from './components/EditHewan'; 
import Home from './components/Home';

function App() {
  return (
    <>

    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/datahewan" element={<DataHewan />} />
      <Route path="/datapemilik" element={<DataPemilik />} />
      <Route path="/datapemilik/:id" element={<EditPemilik />} />
      <Route path="/datahewan/:id" element={<EditHewan />} />
      <Route path="*" element={<h2 style={{textAlign: "center", marginTop: 50}}>404 - Halaman tidak ditemukan</h2>} />
    </Routes>
    </>
  );
}

export default App;
