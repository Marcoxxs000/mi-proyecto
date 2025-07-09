const bcrypt = require('bcrypt');
const pool = require('../db');

// Registrar usuario
exports.registrarUsuario = async (req, res) => {
  const { nombre, email, password } = req.body;
  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }
  try {
    // Hashea la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3) RETURNING id, nombre, email',
      [nombre, email, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      // Código de error de duplicado en Postgres
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    console.error(err);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};


// Al final del archivo (después de registrarUsuario)

const jwt = require('jsonwebtoken');

exports.loginUsuario = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Faltan campos' });
  }
  try {
    // Busca el usuario
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    const usuario = result.rows[0];
    if (!usuario) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }
    // Compara contraseñas
    const valid = await bcrypt.compare(password, usuario.password);
    if (!valid) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }
    // Genera token JWT
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, nombre: usuario.nombre },
      process.env.JWT_SECRET || 'secreto123', // cambia esto en producción
      { expiresIn: '2h' }
    );
    res.json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};


