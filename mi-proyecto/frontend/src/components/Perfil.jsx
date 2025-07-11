import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Perfil({ token }) {
  const [info, setInfo] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    axios.get('https://mi-proyecto-production-016e.up.railway.app/api/usuarios/perfil', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => setInfo(res.data.usuario))
      .catch(err => setError('No se pudo obtener el perfil'));
  }, [token]);

  if (error) return <div>{error}</div>;
  if (!info) return <div>Cargando perfil...</div>;

  return (
    <div>
      <h2>Mi Perfil</h2>
      <p><b>Nombre:</b> {info.nombre}</p>
      <p><b>Email:</b> {info.email}</p>
      <p><b>Rol:</b> {info.rol}</p>
    </div>
  );
}
