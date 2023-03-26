import { useEffect, useState } from "react";
import style from "./Score.module.css";

const Score = ({ pc, player }) => {
  const [animatePlayer, setAnimatePlayer] = useState("");
  const [animatePc, setAnimatePc] = useState("");

  useEffect(() => {
    setAnimatePc(style.animation);
    const timeout = setTimeout(() => setAnimatePc(""), 1000);
    return () => clearTimeout(timeout);
  }, [pc]);

  useEffect(() => {
    setAnimatePlayer(style.animation);
    const timeout = setTimeout(() => setAnimatePlayer(""), 1000);
    return () => clearTimeout(timeout);
  }, [player]);

  return (
    <section className={style.container}>
      <span className={animatePlayer}>👤</span>: {player} ⚡{" "}
      <span className={animatePc}>🤖</span>: {pc}
    </section>
  );
};

export default Score;
