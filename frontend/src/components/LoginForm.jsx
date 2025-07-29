import React, { useState } from 'react';
import { api } from '../utils/api';

export default function LoginForm({ onLogin }) {
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
      const res = await api.post('/usuarios/login', {
        email,
        password,
        apellido // <- honeypot enviado al backend
      });
      const { usuario, token } = res.data;
      localStorage.setItem('usuario', JSON.stringify(usuario));
      localStorage.setItem('token', token);
      onLogin(usuario, token);
      setMensaje('¡Login exitoso!');
    } catch (err) {
      setMensaje(err.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
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
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
        style={{ minWidth: 140, fontSize: 14 }}
        required
      />
      <input
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Contraseña"
        type="password"
        style={{ minWidth: 110, fontSize: 14 }}
        required
      />
      <button type="submit" style={{ fontSize: 14 }}>Iniciar sesión</button>
      <div style={{ fontSize: 13, color: '#b91c1c', width: '100%' }}>{mensaje}</div>
    </form>
  );
}
