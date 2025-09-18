import { useState } from "react";
import {
  SuccessIcon,
  ChangePasswordIcon,
  ChangeUserInfoIcon,
  ConfirmIcon,
} from "../../Assets/Icons";
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

export const ChangePasswordModal = ({ onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="modal-container">
      <div className="modal-box">
        <div className="modal-title">
          <ChangePasswordIcon />
          <p>Change Password</p>
        </div>

        <div className="modal-form-container">
          <div className="form-input">
            <p>Current Password</p>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Current Password"
            />
          </div>
          <div className="form-input">
            <p>New Password</p>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter New Password"
            />
          </div>
          <div className="form-input">
            <p>Confirm New Password</p>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm New Password"
            />
          </div>

          <div className="forget-password-form-show-password">
            <input
              type="checkbox"
              id="show-password"
              onChange={() => setShowPassword(!showPassword)}
            />
            <label>Show Password</label>
          </div>

          <div className="modal-button">
            <button className="modal-blue-button">Change Password</button>
            <button className="modal-red-button" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ChangeUserInfoModal = ({ onClose }) => {
  return (
    <div className="modal-container">
      <div className="modal-box">
        <div className="modal-title">
          <ChangeUserInfoIcon />
          <p>Change User Information</p>
        </div>

        <div className="modal-form-container">
          <div className="form-input">
            <p>Full Name</p>
            <input type="text" placeholder="Enter your Full Name" />
          </div>
          <div className="form-input">
            <p>Mail ID</p>
            <input type="mail" placeholder="Enter your Mail ID" />
          </div>
          <div className="form-input">
            <p>Phone Number</p>
            <input type="tel" placeholder="Enter your Phone Number" />
          </div>
        </div>

        <div className="modal-button">
          <button className="modal-blue-button">Update User Info</button>
          <button className="modal-red-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export const PasswordConfirmModal = ({ icon, title, message, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="modal-container">
      <div className="modal-box">
        <div className="modal-title">
          {icon}
          <p>{title}</p>
        </div>
        <p className="modal-content">{message}</p>
        <div className="modal-form-container">
          <div className="form-input">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your Password"
            />
          </div>
        </div>

        <div className="forget-password-form-show-password">
          <input
            type="checkbox"
            id="show-password"
            onChange={() => setShowPassword(!showPassword)}
          />
          <label>Show Password</label>
        </div>

        <div className="modal-button">
          <button className="modal-blue-button">Confirm</button>
          <button className="modal-red-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
