import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { ToastProvider } from "../providers/Toast/ToastProvider";
import ToastContainer from "../components/Toast/ToastContainer";
import { SuspenseGlobalLoadingFallback } from "../providers/GlobalLoading/SuspenseGlobalLoadingFallback"; 
import { Suspense } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

export default function App() {
  return (
    <Suspense fallback={<SuspenseGlobalLoadingFallback />}>
      <TooltipPrimitive.Provider delayDuration={200}>
        <ToastProvider>
          <ToastContainer />
          <RouterProvider router={router} />
        </ToastProvider>
      </TooltipPrimitive.Provider>
    </Suspense>
  );
}
