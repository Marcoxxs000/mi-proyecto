// backend/schemas/usuarioSchema.js
const { z } = require('zod');

const registroSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(50),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').max(100)
});

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Contraseña inválida')
});

module.exports = {
  registroSchema,
  loginSchema
};
