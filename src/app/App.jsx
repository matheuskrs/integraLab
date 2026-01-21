import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { ToastProvider } from "../contexts/ToastProvider";
import ToastContainer from "../components/Toast/ToastContainer";

export default function App() {
  return (
    <ToastProvider>
      <ToastContainer/>
      <RouterProvider router={router} />
    </ToastProvider>
  );
}
