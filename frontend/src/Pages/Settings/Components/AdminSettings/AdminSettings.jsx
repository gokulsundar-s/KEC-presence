import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Loaders } from "../../../../Components/Loaders/Loaders";
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
import {
  showErrorToast,
  showSuccessToast,
} from "../../../../Components/Alerts/Alert";
import { baseUrl } from "../../../../Utils/Constants";
import "./AdminSettings.css";

export default function AdminSettings() {
  const [userID, setUserID] = useState("");
  const [sessionID, setSessionID] = useState("");
  const [userType, setUserType] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showChangeUserInfoModal, setShowChangeUserInfoModal] = useState(false);
  const [showMigrationModal, setShowMigrationModal] = useState(false);
  const [showDeleteSessionsModal, setShowDeleteSessionsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [settingsData, setSettingsData] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [userInfoData, setUserInfoData] = useState({
    name: "",
    mail: "",
    phoneNumber: "",
  });
  const [userPassword, setUserPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    try {
      const authToken = Cookies.get("token");
      const userDetailsToken = Cookies.get("token");
      if (!userDetailsToken) {
        navigate("/login");
        return;
      }
      const decodedUsersToken = jwtDecode(userDetailsToken);
      const decodedAuthToken = jwtDecode(authToken);
      setUserType(decodedUsersToken?.userType ?? "");
      setUserID(decodedUsersToken?.userID ?? "");
      setSessionID(decodedAuthToken?.sessionID ?? "");
    } catch (error) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const tokenString = Cookies.get("token");

      if (!tokenString) {
        navigate("/login");
        return;
      }

      const decodedAuth = jwtDecode(tokenString);
      const sessionID = decodedAuth?.sessionID;

      if (!sessionID) {
        Cookies.remove("token");
        Cookies.remove("token");
        navigate("/login");
        return;
      }

      const response = await axios.post(`${baseUrl}/logout`, { sessionID });

      if (response.status === 200) {
        Cookies.remove("token");
        Cookies.remove("token");
        navigate("/login");
      }
    } catch (error) {
      showErrorToast("An error occurred while logging out.");
    }
  };

  const handlePasswordChange = async () => {
    try {
      const response = await axios.put(`${baseUrl}/change-password`, {
        userID: userID,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmNewPassword: passwordData.confirmNewPassword,
      });

      if (response.data.status === 200) {
        showSuccessToast(response.data.message);
        setShowChangePasswordModal(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      } else {
        showErrorToast(response.data.message);
      }
    } catch (error) {
      showErrorToast("Server Error");
    }
  };

  const handleUpdateUserInfo = async () => {
    try {
      const response = await axios.put(`${baseUrl}/users/${userID}`, {
        userType: userType,
        name: userInfoData.name,
        mail: userInfoData.mail,
        phoneNumber: userInfoData.phoneNumber,
      });

      if (response.data.status === 200) {
        showSuccessToast(response.data.message);
        setShowChangeUserInfoModal(false);
        setUserInfoData({
          name: "",
          mail: "",
          phoneNumber: "",
        });
        getSettingsData();
      } else {
        showErrorToast(response.data.message);
      }
    } catch (error) {
      showErrorToast("Server Error");
    }
  };

  const handleMigrateYear = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/settings/admin/migrate-year`,
        {
          userID: userID,
          password: userPassword,
        }
      );

      if (response.data.status === 200) {
        showSuccessToast(response.data.message);
        setShowMigrationModal(false);
        setUserPassword("");
      } else {
        showErrorToast(response.data.message);
      }
    } catch (error) {
      showErrorToast("Server Error");
    }
  };

  const handleDeleteSessions = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/settings/admin/inactive-users`,
        {
          userID: userID,
          password: userPassword,
          sessionID: sessionID,
        }
      );

      if (response.data.status === 200) {
        showSuccessToast(response.data.message);
        setShowDeleteSessionsModal(false);
        setUserPassword("");
      } else {
        showErrorToast(response.data.message);
      }
    } catch (error) {
      showErrorToast("Server Error");
    }
  };

  const getSettingsData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/settings/admin/${userID}`);
      setSettingsData(response.data.data);
      setUserInfoData({
        name: response.data.data?.userInfoData?.name || "",
        mail: response.data.data?.userInfoData?.mail || "",
        phoneNumber: response.data.data?.userInfoData?.phoneNumber || "",
      });
    } catch {
      showErrorToast("Server Error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userID) getSettingsData();
  }, [userID]);

  return (
    <>
      {loading ? (
        <Loaders />
      ) : (
        <div className="admin-settings-container">
          <div className="admin-settings-profile-container">
            <div className="admin-settings-profile-items">
              <p className="admin-settings-profile-title">User Information</p>

              <div className="admin-settings-profile-item">
                <SettingsUserIcon />
                <p className="admin-settings-profile-item-header">
                  Full Name :
                </p>
                <p>{settingsData?.userInfoData?.name ?? "-"}</p>
              </div>
              <div className="admin-settings-profile-item">
                <SettingsMailIcon />
                <p className="admin-settings-profile-item-header">Mail ID :</p>
                <p>{settingsData?.userInfoData?.mail ?? "-"}</p>
              </div>
              <div className="admin-settings-profile-item">
                <SettingsPhoneIcon />
                <p className="admin-settings-profile-item-header">
                  Phone Number :
                </p>
                <p>{settingsData?.userInfoData?.phoneNumber ?? "-"}</p>
              </div>

              <div className="admin-settings-profile-item">
                <SettingsLastLoginIcon />
                <p className="admin-settings-profile-item-header">
                  Last Login :
                </p>
                <p>
                  {formatDateTime(settingsData?.loginData?.lastLogin) ?? "-"}
                </p>
              </div>
              <div className="admin-settings-profile-item">
                <SettingsLoginCountIcon />
                <p className="admin-settings-profile-item-header">
                  Total Active Logins :
                </p>
                <p>{settingsData?.loginData?.loginCounts ?? "-"}</p>
              </div>
            </div>

            <div className="admin-settings-profile-buttons-container">
              <button
                className="primary-button"
                onClick={() => setShowChangeUserInfoModal(true)}
              >
                Update User Info
              </button>
              <button
                className="primary-button"
                onClick={() => setShowChangePasswordModal(true)}
              >
                Change Password
              </button>
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
              <p className="admin-settings-privileges-title">
                Migrate Academic Year
              </p>
              <p className="admin-settings-privileges-content">
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
              <p className="admin-settings-privileges-title">
                Inactive all Active Sessions
              </p>
              <p className="admin-settings-privileges-content">
                This button removes all active sessions of the user, effectively
                logging them out from every device or browser where they are
                logged in. This ensures that the user has no ongoing active
                sessions, typically for security or account management purposes.
              </p>
              <button
                className="logout-button"
                onClick={() => setShowDeleteSessionsModal(true)}
              >
                Inactive All Active Sessions
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <ConfirmModal
          title="Confirm Logout"
          message="Are you sure you want to logout?"
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleLogout}
          loading={false}
        />
      )}

      {showChangePasswordModal && (
        <ChangePasswordModal
          onClose={() => {
            setShowChangePasswordModal(false);
            setPasswordData({
              currentPassword: "",
              newPassword: "",
              confirmNewPassword: "",
            });
          }}
          setPasswordData={setPasswordData}
          passwordData={passwordData}
          onSubmit={handlePasswordChange}
        />
      )}

      {showChangeUserInfoModal && (
        <ChangeUserInfoModal
          onClose={() => setShowChangeUserInfoModal(false)}
          setUserInfoData={setUserInfoData}
          userInfoData={userInfoData}
          onSubmit={handleUpdateUserInfo}
        />
      )}

      {showMigrationModal && (
        <PasswordConfirmModal
          title="Confirm Academic Year Migration"
          message="Are you sure to migrate the academic year? To confirm please enter your password below."
          onClose={() => setShowMigrationModal(false)}
          setUserPassword={setUserPassword}
          onSubmit={handleMigrateYear}
        />
      )}

      {showDeleteSessionsModal && (
        <PasswordConfirmModal
          title="Confirm Inactive All Active Sessions"
          message="Are you sure to inactive all active sessions? To confirm please enter your password below."
          onClose={() => setShowDeleteSessionsModal(false)}
          setUserPassword={setUserPassword}
          onSubmit={handleDeleteSessions}
        />
      )}
    </>
  );
}
