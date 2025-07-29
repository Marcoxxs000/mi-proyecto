const bcrypt = require('bcrypt');
const pool = require('../db');
const jwt = require('jsonwebtoken');
const { registroSchema, loginSchema } = require('../schemas/usuarioSchema');

// Registrar usuario
exports.registrarUsuario = async (req, res, next) => {
  try {
    // Honeypot: campo invisible
    if (req.body.confirmacionHumana !== '') {
      return res.status(400).json({ error: 'Posible bot detectado' });
    }

    const { nombre, email, password } = registroSchema.parse(req.body);

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, rol',
      [nombre, email, hashedPassword, 'usuario']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: err.errors.map(e => e.message).join(', ') });
    }
    if (err.code === '23505') {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    next(err);
  }
};

// Login de usuario
exports.loginUsuario = async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    const usuario = result.rows[0];
    if (!usuario) return res.status(400).json({ error: 'Credenciales inválidas' });

    const valid = await bcrypt.compare(password, usuario.password);
    if (!valid) return res.status(400).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, nombre: usuario.nombre, rol: usuario.rol },
      process.env.JWT_SECRET || 'secreto123',
      { expiresIn: '2h' }
    );

    res.json({
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }
    });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: err.errors.map(e => e.message).join(', ') });
    }
    next(err);
  }
};
