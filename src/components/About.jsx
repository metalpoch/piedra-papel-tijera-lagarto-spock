import style from "./About.module.css";
import image from "../assets/profile.png";
import {
  TfiWorld,
  TfiGithub,
  TfiInstagram,
  TfiLinkedin,
} from "react-icons/tfi";

const About = ({ close }) => {
  return (
    <>
      <div className={style.background} onClick={close}></div>
      <div className={style.wrapper}>
        <button className={style.button} onClick={close}>
          X
        </button>
        <img className={style.photo} src={image} />
        <ul className={style.links}>
          <li>
            <a href="https://metalpoch.github.io/" target="_blank">
              <TfiWorld className={style.bgIcon} />
            </a>
          </li>
          <li>
            <a href="https://github.com/metalpoch/" target="_blank">
              <TfiGithub className={style.bgIcon} />
            </a>
          </li>
          <li>
            <a href="https://instagram.com/keiberup/" target="_blank">
              <TfiInstagram className={style.bgIcon} />
            </a>
          </li>
          <li>
            <a href="https://linkedin.com/in/keiber-urbila/" target="_blank">
              <TfiLinkedin className={style.bgIcon} />
            </a>
          </li>
        </ul>
        <p>
          ¡Hola! Mi nombre es Keiber y soy un desarrollador de aplicaciones web
          Fullstack. Tengo experiencia en administración de servidores GNU/LINUX
          y bash scripting, así como en el análisis y manipulación de datos.
        </p>
      </div>
    </>
  );
};

export default About;
