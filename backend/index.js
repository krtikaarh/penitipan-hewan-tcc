import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/route.js";
import "./models/Index.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.json({
        message: 'API is running ✅',
        timestamp: new Date().toISOString(),
    });
});

const corsOptions = {
  origin: function(origin, callback) {
    const allowedOrigins = [
      "http://localhost:3000",
      "https://mimetic-sweep-450606-j0.uc.r.appspot.com",
    ];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(router);

app.listen(port, () => {
  console.log(`SERVER JALAN DI PORT ${port}`);
});