import { createBrowserRouter, Outlet } from "react-router-dom";
import { lazy } from "react";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import RootLayout from "../layouts/RootLayout/RootLayout";

const AuthLayout = lazy(() => import("../layouts/Auth/AuthLayout"));
const LoginPage = lazy(() => import("../pages/Login/LoginPage"));
const AccessManagementLayout = lazy(
  () => import("../layouts/AccessManagement/AccessManagementLayout"),
);
const AccessManagement = lazy(
  () => import("../pages/AccessManagement/AccessManagement"),
);
const LaboratoriesLayout = lazy(
  () => import("../layouts/Laboratories/LaboratoriesLayout"),
);
const Laboratories = lazy(() => import("../pages/Laboratories/Laboratories"));

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
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
      {
        path: "/laboratories",
        element: <LaboratoriesLayout />,
        children: [{ index: true, element: <Laboratories /> }],
      },
    ],
  },
]);
