import React from "react";
import "./ConfirmModal.css";

export default function ConfirmModal({
  icon,
  title,
  message,
  onClose,
  onConfirm,
}) {
  return (
    <div className="confirm-modal-container">
      <div className="confirm-modal-box">
        <div className="confirm-modal-title">
          {icon}
          <p>{title}</p>
        </div>
        <p className="confirm-modal-content">{message}</p>
        <div className="confirm-modal-button">
          <button onClick={onConfirm} className="confirm-modal-red-button">
            Yes
          </button>
          <button onClick={onClose} className="confirm-modal-blue-button">
            No
          </button>
        </div>
      </div>
    </div>
  );
}
