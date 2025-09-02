import { SuccessIcon } from "../../Assets/Icons";
import "./Modals.css";

export const ConfirmModal = ({
  icon,
  title,
  message,
  onClose,
  onConfirm,
  loading,
}) => {
  return (
    <div className="modal-container">
      <div className="modal-box">
        <div className="modal-title">
          {icon}
          <p>{title}</p>
        </div>
        <p className="modal-content">{message}</p>
        <div className="modal-button">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="modal-red-button"
          >
            {loading ? <span className="modal-button-loader"></span> : "Yes"}
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

export const BulkAddModal = ({ data, onClose }) => {
  const successTotal = data.reduce((acc, item) => {
    return item.status === 200 ? acc + 1 : acc;
  }, 0);

  const failedTotal = data.reduce((acc, item) => {
    return item.status === 400 ? acc + 1 : acc;
  }, 0);

  return (
    <div className="modal-container">
      <div className="modal-box">
        <div className="modal-content">
          <div className="modal-content-count-container">
            <div className="modal-success-counts">
              <p>{successTotal}</p>
              <p>Users Success</p>
            </div>
            <div className="modal-failed-counts">
              <p>{failedTotal}</p>
              <p>Users Failed</p>
            </div>
          </div>

          <div className="modal-table-container">
            <table className="modal-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr
                    key={index}
                    className={
                      item.status === 200 ? "row-success" : "row-failed"
                    }
                  >
                    <td>{item.mail}</td>
                    <td>{item.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="modal-button">
          <button onClick={onClose} className="modal-red-button">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
