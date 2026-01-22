import { createPortal } from "react-dom";
import "./modal.css";

export default function Modal({ open, title, onClose, children }) {
  if (!open) return null;

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>
            x
          </button>
        </header>

        <div className="modal-body">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
