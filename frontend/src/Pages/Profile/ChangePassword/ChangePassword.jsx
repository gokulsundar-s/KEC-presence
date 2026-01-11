import { useState } from "react";
import "./ChangePassword.css";

export default function ChangePassword({ passwordData = {}, setPasswordData }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="sidebar-form-container">
      <div className="sidebar-form-form">
        <div className="form-input">
          <p>Currenct Password</p>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Current Password"
            value={passwordData.currentPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                currentPassword: e.target.value,
              })
            }
          />
        </div>

        <div className="form-input">
          <p>New Password</p>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter New Password"
            value={passwordData.newPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                newPassword: e.target.value,
              })
            }
          />
        </div>

        <div className="form-input">
          <p>Confirm New Password</p>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Confirm New Password"
            value={passwordData.confirmPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                confirmPassword: e.target.value,
              })
            }
          />
        </div>

        <div className="show-password-container">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          <p> Show Password</p>
        </div>
      </div>
    </div>
  );
}
