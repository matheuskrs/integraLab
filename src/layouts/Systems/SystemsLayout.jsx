import { Outlet } from "react-router-dom";
import Sidebar from "~/components/Sidebar/Sidebar";
import styles from './systemsLayout.module.css';

export default function SystemsLayout() {
  return (
    <div className={styles["systems-container"]}>
      <Sidebar activePage={"systems"}/>
      <main className={styles["systems-main"]}>
        <Outlet />
      </main>
    </div>
  );
}