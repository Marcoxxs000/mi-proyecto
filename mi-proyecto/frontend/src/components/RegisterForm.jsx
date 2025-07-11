import React, { useState } from 'react';
import axios from 'axios';

export default function RegisterForm() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    try {
      const res = await axios.post(
        'https://mi-proyecto-production-016e.up.railway.app/api/usuarios/register',
        { nombre, email, password }
      );
      setMensaje(`Usuario registrado: ${res.data.nombre || res.data.email}`);
      setNombre('');
      setEmail('');
      setPassword('');
    } catch (err) {
      setMensaje(err.response?.data?.error || 'Error al registrar usuario');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 280 }}>
      <b style={{ marginBottom: 4 }}>Registrarse</b>
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
