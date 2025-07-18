import React, { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Perfil from './components/Perfil';
import MemoryGame from './components/MemoryGame';
import TetrisGame from "./components/tetris/TetrisGame";

// Paleta de colores para cada tipo de usuario
// Puedes poner esto en App.jsx o en un archivo de estilos temáticos.

const themes = {
  visitante: {
    primary: '#23272F',     // Fondo general oscuro
    accent: '#61dafb',      // Azul React
    navBg: '#181A20',       // Fondo navbar oscuro
    name: 'Visitante'
  },
  usuario: {
    primary: '#262A34',
    accent: '#9cfffa',      // Verde-agua pastel
    navBg: '#1b1e25',
    name: 'Usuario'
  },
  admin: {
    primary: '#2B2922',
    accent: '#ffe47a',      // Amarillo pastel claro
    navBg: '#22211b',
    name: 'Administrador'
  }
};

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({theme}) => theme.primary};
  min-height: 100vh;
  width: 100vw; 
  font-family: 'Segoe UI', sans-serif;
  color: ${({theme}) => theme.accent};
  overflow-x: hidden;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem 2rem 1rem 2rem;
  background: ${({theme}) => theme.navBg};
  border-bottom: 2px solid ${({theme}) => theme.accent + '22'};
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 0 auto;
`;

const LoginBox = styled.div`
  min-width: 260px;
  margin-top: 0.2rem;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: center;
  gap: 2rem;
  padding: 1rem 0;
  background: ${({theme}) => theme.navBg};
`;

const NavLink = styled.button`
  background: none;
  border: none;
  color: ${({theme}) => theme.accent};
  font-size: 1.08rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  transition: background 0.15s;
  &:hover {
    background: ${({theme}) => theme.accent + '22'};
  }
`;

const Main = styled.main`
  flex: 1 0 auto;   // Esto hace la magia
  width: 100%;
  max-width: 70%;     // O 100vw si quieres todo el ancho, pero 1200px es más legible
  margin: 2rem auto;
  background: #fff6;
  padding: 2rem;
  border-radius: 12px;
  min-height: 300px;
  box-shadow: 0 2px 12px #0001;
`;


const Footer = styled.footer`
  text-align: center;
  margin: 2rem 0 1rem 0;
  color: #888;
  font-size: 0.95rem;
`;

function App() {
  const [usuario, setUsuario] = useState(null); // { nombre, rol }
  const [token, setToken] = useState(null);
  const [pagina, setPagina] = useState('inicio');

  const handleLogin = (user, token) => {
    setUsuario(user); // user = { nombre, rol }
    setToken(token);
    setPagina('inicio');
  };

  const handleLogout = () => {
    setUsuario(null);
    setToken(null);
    setPagina('inicio');
  };

  const theme = usuario ? (usuario.rol === 'admin' ? themes.admin : themes.usuario) : themes.visitante;

  // Secciones principales
  const secciones = [
    { id: 'inicio', nombre: 'Inicio' },
    { id: 'juegoMemoria', nombre: 'Juego de memoria' },
    { id: 'tetris', nombre: 'Tetris' },
    { id: 'servicios', nombre: 'Servicios' },
    { id: 'acerca', nombre: 'Acerca de' },
    { id: 'contacto', nombre: 'Contacto' },
    { id: 'perfil', nombre: 'Mi perfil' }
  ];

  // Contenido demo según sección
  const contenido = {
    inicio: (
      <>
        <h2>Bienvenido{usuario ? `, ${usuario.nombre}` : ''}</h2>
        <p>
          {usuario
            ? usuario.rol === 'admin'
              ? 'Panel administrativo: aquí puedes gestionar el sitio.'
              : 'Panel de usuario: puedes acceder a tus servicios personalizados.'
            : 'Bienvenido visitante. Navega por el sitio, regístrate o inicia sesión para más opciones.'}
        </p>
      </>
    ),
    juegoMemoria: <MemoryGame />,
    tetris: <TetrisGame />,
    servicios: <p>Estos son nuestros servicios: miralos (contenido de ejemplo)</p>,
    acerca: <p>Acerca de este sitio: ... (contenido de ejemplo)</p>,
    contacto: <p>Contáctanos: ... (contenido de ejemplo)</p>,
    perfil: usuario ? <Perfil token={token} /> : <p>Inicia sesión para ver tu perfil.</p>
  };

  return (
    <ThemeProvider theme={theme}>
      <AppContainer>
        <Header>
          <div />
          <Title>Mi Proyecto Increíble</Title>
          <LoginBox>
            {!usuario ? (
              <LoginForm onLogin={handleLogin} />
            ) : (
              <div>
                <div style={{fontSize: '1.02rem'}}>Hola, {usuario.nombre} <small>({theme.name})</small></div>
                <NavLink onClick={handleLogout}>Cerrar sesión</NavLink>
              </div>
            )}
          </LoginBox>
        </Header>
        <Nav>
          {secciones
            .filter(sec => {
              if (sec.id === 'perfil' && !usuario) return false;
              // Ejemplo: podrías agregar otros filtros por rol aquí
              return true;
            })
            .map(sec => (
              <NavLink
                key={sec.id}
                onClick={() => setPagina(sec.id)}
                style={pagina === sec.id ? { fontWeight: 700, textDecoration: 'underline' } : {}}
              >
                {sec.nombre}
              </NavLink>
            ))
          }
        </Nav>
        <Main>
          {contenido[pagina]}
          {!usuario && (
            <div style={{marginTop: '2rem', background: '#fff2', padding: '1.5rem', borderRadius: '8px'}}>
              <RegisterForm />
            </div>
          )}
        </Main>
        <Footer>
          &copy; {new Date().getFullYear()} Mi Proyecto &ndash; Hecho con ☕ y <b>React</b>.
        </Footer>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;
