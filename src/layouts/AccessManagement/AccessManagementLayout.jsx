import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import './accessManagement.css';

export default function AccessManagementLayout() {
  return (
    <div className="access-container">
      <Sidebar activePage={"perfis"}/>
      <main className="access-main">
        <Outlet />
      </main>
    </div>
  );
}
