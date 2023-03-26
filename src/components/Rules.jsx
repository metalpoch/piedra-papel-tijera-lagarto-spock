import { useState } from "react";
import image from "../assets/rules.png";
import style from "./Rules.module.css";

const Rules = () => {
  const [open, setOpen] = useState(false);
  const handle = () => {
    setOpen(!open);
  };
  return (
    <>
      <div
        className={open ? style.background : undefined}
        onClick={() => setOpen(false)}
      ></div>
      <button className={style.button} onClick={handle}>
        🔎
      </button>
      {open && (
        <div className={style.card}>
          <button className={style.closeButton} onClick={handle}>
            X
          </button>
          <img src={image} className={style.img} />
        </div>
      )}
    </>
  );
};

export default Rules;
