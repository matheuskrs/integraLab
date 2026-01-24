import { createPortal } from "react-dom";
import { useState, useEffect } from "react";
import "./modal.css";

export default function Modal({ open, title, onClose, children }) {
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
  };

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  if (!open && !closing) return null;

  const handleAnimationEnd = () => {
    if (!closing) return;
    setClosing(false);
    onClose();
  };
  const content = typeof children === "function" ? children(handleClose) : children;
  return createPortal(
    <div
      className={`modal-backdrop ${closing ? "closing" : ""}`}
      onClick={handleClose}
    >
      <div
        className={`modal ${closing ? "closing" : ""}`}
        onAnimationEnd={handleAnimationEnd}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={handleClose}>
            x
          </button>
        </header>

        <div className="modal-body">{content}</div>
      </div>
    </div>,
    document.body,
  );
}
