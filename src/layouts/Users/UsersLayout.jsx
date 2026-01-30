import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";

export default function UsersLayout() {
  return (
    <div className="users-container">
      <Sidebar activePage={"users"} />
      <main className="users-main">
        <Outlet />
      </main>
    </div>
  );
}
