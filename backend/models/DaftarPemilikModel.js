// update

import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const DaftarPemilik = db.define("daftar_pemilik", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nama_pemilik: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  no_hp: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  alamat: {
    type: DataTypes.TEXT,
    allowNull: false, // ✅ Ubah menjadi false agar konsisten dengan controller
  }, 
  email: {
    type: DataTypes.STRING,
    allowNull: false, // ✅ Ubah menjadi false agar konsisten dengan controller
  },
  userId: { // ✅ Tambahkan field userId yang hilang
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  freezeTableName: true,
  timestamps: true,
  createdAt: "Tanggal_dibuat",
  updatedAt: "Tanggal_diperbarui",
});

export default DaftarPemilik;