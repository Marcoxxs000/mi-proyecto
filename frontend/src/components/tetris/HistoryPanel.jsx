// src/HistoryPanel.jsx

function HistoryPanel({ history }) {
  return (
    <div className="bg-gray-100 rounded-2xl shadow p-4">
      <h2 className="text-xl font-bold mb-2">Historial</h2>
      <ul>
        {history.map((item, i) => (
          <li key={i}>
            {item.score} pts – <span className="text-xs">{item.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default HistoryPanel;
