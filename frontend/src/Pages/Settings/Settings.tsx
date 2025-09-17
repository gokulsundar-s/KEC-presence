import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { baseUrl } from "../../Utils/Constants";
import { ConfirmIcon } from "../../Assets/Icons";
import { useNavigate } from "react-router-dom";
import { ConfirmModal } from "../../Components/Modals/Modals";
import { showErrorToast } from "../../Components/Alerts/Alert";
import "./Settings.css";

interface DecodedToken {
  sessionID: string;
}

export default function Settings() {
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleLogout = async () => {
    try {
      const tokenString = Cookies.get("authToken");

      if (!tokenString) {
        navigate("/login");
        return;
      }

      const sessionID = jwtDecode<DecodedToken>(tokenString).sessionID;

      if (!sessionID) {
        Cookies.remove("authToken");
        Cookies.remove("userDetailsToken");
        navigate("/login");
        return;
      }

      const response = await axios.post(`${baseUrl}/logout`, {
        sessionID: sessionID,
      });

      if (response.status === 200) {
        Cookies.remove("authToken");
        Cookies.remove("userDetailsToken");
        navigate("/login");
      }
    } catch (error) {
      showErrorToast("An error occurred while logging out.");
    }
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
          loading={false}
        />
      )}
    </div>
  );
}
