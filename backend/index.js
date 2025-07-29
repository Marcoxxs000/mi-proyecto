require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const usuariosRoutes = require("./routes/usuarios");

const app = express();

// Seguridad HTTP headers
app.use(helmet());

// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// CORS con origen configurable
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true
}));

app.use(express.json());

// Rate limit general
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas peticiones, intenta más tarde.' }
});
app.use(limiter);

// Middleware anti-bots por intentos repetidos de login
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutos
  max: 5,
  keyGenerator: (req) => req.ip,
  handler: (req, res) => {
    res.status(429).json({ error: 'Demasiados intentos de login. Intenta más tarde.' });
  }
});
app.use("/api/usuarios/login", loginLimiter);

// Rutas
app.use("/api/usuarios", usuariosRoutes);

// Ruta raíz
app.get("/", (req, res) => {
  res.send("API corriendo 🚀");
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error('Error interno:', err);
  res.status(err.status || 500).json({ error: err.message || "Error interno del servidor" });
});

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend corriendo en puerto ${PORT}`));
