import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Navbar from "./components/Navbar";
import Score from "./components/Score";
import Rules from "./components/Rules";
import Character from "./components/Character";
import Control from "./components/Control";

import useFetch from "./hooks/useFetch";

const URL_BASE = import.meta.env.VITE_URL_BASE;
const MySwal = withReactContent(Swal);
const HANDS = {
  piedra: "🪨",
  papel: "📜",
  tijera: "✂️",
  lagarto: "🦎",
  spock: "🖖",
};

function App() {
  const [url, setUrl] = useState(null);
  const [scorePc, setScorePc] = useState(0);
  const [scorePlayer, setScorePlayer] = useState(0);

  const { data, loading, error } = useFetch(url);
  const handleUrl = (hand) => {
    setUrl(`${URL_BASE}?hand=${hand}`);
  };

  useEffect(() => {
    if (data) {
      const { pc, player, winner, msg } = data;
      if (winner === "PC") setScorePc(scorePc + 1);
      if (winner === "Jugador") setScorePlayer(scorePlayer + 1);

      const text = `Ganador: ${winner === "Empate" ? "Nadie" : winner}`;
      MySwal.fire({
        text: `${msg === null ? text : text + " ➜ " + msg}`,
        timer: 5000,
        timerProgressBar: true,
        title: `${HANDS[player]} vs ${HANDS[pc]}`,
        showConfirmButton: false,
      });
      setUrl(null);
    }
  }, [data]);

  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>
        <Rules />
        <Character />
        <Score pc={scorePc} player={scorePlayer} />
        <Control handle={handleUrl} />
      </main>
    </>
  );
}

export default App;
