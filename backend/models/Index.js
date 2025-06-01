import db from "../config/Database.js";
import User from "./UserModel.js";
import DaftarHewan from "./DaftarHewanModel.js";
import DaftarPemilik from "./DaftarPemilikModel.js";

// Relasi User - DaftarPemilik
User.hasMany(DaftarPemilik, { foreignKey: "userId", onDelete: "CASCADE" });
DaftarPemilik.belongsTo(User, { foreignKey: "userId" });

// Relasi DaftarPemilik - DaftarHewan
DaftarPemilik.hasMany(DaftarHewan, { foreignKey: "pemilikId", onDelete: "CASCADE" });
DaftarHewan.belongsTo(DaftarPemilik, { foreignKey: "pemilikId" });

// Relasi User - DaftarHewan (admin yang input hewan)
User.hasMany(DaftarHewan, { foreignKey: "userId", onDelete: "CASCADE" });
DaftarHewan.belongsTo(User, { foreignKey: "userId" });

// Sync database
(async () => {
  try {
    await db.authenticate();
    console.log("Koneksi database berhasil!");
    await db.sync({ alter: true });
    console.log("Semua tabel berhasil disinkronisasi.");
  } catch (error) {
    console.error("Gagal konek DB:", error);
  }
})();

export { User, DaftarHewan, DaftarPemilik, db as sequelize };
