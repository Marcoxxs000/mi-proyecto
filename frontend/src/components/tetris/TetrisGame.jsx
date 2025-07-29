// src/components/tetris/TetrisGame.jsx

import React, { useState, useEffect } from "react";
import {
  initialBoard,
  randomTetromino,
  move,
  rotate,
  checkCollision,
  merge,
  clearLines,
  BOARD_WIDTH,
  BOARD_HEIGHT,
  TETROMINOS,
} from "../../utils/tetrisLogic";

// Paleta de colores (sin glow, bien diferenciados y sobrios)
const COLOR_MAP = [
  "#e3e9f7",    // 0: vacío (fondo claro)
  "#38bdf8",    // 1: I - cyan
  "#fde047",    // 2: O - yellow
  "#a78bfa",    // 3: T - purple
  "#22d3ee",    // 4: J - green/teal
  "#60a5fa",    // 5: L - blue
  "#fb7185",    // 6: S - red/pink
  "#f472b6",    // 7: Z - pink
];

function drawCell(value) {
  return {
    background: value === 0 ? "#e3e9f7" : COLOR_MAP[value] || "#222",
    border: value === 0 ? "1px solid #e0e7ef" : "1.5px solid #222",
    boxSizing: "border-box",
    transition: "background 0.12s",
  };
}

function ScorePanel({ score, onRestart, isOver, onStart, playing }) {
  return (
    <div style={{
      width: 240,
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      marginBottom: 18,
      marginLeft: 8,
    }}>
      <div style={{
        fontSize: 20,
        fontWeight: 600,
        color: "#38bdf8",
        marginBottom: 8,
        marginTop: 6,
        marginLeft: 6,
        letterSpacing: 0.5,
        textShadow: "0 1px 1px #fff5"
      }}>
        Puntuación: <span style={{ color: "#333", marginLeft: 8 }}>{score}</span>
      </div>
      {!playing ? (
        <button
          onClick={onStart}
          style={{
            marginLeft: 6,
            padding: "7px 28px",
            borderRadius: 12,
            border: "none",
            background: "linear-gradient(90deg, #38bdf8 80%, #e0e7ef)",
            color: "#222",
            fontWeight: 700,
            fontSize: 17,
            cursor: "pointer",
            marginTop: 8,
            boxShadow: "0 2px 12px #38bdf855",
          }}
        >
          Comenzar
        </button>
      ) : (
        isOver && (
          <button
            onClick={onRestart}
            style={{
              marginLeft: 6,
              padding: "7px 28px",
              borderRadius: 12,
              border: "none",
              background: "linear-gradient(90deg, #38bdf8 80%, #e0e7ef)",
              color: "#222",
              fontWeight: 700,
              fontSize: 17,
              cursor: "pointer",
              marginTop: 8,
              boxShadow: "0 2px 12px #38bdf855",
            }}
          >
            Reiniciar
          </button>
        )
      )}
      {isOver && (
        <div style={{
          color: "#fb7185",
          fontWeight: 700,
          marginTop: 10,
          marginLeft: 7,
          fontSize: 16,
          textShadow: "0 1px 2px #fff6"
        }}>
          ¡Game Over!
        </div>
      )}
    </div>
  );
}

