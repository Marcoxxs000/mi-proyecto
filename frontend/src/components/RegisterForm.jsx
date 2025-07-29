import React, { useState } from 'react';
import { api } from '../utils/api';

export default function RegisterForm() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  // Honeypot: si esto se llena, es bot.
  const [apellido, setApellido] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');

    // Si el honeypot está lleno, ni siquiera pegamos al backend
    if (apellido) {
      setMensaje('Actividad sospechosa detectada');
      return;
    }

    try {
      const res = await api.post('/usuarios/register', {
        nombre,
        email,
        password,
        apellido // <- honeypot enviado al backend
      });
      setMensaje(`Usuario registrado: ${res.data.nombre || res.data.email}`);
      setNombre('');
      setEmail('');
      setPassword('');
      setApellido('');
    } catch (err) {
      setMensaje(err.response?.data?.error || 'Error al registrar usuario');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 280 }}>
      <b style={{ marginBottom: 4 }}>Registrarse</b>

      {/* Honeypot (campo invisible para bots) */}
      <input
        type="text"
        name="apellido"
        value={apellido}
        onChange={(e) => setApellido(e.target.value)}
        style={{ display: 'none' }}
        tabIndex={-1}
        autoComplete="off"
      />

      <input
        value={nombre}
        onChange={e => setNombre(e.target.value)}
        placeholder="Nombre"
        required
      />
      <input
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
        required
      />
      <input
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Contraseña"
        type="password"
        required
      />
      <button type="submit" style={{ fontSize: 14 }}>Registrarse</button>
      <div style={{ fontSize: 13, color: '#15803d', minHeight: 18 }}>{mensaje}</div>
    </form>
  );
}
