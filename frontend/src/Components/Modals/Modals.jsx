import { SuccessIcon } from "../../Assets/Icons";
import "./Modals.css";

export const ConfirmModal = ({ icon, title, message, onClose, onConfirm }) => {
  return (
    <div className="modal-container">
      <div className="modal-box">
        <div className="modal-title">
          {icon}
          <p>{title}</p>
        </div>
        <p className="modal-content">{message}</p>
        <div className="modal-button">
          <button onClick={onConfirm} className="modal-red-button">
            Yes
          </button>
          <button onClick={onClose} className="modal-blue-button">
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export const SuccessModal = ({ message, onClose }) => {
  return (
    <div className="modal-container">
      <div className="modal-box">
        <div className="modal-icon">
          <SuccessIcon />
        </div>
        <p className="modal-content-center">{message}</p>
        <div className="modal-button">
          <button onClick={onClose} className="modal-red-button">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
