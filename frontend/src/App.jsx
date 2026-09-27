import { useEffect, useState } from "react";
import { api, getToken, setToken } from "./utils/api";
import "./App.css";
import Auth from "./components/Auth";
import Game from "./components/Game";

const ELECCIONES = [
  { id: "rock", label: "Piedra", emoji: "\u{1FAA8}" },
  { id: "paper", label: "Papel", emoji: "\u{1F4C4}" },
  { id: "scissors", label: "Tijera", emoji: "\u2702\uFE0F" },
  { id: "lizard", label: "Lagarto", emoji: "\u{1F98E}" },
  { id: "spock", label: "Spock", emoji: "\u{1F596}" },
];

const RESULT_TEXT = {
  win: "¡Ganaste!",
  lose: "Perdiste",
  draw: "Empate",
};

const EMOJI = Object.fromEntries(ELECCIONES.map((c) => [c.id, c.emoji]));
const LABEL = Object.fromEntries(ELECCIONES.map((c) => [c.id, c.label]));

function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(Boolean(getToken()));

  useEffect(() => {
    if (!getToken()) return;
    api("/api/auth/me")
      .then((data) => setUser(data.user))
      .catch(() => setToken(null))
      .finally(() => setChecking(false));
  }, []);

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  if (checking) return <div className="center">Cargando...</div>;

  return user ? (
    <Game
      user={user}
      onLogout={logout}
      LABEL={LABEL}
      EMOJI={EMOJI}
      RESULT_TEXT={RESULT_TEXT}
      ELECCIONES={ELECCIONES}
    />
  ) : (
    <div className="center">
      <Auth onAuth={setUser} />
    </div>
  );
}

export default App;
