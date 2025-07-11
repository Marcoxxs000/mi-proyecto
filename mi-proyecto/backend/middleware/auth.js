// backend/middleware/auth.js

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Token requerido' });

  const token = authHeader.split(' ')[1]; // formato: Bearer <token>
  if (!token) return res.status(401).json({ error: 'Token inválido' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto123');
    req.usuario = decoded; // Pasa los datos del usuario al request
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};
