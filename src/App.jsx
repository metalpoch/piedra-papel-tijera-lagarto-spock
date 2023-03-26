import { useEffect, useState } from "react";
import style from "./styles/App.module.css";
//import Swal from "sweetalert2";
//import withReactContent from "sweetalert2-react-content";
import Navbar from "./components/Navbar";
import Score from "./components/Score";

import rules from "./assets/rules.png";
import useFetch from "./hooks/useFetch";

const URL_BASE = import.meta.env.VITE_URL_BASE;
const HANDS = {
  "🪨": "piedra",
  "📜": "papel",
  "✂️": "tijera",
  "🦎": "lagarto",
  "🖖": "spock",
};

//const MySwal = withReactContent(Swal);

function App() {
  const [url, setUrl] = useState(null);
  const [scorePc, setScorePc] = useState(0);
  const [scorePlayer, setScorePlayer] = useState(0);

  const { data, loading, error } = useFetch(url);

  useEffect(() => {
    if (data) {
      const { winner, msg } = data;
      if (winner === "PC") setScorePc(scorePc + 1);
      if (winner === "Jugador") setScorePlayer(scorePlayer + 1);

      MySwal.fire({
        text: msg,
        timer: 2000,
        timerProgressBar: true,
        title: `Ganador: ${winner === "Empate" ? "Nadie" : winner}`,
        showConfirmButton: false,
      });

      setUrl(null);
    }
  }, [data]);

  return (
    <>
      <header className={style.navbar}>
        <Navbar />
      </header>
      <main className="bg-pink v-100">
        <section className={style.score}>
          <Score pc={scorePc} player={scorePlayer} />
        </section>
      </main>
    </>
  );
  {
    /*
     *  return (
     *    <div className="App p-2" style={{ minHeight: "100vh" }}>
     *      <div className="row justify-content-around">
     *        <div className="col-3 col-md-1">
     *          <h5>👤: {scoreUser}</h5>
     *          <h5>🤖: {scorePc}</h5>
     *          <div className="d-grid gap-1">
     *            {Object.keys(HANDS).map((item) => (
     *              <button
     *                key={HANDS[item]}
     *                className="btn btn-lg btn-primary"
     *                onClick={() => setUrl(URL_BASE + HANDS[item])}
     *              >
     *                {item}
     *              </button>
     *            ))}
     *          </div>
     *        </div>
     *        <div className="col-9 col-md-4">
     *          <img src={rules} width="100%" />
     *        </div>
     *      </div>
     *    </div>
     *  );*/
  }
}

export default App;
