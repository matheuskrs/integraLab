import { Outlet } from "react-router-dom";
import Sidebar from "~/components/Sidebar/Sidebar";
import styles from "./users.module.css";

export default function UsersLayout() {
  return (
    <div className={styles["users-container"]}>
      <Sidebar activePage={"users"} />
      <main className={styles["users-main"]}>
        <Outlet />
      </main>
    </div>
  );
}
