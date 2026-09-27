function History({ history, LABEL, EMOJI, RESULT_TEXT }) {
  return (
    <div className="history">
      <h3>Historial</h3>
      <ul>
        {history.map((m) => (
          <li key={m.id} className={m.result}>
            <span>
              {EMOJI[m.player_choice]} {LABEL[m.player_choice]}
            </span>
            <span className="vs-mini">vs</span>
            <span>
              {LABEL[m.computer_choice]} {EMOJI[m.computer_choice]}
            </span>
            <span className="badge">{RESULT_TEXT[m.result]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default History;
