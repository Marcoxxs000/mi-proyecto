// src/ScorePanel.jsx

function ScorePanel({ score }) {
  return (
    <div className="bg-gray-100 rounded-2xl shadow p-4 mb-4">
      <h2 className="text-xl font-bold mb-2">Puntuación</h2>
      <div className="text-2xl">{score}</div>
    </div>
  );
}
export default ScorePanel;
