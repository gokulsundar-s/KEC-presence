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
import "./StudentSettings.css";

export default function StudentSettings() {
  const [userID, setUserID] = useState("");
  const [sessionID, setSessionID] = useState("");
  const [userType, setUserType] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showChangeUserInfoModal, setShowChangeUserInfoModal] = useState(false);
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
        <div className="student-settings-container">
          <div className="student-settings-profile-container">
            <div className="student-settings-profile-items">
              <p className="student-settings-profile-title">User Information</p>

              <div className="student-settings-profile-item">
                <SettingsUserIcon />
                <p className="student-settings-profile-item-header">
                  Full Name :
                </p>
                <p>{settingsData?.userInfoData?.name ?? "-"}</p>
              </div>
              <div className="student-settings-profile-item">
                <SettingsMailIcon />
                <p className="student-settings-profile-item-header">
                  Mail ID :
                </p>
                <p>{settingsData?.userInfoData?.mail ?? "-"}</p>
              </div>
              <div className="student-settings-profile-item">
                <SettingsPhoneIcon />
                <p className="student-settings-profile-item-header">
                  Phone Number :
                </p>
                <p>{settingsData?.userInfoData?.phoneNumber ?? "-"}</p>
              </div>

              <div className="student-settings-profile-item">
                <SettingsLastLoginIcon />
                <p className="student-settings-profile-item-header">
                  Last Login :
                </p>
                <p>
                  {formatDateTime(settingsData?.loginData?.lastLogin) ?? "-"}
                </p>
              </div>
              <div className="student-settings-profile-item">
                <SettingsLoginCountIcon />
                <p className="student-settings-profile-item-header">
                  Total Active Logins :
                </p>
                <p>{settingsData?.loginData?.loginCounts ?? "-"}</p>
              </div>
            </div>

            <div className="student-settings-profile-buttons-container">
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
    </>
  );
}
