import { useState, useCallback } from "react";
import { ToastContext } from "./toast.context";

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((title, message, type = "info", duration = 3000) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, title, message, type, duration }]);
  }, []);

  return (
    <ToastContext.Provider
      value={{
        success: (title, msg, d) => showToast(title, msg, "success", d),
        error: (title, msg, d) => showToast(title, msg, "error", d),
        info: (title, msg, d) => showToast(title, msg, "info", d),
        toasts,
        removeToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
}
