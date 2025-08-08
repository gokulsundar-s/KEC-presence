import React from "react";
import { SuccessIcon } from "../../Assets/Icons";
import "./SuccessModal.css";

export default function SuccessModal({ message, onClose }) {
  return (
    <div className="success-modal-container">
      <div className="success-modal-box">
        <div className="success-modal-icon">
          <SuccessIcon />
        </div>
        <p className="success-modal-content">{message}</p>
        <div className="success-modal-button">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
