import React from "react";
import "./Settings.css";

export default function Settings() {
  return (
    <div className="page-container">
      <p className="page-header">User Settings</p>

      <div className="settings-container">
        <div className="settings-profile-container">
          <div className="settings-profile-items">
            <p>Name: Gokulsundar S</p>
            <p>Roll Number: 123456</p>
          </div>

          <div className="settings-profile-items">
            <p>Year: 4</p>
            <p>Section: A</p>
          </div>

          <div className="settings-profile-items">
            <p>Department: CSE</p>
            <p>Batch: 2025</p>
          </div>

          <div className="settings-profile-items">
            <p>Kongu Mail ID: gokul@kongu.edu.in</p>
            <p>Phone Number: 1234567890</p>
          </div>
        </div>
      </div>
    </div>
  );
}
