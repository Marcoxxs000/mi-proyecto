import React, { useState } from 'react';
import axios from 'axios';

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    try {
      const res = await axios.post(
        'https://mi-proyecto-production-016e.up.railway.app/api/usuarios/login',
        { email, password }
      );
      // Respuesta: { token, usuario: { nombre, rol, ... } }
      onLogin(res.data.usuario, res.data.token);
      setEmail('');
      setPassword('');
      setMensaje('¡Login exitoso!');
    } catch (err) {
      setMensaje(err.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
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
