import { useEffect } from "react";
import { useGlobalLoading } from "../Loading/GlobalLoadingContext"; 

export function SuspenseGlobalLoadingFallback() {
  const { showLoading, hideLoading } = useGlobalLoading();

  useEffect(() => {
    showLoading("Carregando página");
    return () => hideLoading();
  }, [showLoading, hideLoading]);

  return null;
}
