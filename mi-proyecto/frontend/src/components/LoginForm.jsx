import { useState } from 'react';
import axios from 'axios';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [token, setToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    try {
      const res = await axios.post(
        'https://mi-proyecto-production-016e.up.railway.app/api/usuarios/login',
        { email, password }
      );
      // Guarda el token en el navegador (localStorage)
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setMensaje('¡Login exitoso!');
      setEmail('');
      setPassword('');
    } catch (err) {
      setMensaje(err.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <button type="submit">Iniciar sesión</button>
      <div>{mensaje}</div>
      {token && (
        <div style={{ fontSize: '0.7em', wordBreak: 'break-all', marginTop: 8 }}>
          <strong>Token JWT:</strong> {token}
        </div>
      )}
    </form>
  );
}
