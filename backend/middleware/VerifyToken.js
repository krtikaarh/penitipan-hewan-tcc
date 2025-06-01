import jwt from 'jsonwebtoken';


export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log('Auth Header:', authHeader);
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    console.log('Token tidak ditemukan');
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log('Token tidak valid:', err.message);
      return res.status(403).json({ message: "Token tidak valid" });
    }
    console.log('Token valid, decoded:', decoded);
    req.userId = decoded.id;
    next();
  });
};
