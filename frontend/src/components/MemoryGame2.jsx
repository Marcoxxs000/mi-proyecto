import React, { useState, useEffect } from 'react';

// --- CONFIGURACIÓN Y FUNCIONES AUXILIARES ---

const ESTADOS = {
  CONFIG: 'CONFIG',
  MOSTRAR: 'MOSTRAR',
  BLOQUEO: 'BLOQUEO',
  RESPONDER: 'RESPONDER',
  RESULTADO: 'RESULTADO'
};

function formatoFecha(fecha) {
  return fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

// --- PANEL DE PUNTAJES (responsive) ---
function PuntajesLateral({ historial }) {
  // Estilos responsivos con media queries en línea
  const panelStyle = {
    width: 220,
    height: 340,
    background: historial.length ? '#23272Fcc' : '#4444',
    borderRadius: 10,
    boxShadow: '0 2px 10px #0003',
    marginTop: 32,
    marginLeft: 0,
    opacity: historial.length ? 1 : 0.15,
    pointerEvents: historial.length ? 'auto' : 'none',
    display: 'flex',
    flexDirection: 'column',
    transition: 'opacity 0.2s',
  };

  // Ajuste para móviles (esto requiere un contenedor flex-direction:column en móvil)
  return (
    <div className="panel-puntajes" style={panelStyle}>
      <style>
        {`
          @media (max-width: 700px) {
            .contenedor-flex-memoria {
              flex-direction: column !important;
              align-items: center !important;
            }
            .panel-puntajes {
              margin-top: 16px !important;
              margin-left: 0 !important;
              width: 95vw !important;
              min-width: 0 !important;
              max-width: 400px !important;
              height: 170px !important;
            }
          }
        `}
      </style>
      <div style={{
        fontWeight: 700,
        fontSize: 18,
        padding: '0.8rem 0 0.2rem 0',
        textAlign: 'center',
        borderBottom: '1px solid #9cfffa44',
        color: '#9cfffa'
      }}>
        Puntajes
      </div>
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '0.8rem 1rem'
      }}>
        {historial.map((h, i, arr) => {
          const max = Math.max(...arr.map(x => x.puntaje));
          return (
            <div key={i}
              style={{
                marginBottom: 10,
                borderRadius: 6,
                background: h.puntaje === max ? 'linear-gradient(90deg, #ffe47a99, #9cfffa66)' : '#181A2077',
                fontWeight: h.puntaje === max ? 700 : 400,
                color: h.puntaje === max ? '#222' : '#fff',
                padding: '0.5rem 0.6rem',
                boxShadow: h.puntaje === max ? '0 0 10px #ffe47a55' : undefined
              }}>
              <span style={{ fontSize: 16 }}>
                {h.puntaje}
                {h.puntaje === max && <span style={{ marginLeft: 6, color: '#ffe47a', fontSize: 15 }}>★</span>}
              </span>
              <span style={{ float: 'right', fontSize: 11, color: '#bbb' }}>
                {formatoFecha(new Date(h.fecha))}
              </span>
              <div style={{ fontSize: 12, marginTop: 1, opacity: 0.8 }}>
                {h.aciertos}/{h.total} correctos<br />
                {h.cantidad} nums, {h.digitos} díg, M:{h.tiempoMemoria}s, B:{h.tiempoBloqueo}s
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- FUNCIONES DEL JUEGO ---
function generarNumeros(cantidad, digitos) {
  let min = 0, max = 9;
  if (digitos === 2) { min = 10; max = 99; }
  if (digitos === 3) { min = 100; max = 999; }
  return Array.from({ length: cantidad }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}
function getGridDimensions(n) {
  let cols = Math.ceil(Math.sqrt(n));
  let rows = Math.ceil(n / cols);
  while ((rows - cols) > 1) { cols++; rows = Math.ceil(n / cols); }
  return { rows, cols };
}
function getMultiplicadorDigitos(digitos) {
  if (digitos === 1) return 1;
  if (digitos === 2) return 2;
  if (digitos === 3) return 3.5;
  if (digitos >= 4) return 6;
  return 1;
}
function getFactorCantidadNumeros(cantidad) { return Math.pow(cantidad, 1.3); }
function getFactorTiempoMemoria(segundos) { return Math.exp((5 - segundos) / 4); }
function getFactorBloqueo(segundos) {
  const desviacion = 2.5;
  return Math.exp(-Math.pow(segundos - 8, 2) / (2 * Math.pow(desviacion, 2)));
}
function calcularPuntaje({ digitos, cantidad, tiempoMemoria, tiempoBloqueo, aciertos }) {
  const multiplicadorD = getMultiplicadorDigitos(digitos);
  const factorCantidad = getFactorCantidadNumeros(cantidad);
  const factorMemoria = getFactorTiempoMemoria(tiempoMemoria);
  const factorBloqueo = getFactorBloqueo(tiempoBloqueo);
  const puntajeBase = 1000*multiplicadorD * factorCantidad * factorMemoria * factorBloqueo;
  const puntajeFinal = Math.round(puntajeBase * (aciertos / cantidad));
  return puntajeFinal;
}

// --- COMPONENTE PRINCIPAL ---
export default function MemoryGame() {
  const [historial, setHistorial] = useState([]);
  const [fase, setFase] = useState(ESTADOS.CONFIG);
  const [cantidad, setCantidad] = useState(8);
  const [digitos, setDigitos] = useState(2);
  const [tiempoMemoria, setTiempoMemoria] = useState(2);
  const [tiempoBloqueo, setTiempoBloqueo] = useState(2);

  const [numeros, setNumeros] = useState([]);
  const [respuestas, setRespuestas] = useState([]);
  const [resultado, setResultado] = useState(null);


  function avanzarABloqueo() {
  setFase(ESTADOS.BLOQUEO);
  }

  function avanzarAResponder() {
    setFase(ESTADOS.RESPONDER);
  }


  // Añadir al historial cuando cambia a RESULTADO
  useEffect(() => {
    if (fase === ESTADOS.RESULTADO && resultado) {
      const aciertos = resultado.filter(Boolean).length;
      const puntaje = calcularPuntaje({
        digitos,
        cantidad: numeros.length,
        tiempoMemoria,
        tiempoBloqueo,
        aciertos
      });
      setHistorial(hist => [
        ...hist,
        {
          puntaje,
          fecha: Date.now(),
          aciertos,
          total: numeros.length,
          cantidad,
          digitos,
          tiempoMemoria,
          tiempoBloqueo
        }
      ]);
    }
    // eslint-disable-next-line
  }, [fase]);

  function comenzar() {
    const nums = generarNumeros(cantidad, digitos);
    setNumeros(nums);
    setRespuestas(Array(cantidad).fill(''));
    setFase(ESTADOS.MOSTRAR);
    setResultado(null);
  }
  function handleRespuesta(idx, valor) {
    const nuevas = [...respuestas];
    nuevas[idx] = valor.replace(/\D/g, '');
    setRespuestas(nuevas);
  }
  function verificar() {
    const aciertos = numeros.map((num, i) => Number(respuestas[i]) === num);
    setResultado(aciertos);
    setFase(ESTADOS.RESULTADO);
  }
  function reiniciar() {
    setFase(ESTADOS.CONFIG);
    setNumeros([]);
    setRespuestas([]);
    setResultado(null);
  }
{fase === ESTADOS.MOSTRAR && (
  <>
    <h3>Memoriza estos números:</h3>
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap: '10px',
      justifyItems: 'center',
      margin: 20
    }}>
      {numeros.map((num, i) => (
        <span key={i} style={{ fontSize: 28, letterSpacing: 2 }}>{num}</span>
      ))}
    </div>
    <button onClick={avanzarABloqueo}>Listo, ocultar</button>
  </>
)}

{fase === ESTADOS.BLOQUEO && (
  <>
    <h3>¡Ocultado!</h3>
    <div style={{ fontSize: 18, margin: 20 }}>Presiona cuando estés listo para responder…</div>
    <button onClick={avanzarAResponder}>Estoy listo</button>
  </>
)}



  const { cols } = getGridDimensions(numeros.length || cantidad);

  let puntaje = null;
  if (fase === ESTADOS.RESULTADO && resultado) {
    puntaje = calcularPuntaje({
      digitos,
      cantidad: numeros.length,
      tiempoMemoria,
      tiempoBloqueo,
      aciertos: resultado.filter(Boolean).length
    });
  }

  // --- LAYOUT RESPONSIVE: FLEX ROW EN PC, COLUMN EN MOVIL ---
  return (
    <div
      className="contenedor-flex-memoria"
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '100%',
        minHeight: '100vh',
        gap: 32,
      }}
    >
      <div style={{
        maxWidth: 400,
        width: 400,
        textAlign: 'center',
        padding: 20,
        background: '#23272Fcc',
        borderRadius: 16,
        margin: '32px 0',
        boxShadow: '0 2px 12px #0002'
      }}>
        {fase === ESTADOS.CONFIG && (
          <>
            <h2>Juego de Memoria Numérica</h2>
            <label>
              Cantidad de números:&nbsp;
              <input type="number" value={cantidad} min={2} max={50}
                onChange={e => setCantidad(Number(e.target.value))} />
            </label>
            <br />
            <label>
              Dígitos (1-3):&nbsp;
              <input type="number" value={digitos} min={1} max={3}
                onChange={e => setDigitos(Number(e.target.value))} />
            </label>
            <br />
            <label>
              Tiempo de memorización (segundos):&nbsp;
              <input type="number" value={tiempoMemoria} min={1} max={10}
                onChange={e => setTiempoMemoria(Number(e.target.value))} />
            </label>
            <br />
            <label>
              Tiempo de bloqueo (segundos):&nbsp;
              <input type="number" value={tiempoBloqueo} min={1} max={10}
                onChange={e => setTiempoBloqueo(Number(e.target.value))} />
            </label>
            <br />
            <button onClick={comenzar}>Comenzar</button>
          </>
        )}

        {fase === ESTADOS.MOSTRAR && (
          <>
            <h3>Memoriza estos números:</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gap: '10px',
              justifyItems: 'center',
              margin: 20
            }}>
              {numeros.map((num, i) => (
                <span key={i} style={{ fontSize: 28, letterSpacing: 2 }}>{num}</span>
              ))}
            </div>
            <div style={{ color: 'gray' }}>Tienes {tiempoMemoria} segundos…</div>
          </>
        )}

        {fase === ESTADOS.BLOQUEO && (
          <>
            <h3>¡Espera…!</h3>
            <div style={{ fontSize: 18, margin: 20 }}>Preparando la pregunta…</div>
          </>
        )}

        {fase === ESTADOS.RESPONDER && (
          <>
            <h3>¿Cuáles eran los números?</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gap: '10px',
              justifyItems: 'center',
              marginBottom: 20
            }}>
              {numeros.map((_, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={respuestas[idx] || ''}
                  onChange={e => handleRespuesta(idx, e.target.value)}
                  style={{ width: 50, textAlign: 'center', fontSize: 18 }}
                  maxLength={digitos}
                />
              ))}
            </div>
            <button onClick={verificar}>Verificar</button>
          </>
        )}

        {fase === ESTADOS.RESULTADO && resultado && (
          <>
            <h3>Resultados</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gap: '10px',
              justifyItems: 'center'
            }}>
              {numeros.map((num, idx) => (
                <span key={idx} style={{
                  display: 'inline-block',
                  width: 50,
                  padding: 2,
                  background: resultado[idx] ? '#d4edda' : '#f8d7da',
                  borderRadius: 4,
                  fontSize: 18
                }}>
                  {num}
                  <br />
                  <span style={{ fontSize: 12, color: resultado[idx] ? 'green' : 'red' }}>
                    {resultado[idx] ? '✓' : (respuestas[idx] || '-')}
                  </span>
                </span>
              ))}
            </div>
            <div style={{ margin: 12 }}>
              Acertaste {resultado.filter(Boolean).length} de {numeros.length}<br />
              <b>Puntaje obtenido: {puntaje}</b>
            </div>
            <button onClick={reiniciar}>Volver a jugar</button>
          </>
        )}
      </div>
      <PuntajesLateral historial={historial} />
    </div>
  );
}
