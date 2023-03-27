import style from "./Control.module.css";
import stone from "../assets/stone.png";
import paper from "../assets/paper.png";
import scissors from "../assets/scissors.png";
import lizard from "../assets/lizard.png";
import spock from "../assets/spock.png";

const hands = {
  piedra: stone,
  papel: paper,
  tijera: scissors,
  lagarto: lizard,
  spock: spock,
};

const Control = ({ handle }) => {
  return (
    <div className={style.container}>
      {Object.keys(hands).map((item, i) => (
        <button key={i} className={style.button} onClick={() => handle(item)}>
          <img className={style.img} src={hands[item]} />
        </button>
      ))}
    </div>
  );
};

export default Control;
