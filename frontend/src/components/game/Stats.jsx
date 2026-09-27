function Stats({ stats }) {
  return (
    <div className="stats">
      <div>
        <span>{stats.total}</span>Partidas
      </div>
      <div>
        <span>{stats.wins}</span>Ganadas
      </div>
      <div>
        <span>{stats.losses}</span>Perdidas
      </div>
      <div>
        <span>{stats.draws}</span>Empates
      </div>
    </div>
  );
}

export default Stats;
