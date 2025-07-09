const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  // El token puede venir en headers (Authorization: Bearer <token>)
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token no proporcionado' });

  jwt.verify(token, process.env.JWT_SECRET || 'secreto123', (err, usuario) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.usuario = usuario; // Guarda info del usuario en la request
    next();
  });
}

module.exports = authMiddleware;
