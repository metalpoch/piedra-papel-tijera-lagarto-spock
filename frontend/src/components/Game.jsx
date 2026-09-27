import { useState, useEffect } from "react";
import { api } from "../utils/api";
import Header from "./game/Header";
import Stats from "./game/Stats";
import Choices from "./game/Choices";
import Match from "./game/Match";
import History from "./game/History";

function Game({ user, onLogout, ELECCIONES, LABEL, EMOJI, RESULT_TEXT }) {
  const [choice, setChoice] = useState(null);
  const [match, setMatch] = useState(null);
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api("/api/game/stats"), api("/api/game/history?limit=8")])
      .then(([s, h]) => {
        setStats(s.stats);
        setHistory(h.matches);
      })
      .catch((err) => setError(err.message));
  }, []);

  const refresh = async () => {
    const [s, h] = await Promise.all([
      api("/api/game/stats"),
      api("/api/game/history?limit=8"),
    ]);
    setStats(s.stats);
    setHistory(h.matches);
  };

  const play = async (id) => {
    setLoading(true);
    setError("");
    try {
      const data = await api("/api/game/play", {
        method: "POST",
        body: { choice: id },
      });
      setChoice(id);
      setMatch(data.match);
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

   return (
    <div className="game">
      <Header />
      {stats && <Stats stats={stats} />}
      <h2>Elige tu jugada</h2>
      <Choices
        ELECCIONES={ELECCIONES}
        choice={choice}
        play={play}
        loading={loading}
      />
      {match && (
        <Match
          match={match}
          LABEL={LABEL}
          EMOJI={EMOJI}
          RESULT_TEXT={RESULT_TEXT}
        />
      )}
      {error && <p className="error">{error}</p>}

      {history.length > 0 && (
        <History
          history={history}
          LABEL={LABEL}
          EMOJI={EMOJI}
          RESULT_TEXT={RESULT_TEXT}
        />
      )}
    </div>
  );
}
export default Game;
