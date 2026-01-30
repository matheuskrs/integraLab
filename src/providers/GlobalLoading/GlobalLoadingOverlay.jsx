import styles from "./globalLoading.module.css";

export default function GlobalLoadingOverlay({ visible, text }) {
  return (
    <div className={`${styles["global-loading"]} ${visible ? "" : styles.hidden}`}>
      <div className={styles.spinner} />
      <span className={styles["loading-text"]}>{text}</span>
    </div>
  );
}
