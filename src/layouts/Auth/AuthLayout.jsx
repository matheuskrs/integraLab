import { Outlet } from "react-router-dom";
import styles from "./auth.module.css";

export default function AuthLayout() {
  return (
    <div className={styles["auth-container"]}>
      <Outlet />
    </div>
  );
}
