import { useToast } from "../../providers/Toast/useToast";
import Toast from "./Toast";
import styles from "./toast.module.css";

export default function ToastContainer() {
  const { toasts } = useToast();

  return (
    <div className={styles["toast-container"]}>
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
}
