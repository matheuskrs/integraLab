import { createContext, useContext } from "react";

export const GlobalLoadingContext = createContext(null);

export function useGlobalLoading() {
  const ctx = useContext(GlobalLoadingContext);
  if (!ctx) {
    throw new Error("useGlobalLoading deve ser usado dentro de GlobalLoadingProvider");
  }
  return ctx;
}
