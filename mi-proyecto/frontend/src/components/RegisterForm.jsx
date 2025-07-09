//// src/components/RegisterForm.jsx
//import { useState } from 'react';
//import axios from 'axios';
//
//export default function RegisterForm() {
//  const [nombre, setNombre] = useState('');
//  const [email, setEmail] = useState('');
//  const [password, setPassword] = useState('');
//  const [mensaje, setMensaje] = useState('');
//
//  const handleSubmit = async (e) => {
//    e.preventDefault();
//    try {
//      const res = await axios.post('https://mi-proyecto-production-016e.up.railway.app/', {
//        nombre, email, password
//      });
//      setMensaje('Usuario registrado correctamente');
//    } catch (err) {
//      setMensaje(err.response?.data?.error || 'Error al registrar usuario');
//    }
//  };
//
//  return (
//    <form onSubmit={handleSubmit}>
//      <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre" required />
//      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" required />
//      <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" type="password" required />
//      <button type="submit">Registrarse</button>
//      <div>{mensaje}</div>
//    </form>
//  );
//}
//


import { useState } from 'react';
import axios from 'axios';

export default function RegisterForm() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post(
      'https://mi-proyecto-production-016e.up.railway.app/api/usuarios/register',
      { nombre, email, password }
    );
    // Usamos el resultado para mostrar el nombre o email
    setMensaje(`Usuario registrado: ${res.data.nombre || res.data.email}`);
    setNombre('');
    setEmail('');
    setPassword('');
  } catch (err) {
    setMensaje(err.response?.data?.error || 'Error al registrar usuario');
  }
};


  return (
    <form onSubmit={handleSubmit}>
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
      <button type="submit">Registrarse</button>
      <div>{mensaje}</div>
    </form>
  );
}
