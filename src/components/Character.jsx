import style from "./Character.module.css";
const Character = () => {
  return (
    <div className={style.character}>
      <div className={style.head}></div>
      <div className={style.body}>
        <div className={style.armLeft}></div>
        <div className={style.armRigth}></div>
      </div>
      <div className={style.legs}></div>
    </div>
  );
};

export default Character;
