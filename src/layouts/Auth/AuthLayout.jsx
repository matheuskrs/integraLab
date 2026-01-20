import { Outlet } from "react-router-dom";
import "./auth.css";

export default function AuthLayout() {
  return (
    <div className="auth-container">
      <Outlet />
    </div>
  );
}
