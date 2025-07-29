// src/tetrisLogic.js

// Tetrominós clásicos: [matriz], color
export const TETROMINOS = [
  { shape: [[1, 1, 1, 1]], color: "bg-cyan-400" }, // I
  { shape: [[1, 1], [1, 1]], color: "bg-yellow-400" }, // O
  { shape: [[0, 1, 0], [1, 1, 1]], color: "bg-purple-400" }, // T
  { shape: [[1, 0, 0], [1, 1, 1]], color: "bg-green-500" }, // J
  { shape: [[0, 0, 1], [1, 1, 1]], color: "bg-blue-400" }, // L
  { shape: [[1, 1, 0], [0, 1, 1]], color: "bg-red-400" }, // S
  { shape: [[0, 1, 1], [1, 1, 0]], color: "bg-pink-400" }, // Z
];

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

// Crea un tablero vacío
export function initialBoard() {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array(BOARD_WIDTH).fill(0)
  );
}

// Tetrominó random
export function randomTetromino() {
  const idx = Math.floor(Math.random() * TETROMINOS.length);
  return { ...TETROMINOS[idx], id: Math.random() };
}

// Mover posición según dirección
export function move(pos, dir) {
  switch (dir) {
    case "left": return { x: pos.x - 1, y: pos.y };
    case "right": return { x: pos.x + 1, y: pos.y };
    case "down": return { x: pos.x, y: pos.y + 1 };
    default: return pos;
  }
}

// Rota la matriz (tetrominó)
export function rotate(shape) {
  // Transpone y da vuelta la fila
  return shape[0].map((_, i) => shape.map(row => row[i]).reverse());
}

// Verifica colisiones (fuera de borde o sobre piezas fijas)
export function checkCollision(board, shape, pos) {
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[0].length; x++) {
      if (
        shape[y][x] &&
        (
          pos.y + y >= BOARD_HEIGHT ||
          pos.x + x < 0 ||
          pos.x + x >= BOARD_WIDTH ||
          (pos.y + y >= 0 && board[pos.y + y][pos.x + x])
        )
      ) return true;
    }
  }
  return false;
}

// Fusiona la pieza actual al tablero
export function merge(board, shape, pos, marker = 1) {
  const newBoard = board.map(row => row.slice());
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[0].length; x++) {
      if (shape[y][x] && pos.y + y >= 0) {
        newBoard[pos.y + y][pos.x + x] = marker;
      }
    }
  }
  return newBoard;
}

// Limpia líneas completas y devuelve [nuevo tablero, líneas eliminadas]
export function clearLines(board) {
  let lines = 0;
  const newBoard = board.filter(row => {
    if (row.every(cell => cell !== 0)) {
      lines++;
      return false;
    }
    return true;
  });
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(0));
  }
  return [newBoard, lines];
}
