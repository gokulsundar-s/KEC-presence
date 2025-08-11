import React, { useState } from "react";
import { ConfirmIcon } from "../../Assets/Icons";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import ConfirmModal from "../../Components/ConfirmModal/ConfirmModal";
import "./Settings.css";

export default function Settings() {
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleLogout = () => {
    Cookies.remove("authToken");
    Cookies.remove("userDetailsToken");
    navigate("/login");
  };

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

      <div className="logout-container">
        <button onClick={() => setShowConfirmModal(true)}>Logout</button>
      </div>

      {showConfirmModal && (
        <ConfirmModal
          icon={<ConfirmIcon />}
          title="Confirm Logout"
          message="Are you sure you want to logout?"
          onClose={() => {
            setShowConfirmModal(false);
          }}
          onConfirm={handleLogout}
        />
      )}
    </div>
  );
}
