import style from "./Character.module.css";
import image from "../assets/rules.png";

const Character = () => {
  return (
    <div className={style.character}>
      <div className={style.head}></div>
      <div className={style.body}>
        <div className={style.armLeft}></div>
        <img src={image} className={style.img} />
        <div className={style.armRigth}></div>
      </div>
      <div className={style.legs}></div>
    </div>
  );
};

export default Character;