// Panel scrollable para historial
function HistoryPanel({ history, maxHeight }) {
  return (
    <div
      style={{
        width: 240,
        minHeight: maxHeight,
        maxHeight: maxHeight,
        background: "#23272fcc",
        borderRadius: 12,
        boxShadow: "0 2px 12px #0003",
        marginLeft: 28,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: 20,
          padding: "1.1rem 0 0.2rem 0",
          textAlign: "center",
          borderBottom: "1px solid #38bdf844",
          color: "#38bdf8"
        }}
      >
        Historial
      </div>
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "1rem 1.1rem 0.7rem 1.1rem"
        }}
      >
        {history.length === 0 && (
          <div style={{
            textAlign: "center",
            color: "#aaa",
            marginTop: "2rem"
          }}>Sin partidas aún</div>
        )}
        {history.map((item, i) => (
          <div key={i}
            style={{
              background: "#e3e9f733",
              marginBottom: 10,
              borderRadius: 8,
              padding: "0.6rem 0.7rem",
              fontWeight: 500,
              fontSize: 15,
              color: "#fff",
              boxShadow: item.score === Math.max(...history.map(h => h.score))
                ? "0 0 8px #38bdf833"
                : undefined,
              border: item.score === Math.max(...history.map(h => h.score))
                ? "1.5px solid #38bdf8aa"
                : "1px solid #2c323a"
            }}
          >
            <span style={{ fontSize: 16, color: "#38bdf8", fontWeight: 700 }}>{item.score}</span>
            <span style={{ float: "right", color: "#bbb", fontSize: 12 }}>
              {item.date}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TetrisGame() {
  // Estados de juego
  const [board, setBoard] = useState(initialBoard());
  const [current, setCurrent] = useState(null);
  const [position, setPosition] = useState({ x: 3, y: 0 });
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem("tetrisHistory") || "[]"));
  const [gameOver, setGameOver] = useState(false);
  const [playing, setPlaying] = useState(false);


  // Generar el tablero visual (pieza sobre el tablero)
  function getDisplayBoard() {
    const display = board.map(row => row.slice());
    if (current) {
      const idx = TETROMINOS.findIndex(t => t.color === current.color);
      const realIdx = idx === -1 ? 1 : idx + 1;
      for (let y = 0; y < current.shape.length; y++) {
        for (let x = 0; x < current.shape[0].length; x++) {
          if (
            current.shape[y][x] &&
            position.y + y >= 0 &&
            position.y + y < BOARD_HEIGHT &&
            position.x + x >= 0 &&
            position.x + x < BOARD_WIDTH
          ) {
            display[position.y + y][position.x + x] = realIdx;
          }
        }
      }
    }
    return display;
  }

  // Timer principal de bajada automática
  useEffect(() => {
    if (!playing || gameOver) return;
    const timer = setInterval(() => handleMove("down"), 480);
    return () => clearInterval(timer);
    // eslint-disable-next-line
  }, [board, current, position, playing, gameOver]);

  // Teclas (previniendo scroll)
  useEffect(() => {
    const handleKey = (e) => {
      if (!playing || gameOver) return;
      if (
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "ArrowDown" ||
        e.key === "ArrowUp" ||
        e.key === " "
      ) {
        e.preventDefault();
      }
      if (e.key === "ArrowLeft") handleMove("left");
      if (e.key === "ArrowRight") handleMove("right");
      if (e.key === "ArrowDown") handleMove("down");
      if (e.key === "ArrowUp") handleMove("rotate");
      if (e.key === " ") hardDrop();
    };
    window.addEventListener("keydown", handleKey, { passive: false });
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line
  }, [board, current, position, gameOver, playing]);

  // Movimiento y colisiones
  function handleMove(dir) {
    if (gameOver || !playing) return;
    let newPos = position;
    let newShape = current.shape;
    if (dir === "rotate") {
      newShape = rotate(current.shape);
      if (!checkCollision(board, newShape, position)) {
        setCurrent({ ...current, shape: newShape });
      }
      return;
    } else {
      newPos = move(position, dir);
      if (!checkCollision(board, current.shape, newPos)) {
        setPosition(newPos);
      } else if (dir === "down") {
        // Fijar pieza y generar nueva
        const merged = merge(board, current.shape, position, TETROMINOS.findIndex(t => t.color === current.color) + 1);
        const [cleared, lines] = clearLines(merged);
        setScore(s => s + [0, 100, 300, 700, 1500][lines]);
        setBoard(cleared);
        const next = randomTetromino();
        const startPos = { x: 3, y: 0 };
        if (checkCollision(cleared, next.shape, startPos)) {
          setGameOver(true);
          setPlaying(false);
        } else {
          setCurrent(next);
          setPosition(startPos);
        }
      }
    }
  }

  function hardDrop() {
    if (gameOver || !playing) return;
    let newPos = { ...position };
    while (!checkCollision(board, current.shape, move(newPos, "down"))) {
      newPos = move(newPos, "down");
    }
    setPosition(newPos);
    handleMove("down");
  }

  function restartGame() {
    setBoard(initialBoard());
    setCurrent(randomTetromino());
    setPosition({ x: 3, y: 0 });
    setScore(0);
    setGameOver(false);
    setPlaying(true);
  }

  function startGame() {
    setBoard(initialBoard());
    setCurrent(randomTetromino());
    setPosition({ x: 3, y: 0 });
    setScore(0);
    setGameOver(false);
    setPlaying(true);
  }

  // Guardar historial
  useEffect(() => {
    if (gameOver && playing === false) {
      const newHistory = [{ score, date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) }, ...history].slice(0, 10);
      setHistory(newHistory);
      localStorage.setItem("tetrisHistory", JSON.stringify(newHistory));
    }
    // eslint-disable-next-line
  }, [gameOver, playing]);

  // Layout principal: juego a la izq, historial a la derecha, centrado verticalmente en desktop.
  return (
    <div style={{
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "center",
      gap: 36,
      width: "100%",
      minHeight: "100vh",
      marginTop: 32,
    }}>
      {/* Columna izquierda: puntaje + tablero */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minWidth: BOARD_WIDTH * 26 + 30,
      }}>
        <ScorePanel
          score={score}
          onRestart={restartGame}
          isOver={gameOver}
          onStart={startGame}
          playing={playing}
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${BOARD_WIDTH}, 24px)`,
            gridTemplateRows: `repeat(${BOARD_HEIGHT}, 24px)`,
            border: "3px solid #e3e9f7",
            borderRadius: 20,
            boxShadow: "0 2px 30px #0002",
            background: "#e3e9f7",
            width: BOARD_WIDTH * 24,
            height: BOARD_HEIGHT * 24,
            marginTop: 4,
            marginBottom: 12,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {getDisplayBoard().map((row, y) =>
            row.map((cell, x) => (
              <div
                key={x + "-" + y}
                style={{
                  ...drawCell(cell),
                  width: 22,
                  height: 22,
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  fontWeight: 700,
                  color: cell === 0 ? "#aaa" : "#222",
                  borderRadius: 5,
                  transition: "background 0.13s"
                }}
              >
                {/* Sin "glow", solo el cuadrado */}
              </div>
            ))
          )}
        </div>
      </div>
      <div style={{ marginTop: 60 /* Ajusta este valor hasta que calce */ }}>
        {/* Columna derecha: historial */}
        <HistoryPanel history={history} maxHeight={BOARD_HEIGHT * 24+55} />
      </div>
    </div>
  );
}

export default TetrisGame;
