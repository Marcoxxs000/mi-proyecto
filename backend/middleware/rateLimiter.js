// backend/middleware/rateLimiter.js
const rateLimit = require("express-rate-limit");

exports.limiterGeneral = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiadas peticiones, intenta más tarde." }
});

exports.limiterAuth = rateLimit({
  windowMs: 10 * 60 * 1000, // más corto
  max: 10,
  message: { error: "Demasiados intentos, espera un momento." }
});
