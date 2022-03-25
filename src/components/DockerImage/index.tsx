import { FC } from "react";
import styles from "./index.module.scss";

interface IDockerProps {
  latestImage: string;
  date: string;
  getLatestImage: () => void;
}

export const Docker: FC<IDockerProps> = ({
  latestImage,
  date,
  getLatestImage,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles["container-comand"]}>
        <p className={styles["container-date"]}>{date}</p>
        <p className={styles["container-text"]}>{`V${latestImage}`}</p>
      </div>
      <button className={styles["container-button"]} onClick={getLatestImage}>
        Update
      </button>
    </div>
  );
};
