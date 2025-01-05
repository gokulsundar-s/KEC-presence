import React from "react";
import "./LogoutPopup.css";

export default function LogoutPopup({handleLogoutUser}) {
    return (
        <>
        <div className = "logout-popup-container">
          <div className = "logout-popup-box">
            <p className = "logout-popup-header">Are you sure to logout?</p>

                    <div className = "logout-popup-buttons-container">
                        <button className = "logout-popup-button logout-popup-red-button" onClick={() => handleLogoutUser(true)}>Yes</button>
                        <button className = "logout-popup-button logout-popup-white-button" onClick={() => handleLogoutUser(false)}>No</button>
                    </div>
                </div>
            </div>
        </>
    )
}