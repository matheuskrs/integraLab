import { createBrowserRouter, Outlet } from "react-router-dom";
import NotFound from "../pages/NotFound/NotFound";
import AuthLayout from "../layouts/Auth/AuthLayout";
import LoginPage from "../pages/Login/LoginPage";
import AccessManagementLayout from "../layouts/AccessManagement/AccessManagementLayout";
import AccessManagement from "../pages/AccessManagement/AccessManagement";

export const router = createBrowserRouter([
  {
    element: <Outlet />,
    errorElement: <NotFound />,
    children: [
      {
        element: <AuthLayout />,
        children: [{ index: true, element: <LoginPage /> }],
      },
      {
        path: "/access",
        element: <AccessManagementLayout />,
        children: [{ index: true, element: <AccessManagement /> }],
      },
    ],
  },
]);
