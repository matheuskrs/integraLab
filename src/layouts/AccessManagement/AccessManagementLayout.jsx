import { Outlet } from "react-router-dom";
import Sidebar from "~/components/Sidebar/Sidebar";
import styles from './accessManagement.module.css';

export default function AccessManagementLayout() {
  return (
    <div className={styles["access-container"]}>
      <Sidebar activePage={"access"}/>
      <main className={styles["access-main"]}>
        <Outlet />
      </main>
    </div>
  );
}
