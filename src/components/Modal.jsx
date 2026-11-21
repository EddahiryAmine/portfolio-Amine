import { useEffect } from "react";

export default function Modal({ title, onClose, children }) {
  useEffect(() => {
    const key = (e) => e.key === "Escape" && onClose();
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, [onClose]);
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
      <div className="modal-in" onClick={(e) => e.stopPropagation()}>
        <button className="modal-x" onClick={onClose} aria-label="Fermer">×</button>
        {children}
      </div>
    </div>
  );
}
