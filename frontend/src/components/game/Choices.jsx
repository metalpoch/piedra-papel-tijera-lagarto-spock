function Choices({ ELECCIONES, choice, play, loading }) {
  return (
    <div className="choices">
      {ELECCIONES.map((eleccion) => (
        <button
          key={eleccion.id}
          type="button"
          className={choice === eleccion.id ? "choice selected" : "choice"}
          onClick={() => play(eleccion.id)}
          disabled={loading}
        >
          <span className="emoji">{eleccion.emoji}</span>
          {eleccion.label}
        </button>
      ))}
    </div>
  );
}

export default Choices;
