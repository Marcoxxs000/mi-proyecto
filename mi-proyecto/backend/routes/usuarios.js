const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

// Ruta para registrar usuario
router.post('/register', usuariosController.registrarUsuario);

// agrega:
router.post('/login', usuariosController.loginUsuario);

module.exports = router;
