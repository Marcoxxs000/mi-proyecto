// backend/middleware/rol.js

function requireRole(rol) {
  return (req, res, next) => {
    if (req.usuario && req.usuario.rol === rol) {
      next();
    } else {
      res.status(403).json({ error: 'Acceso denegado' });
    }
  };
}

module.exports = requireRole;
