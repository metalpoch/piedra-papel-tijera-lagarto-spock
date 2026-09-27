function Match({ match, LABEL, EMOJI, RESULT_TEXT }) {
  return (
    <div className={`result ${match.result}`}>
      <div className="duel">
        <div>
          <span className="emoji big">{EMOJI[match.player_choice]}</span>
          <p>{LABEL[match.player_choice]}</p>
        </div>
        <div className="vs">contra</div>
        <div>
          <span className="emoji big">{EMOJI[match.computer_choice]}</span>
          <p>{LABEL[match.computer_choice]}</p>
        </div>
      </div>
      <h3>{RESULT_TEXT[match.result]}</h3>
    </div>
  );
}

export default Match;
