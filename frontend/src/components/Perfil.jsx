import { useEffect, useState } from 'react';
import { api } from '../utils/api';

export default function Perfil() {
  const [info, setInfo] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/usuarios/perfil')
      .then(res => setInfo(res.data.usuario))
      .catch(() => setError('No se pudo obtener el perfil'));
  }, []);

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
