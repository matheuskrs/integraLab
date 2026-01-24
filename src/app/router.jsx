import { createBrowserRouter, Outlet } from "react-router-dom";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import AuthLayout from "../layouts/Auth/AuthLayout";
import LoginPage from "../pages/Login/LoginPage";
import AccessManagementLayout from "../layouts/AccessManagement/AccessManagementLayout";
import AccessManagement from "../pages/AccessManagement/AccessManagement";

export const router = createBrowserRouter([
  {
    element: <Outlet />,
    errorElement: <ErrorPage />,
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
