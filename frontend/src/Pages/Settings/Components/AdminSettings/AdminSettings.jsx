import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loaders from "../../../../Components/Loaders/Loaders";
import {
  SettingsUserIcon,
  SettingsMailIcon,
  SettingsPhoneIcon,
  SettingsLastLoginIcon,
  SettingsLoginCountIcon,
  ConfirmIcon,
} from "../../../../Assets/Icons";
import { formatDateTime } from "../../../../Utils/Formatters";
import {
  ConfirmModal,
  ChangePasswordModal,
  ChangeUserInfoModal,
  PasswordConfirmModal,
} from "../../../../Components/Modals/Modals";
import { showErrorToast } from "../../../../Components/Alerts/Alert";
import { baseUrl } from "../../../../Utils/Constants";
import "./AdminSettings.css";

export default function AdminSettings() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showChangeUserInfoModal, setShowChangeUserInfoModal] = useState(false);
  const [showMigrationModal, setShowMigrationModal] = useState(false);
  const [showDeleteSessionsModal, setShowDeleteSessionsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);

  const navigate = useNavigate();

  let userType = "";
  let userID = "";

  useEffect(() => {
    try {
      const userDetailsToken = Cookies.get("userDetailsToken");
      if (!userDetailsToken) {
        navigate("/login");
        return;
      }
      const decodedToken = jwtDecode(userDetailsToken);
      userType = decodedToken?.userType ?? "";
      userID = decodedToken?.userID ?? "";
    } catch (error) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const tokenString = Cookies.get("authToken");

      if (!tokenString) {
        navigate("/login");
        return;
      }

      const decodedAuth = jwtDecode(tokenString);
      const sessionID = decodedAuth?.sessionID;

      if (!sessionID) {
        Cookies.remove("authToken");
        Cookies.remove("userDetailsToken");
        navigate("/login");
        return;
      }

      const response = await axios.post(`${baseUrl}/logout`, { sessionID });

      if (response.status === 200) {
        Cookies.remove("authToken");
        Cookies.remove("userDetailsToken");
        navigate("/login");
      }
    } catch (error) {
      showErrorToast("An error occurred while logging out.");
    }
  };

  useEffect(() => {
    const getSettingsData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseUrl}/settings/admin/${userID}`);
        setDashboardData(response.data.data);
      } catch {
        showErrorToast("Server Error. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (userID) getSettingsData();
  }, [userID]);

  return (
    <>
      {loading ? (
        <Loaders />
      ) : (
        <div className="settings-container">
          <div className="settings-profile-container">
            <div className="settings-profile-items">
              <p className="settings-profile-title">User Information</p>

              <div className="settings-profile-item">
                <SettingsUserIcon />
                <p className="settings-profile-item-header">Full Name :</p>
                <p>{dashboardData?.userInfoData?.name ?? "-"}</p>
              </div>
              <div className="settings-profile-item">
                <SettingsMailIcon />
                <p className="settings-profile-item-header">Mail ID :</p>
                <p>{dashboardData?.userInfoData?.mail ?? "-"}</p>
              </div>
              <div className="settings-profile-item">
                <SettingsPhoneIcon />
                <p className="settings-profile-item-header">Phone Number :</p>
                <p>{dashboardData?.userInfoData?.phoneNumber ?? "-"}</p>
              </div>

              <div className="settings-profile-item">
                <SettingsLastLoginIcon />
                <p className="settings-profile-item-header">Last Login :</p>
                <p>
                  {formatDateTime(dashboardData?.loginData?.lastLogin) ?? "-"}
                </p>
              </div>
              <div className="settings-profile-item">
                <SettingsLoginCountIcon />
                <p className="settings-profile-item-header">
                  Total Active Logins :
                </p>
                <p>{dashboardData?.loginData?.loginCounts ?? "-"}</p>
              </div>
            </div>

            <div className="settings-profile-buttons-container">
              <div className="settings-profile-userinfo-buttons">
                <button
                  className="primary-button"
                  onClick={() => setShowChangeUserInfoModal(true)}
                >
                  Change User Info
                </button>
                <button
                  className="secondary-button"
                  onClick={() => setShowChangePasswordModal(true)}
                >
                  Change Password
                </button>
              </div>
              <button
                onClick={() => setShowConfirmModal(true)}
                className="logout-button"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="setting-admin-privileges-container">
            <div className="setting-privileges-container">
              <p className="settings-privileges-title">Migrate Academic Year</p>
              <p className="settings-privileges-content">
                This button promotes all students of a selected academic year to
                the next year with a single click. This automates the yearly
                student advancement process efficiently and accurately.
              </p>
              <button
                className="primary-button"
                onClick={() => setShowMigrationModal(true)}
              >
                Migrate Academic Year
              </button>
            </div>
            <div className="setting-privileges-container">
              <p className="settings-privileges-title">
                Delete all Active Sessions
              </p>
              <p className="settings-privileges-content">
                This button removes all active sessions of the user, effectively
                logging them out from every device or browser where they are
                logged in. This ensures that the user has no ongoing active
                sessions, typically for security or account management purposes.
              </p>
              <button
                className="logout-button"
                onClick={() => setShowDeleteSessionsModal(true)}
              >
                Delete All Active Sessions
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <ConfirmModal
          icon={<ConfirmIcon />}
          title="Confirm Logout"
          message="Are you sure you want to logout?"
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleLogout}
          loading={false}
        />
      )}

      {showChangePasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowChangePasswordModal(false)}
        />
      )}

      {showChangeUserInfoModal && (
        <ChangeUserInfoModal
          onClose={() => setShowChangeUserInfoModal(false)}
        />
      )}

      {showMigrationModal && (
        <PasswordConfirmModal
          icon={<ConfirmIcon />}
          title="Confirm Academic Year Migration"
          message="Are you sure to migrate the academin year? To confirm please enter your password below."
          onClose={() => setShowMigrationModal(false)}
        />
      )}

      {showDeleteSessionsModal && (
        <PasswordConfirmModal
          icon={<ConfirmIcon />}
          title="Confirm Delete All Active Sessions"
          message="Are you sure to delete all active sessions? To confirm please enter your password below."
          onClose={() => setShowDeleteSessionsModal(false)}
        />
      )}
    </>
  );
}
