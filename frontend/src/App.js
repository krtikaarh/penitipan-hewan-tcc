// update

import { Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./auth/AuthProvider"

import Login from "./components/Login"
import Register from "./components/Register"
import DataHewan from "./components/DataHewan"
import DataPemilik from "./components/DataPemilik"
import EditPemilik from "./components/EditPemilik"
import EditHewan from "./components/EditHewan"
import Home from "./components/Home"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/datahewan"
          element={
            <ProtectedRoute>
              <DataHewan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/datapemilik"
          element={
            <ProtectedRoute>
              <DataPemilik />
            </ProtectedRoute>
          }
        />
        <Route
          path="/datapemilik/:id"
          element={
            <ProtectedRoute>
              <EditPemilik />
            </ProtectedRoute>
          }
        />
        <Route
          path="/datahewan/:id"
          element={
            <ProtectedRoute>
              <EditHewan />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<h2 style={{ textAlign: "center", marginTop: 50 }}>404 - Halaman tidak ditemukan</h2>}
        />
      </Routes>
    </AuthProvider>
  )
}

export default App
