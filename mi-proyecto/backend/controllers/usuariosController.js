// controllers/usuariosController.js

const bcrypt = require('bcrypt');
const pool = require('../db');
const jwt = require('jsonwebtoken');

// Registrar usuario
exports.registrarUsuario = async (req, res) => {
  const { nombre, email, password } = req.body;
  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    // rol por defecto: usuario
    const result = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, rol',
      [nombre, email, hashedPassword, 'usuario']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    console.error(err);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

// Login de usuario
exports.loginUsuario = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Faltan campos' });
  }
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    const usuario = result.rows[0];
    if (!usuario) return res.status(400).json({ error: 'Credenciales inválidas' });
    const valid = await bcrypt.compare(password, usuario.password);
    if (!valid) return res.status(400).json({ error: 'Credenciales inválidas' });

    // Incluye el rol en el JWT
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, nombre: usuario.nombre, rol: usuario.rol },
      process.env.JWT_SECRET || 'secreto123',
      { expiresIn: '2h' }
    );
    res.json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};
