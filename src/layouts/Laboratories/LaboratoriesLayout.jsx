import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import styles from './laboratories.module.css';

export default function LaboratoriesLayout() {
  return (
    <div className={styles["laboratories-container"]}>
      <Sidebar activePage={"laboratories"}/>
      <main className={styles["access-main"]}>
        <Outlet />
      </main>
    </div>
  );
}
