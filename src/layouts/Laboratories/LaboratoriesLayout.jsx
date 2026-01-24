import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import './laboratories.css';

export default function LaboratoriesLayout() {
  return (
    <div className="laboratories-container">
      <Sidebar activePage={"laboratories"}/>
      <main className="access-main">
        <Outlet />
      </main>
    </div>
  );
}
