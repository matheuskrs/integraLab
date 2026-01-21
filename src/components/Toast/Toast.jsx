import { useCallback, useEffect, useState } from "react";
import { useToast } from "../../contexts/useToast";
import "./toast.css";

export default function Toast({ id, title, message, type, duration = 300 }) {
  const { removeToast } = useToast();
  const [leaving, setLeaving] = useState(false);
  const close = useCallback(() => {
    setLeaving(true);
    setTimeout(() => removeToast(id), 300);
  }, [id, removeToast]);

  useEffect(() => {
    const timer = setTimeout(close, duration);
    return () => clearTimeout(timer);
  }, [duration, close]);

  return (
    <div className={`toast toast-${type} ${leaving ? "leaving" : ""}`}>
      {title && <strong>{title}</strong>}
      <span className="toast-message">{message}</span>
      <button onClick={close}>x</button>
    </div>
  );
}
