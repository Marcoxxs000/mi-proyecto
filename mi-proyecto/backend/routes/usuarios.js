const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

// Ruta para registrar usuario
router.post('/register', usuariosController.registrarUsuario);

module.exports = router;
