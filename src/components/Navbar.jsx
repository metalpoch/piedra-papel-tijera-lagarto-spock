import { useState } from "react";
import style from "./Navbar.module.css";
import About from "./About";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className={style.navbar}>
      <h1>P.P.T.L.S</h1>
      <button className={style.button} onClick={() => setOpen(!open)}>
        Acerca de mi
      </button>
      {open && <About close={() => setOpen(false)} />}
    </div>
  );
};

export default Navbar;
