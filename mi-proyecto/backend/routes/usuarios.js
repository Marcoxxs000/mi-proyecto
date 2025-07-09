const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

// Ruta para registrar usuario
router.post('/register', usuariosController.registrarUsuario);

// agrega:
router.post('/login', usuariosController.loginUsuario);

module.exports = router;

const auth = require('../middleware/auth');

// Ejemplo de ruta protegida:
router.get('/perfil', auth, async (req, res) => {
  // req.usuario se llenó en el middleware
  res.json({ mensaje: 'Acceso permitido', usuario: req.usuario });
});
