const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/rol');

// Ruta de registro (pública)
router.post('/register', usuariosController.registrarUsuario);

// Ruta de login (pública)
router.post('/login', usuariosController.loginUsuario);

// Ruta de perfil (requiere login)
router.get('/perfil', auth, (req, res) => {
  res.json({ mensaje: 'Acceso permitido', usuario: req.usuario });
});

// Ruta SOLO para admin
router.get('/admin/secret', auth, requireRole('admin'), (req, res) => {
  res.json({ mensaje: 'Solo para administradores', usuario: req.usuario });
});

module.exports = router;
