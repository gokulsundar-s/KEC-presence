import React, { useState } from "react";
import "./ChangePasswordPopup.css";

export default function ChangePasswordPopup({handleChangePasswordPopup}) {
    const [currentpassword, setCurrentPassword] = useState('');
    const [newpassword, setNewPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');
    const [showpassword, setShowPassword] = useState(false);

    const handleCurrentPasswordChange = (event) => setCurrentPassword(event.target.value);
    const handleNewPasswordChange = (event) => setNewPassword(event.target.value);
    const handleConfirmPasswordChange = (event) => setConfirmPassword(event.target.value);
    const handleCheckboxChange = () => setShowPassword(!showpassword);

    return (
        <div className = "change-password-popup-container">
        <div className = "change-password-popup-box">
            <p className = "change-password-popup-header"><b>Change Password</b></p>

            <div className = "change-password-popup-close">
                <button onClick={() => handleChangePasswordPopup(false)}><img src={require("../../Sources/close.png")} alt="close"></img></button>
            </div>

            <div className = "change-password-popup-input-container">
              <p>Current password</p>
              <input className = "change-password-popup-input-container-inputs" type={showpassword ? 'text' : 'password'} value={currentpassword} onChange={handleCurrentPasswordChange}></input>
              
              <p>New password</p>
              <input className = "change-password-popup-input-container-inputs" type={showpassword ? 'text' : 'password'} value={newpassword} onChange={handleNewPasswordChange}></input>
              
              <p>Confirm password</p>
              <input className = "change-password-popup-input-container-inputs" type={showpassword ? 'text' : 'password'} value={confirmpassword} onChange={handleConfirmPasswordChange}></input>
              
              
              <div className = "change-password-popup-show-password">
                <input type = "checkbox" checked={showpassword} onChange={handleCheckboxChange}></input>
                <label>Show passwords</label>
              </div>
            </div>

            <div className = "change-password-popup-buttons-container">
              <button className = "change-password-popup-button change-password-popup-blue-button">Update</button>
            </div>
          </div>
        </div>
    )
}