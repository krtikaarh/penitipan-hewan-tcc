// update

import { Sequelize } from "sequelize"
import dotenv from "dotenv"
dotenv.config()

// Log connection info (tanpa password)
console.log("🔍 Database connection info:", {
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  passwordSet: !!process.env.DB_PASSWORD,
})

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "mysql",
  port: 3306,
  logging: (msg) => console.log("🗄️ SQL:", msg),
  dialectOptions: {
    connectTimeout: 60000,
    acquireTimeout: 60000,
    timeout: 60000,
    // Untuk Google Cloud SQL
    ssl: {
      require: false, // Coba false dulu
      rejectUnauthorized: false,
    },
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  retry: {
    match: [
      /ETIMEDOUT/,
      /EHOSTUNREACH/,
      /ECONNRESET/,
      /ECONNREFUSED/,
      /SequelizeConnectionError/,
      /SequelizeConnectionRefusedError/,
      /SequelizeHostNotFoundError/,
      /SequelizeHostNotReachableError/,
      /SequelizeInvalidConnectionError/,
      /SequelizeConnectionTimedOutError/,
    ],
    max: 3,
  },
})

// Test koneksi saat startup
const testConnection = async () => {
  try {
    await db.authenticate()
    console.log("✅ Database connection established successfully")

    // Test query
    const [results] = await db.query("SELECT 1 as test")
    console.log("✅ Database query test successful:", results)
  } catch (error) {
    console.error("❌ Database connection failed:", {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
    })
  }
}

testConnection()

export default db
