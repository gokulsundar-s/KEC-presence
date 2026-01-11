import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../Utils/Constants";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import {
  showErrorToast,
  showSuccessToast,
} from "../../Components/Alerts/Alert";
import { Loaders } from "../../Components/Loaders/Loaders";
import SideTab from "../../Components/SiderTab/SideTab";
import EditUserInfoForm from "./EditUserInfo/EditUserInfoForm";
import ChangePassword from "./ChangePassword/ChangePassword";
import {
  EditIcon,
  PasswordIcon,
  SubmitIcon,
  UsersIcon,
  OrganisationIcon,
  ContactIcon,
} from "../../Assets/Icons";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();

  // State variables for data handling
  const [token, setToken] = useState("");
  const [userID, setUserID] = useState("");
  const [userData, setUserData] = useState({
    userType: "",
    department: "",
    name: "",
    rollNumber: "",
    year: "",
    section: "",
    mail: "",
    phoneNumber: "",
    parentMail: "",
    parentPhone: "",
  });
  const [editUserData, setEditUserData] = useState({
    userType: "",
    department: "",
    name: "",
    rollNumber: "",
    year: "",
    section: "",
    mail: "",
    phoneNumber: "",
    parentMail: "",
    parentPhone: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // State variable for controlling drawer visibility
  const [openEditUserSider, setOpenEditUserSider] = useState(false);
  const [openChangePasswordSider, setOpenChangePasswordSider] = useState(false);

  // State variable for loaders
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  // useEffect to check authentication token and fetch user data
  useEffect(() => {
    const tokenValue = Cookies.get("token");
    const decodedToken = tokenValue ? jwtDecode(tokenValue) : null;
    if (decodedToken && decodedToken.userID) {
      setUserID(decodedToken.userID);
    }
    if (!tokenValue) {
      navigate("/login");
      return;
    }
    setToken(tokenValue);
  }, [navigate]);

  // Fetch user data when token is set
  useEffect(() => {
    if (token) {
      getUserData();
    }
  }, [token]);

  // Function to fetch the users info
  const getUserData = async () => {
    try {
      if (userID) {
        setLoading(true);
        const response = await axios.get(`${baseUrl}/users/${userID}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.status === 200) {
          setUserData(response.data.data);
          setEditUserData(response.data.data);
        } else {
          showErrorToast(response.data.message);
        }
        setLoading(false);
      }
    } catch (error) {
      showErrorToast("An error occurred. Please contact administrator.");
      setLoading(false);
    }
  };

  // Function to edit a user information
  const handleEditUser = async () => {
    try {
      setButtonLoading(true);
      const response = await axios.put(
        `${baseUrl}/users/${editUserData.userID}`,
        editUserData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status === 200) {
        getUserData();
        setOpenEditUserSider(false);
        setButtonLoading(false);
        showSuccessToast(response.data.message);
      } else {
        showErrorToast(response.data.message);
        setButtonLoading(false);
      }
    } catch (error) {
      console.log("error", error);

      setButtonLoading(false);
      showErrorToast("An error occurred. Please contact administrator.");
    }
  };

  // Function to change user password
  const handleChangePassword = async () => {
    try {
      setButtonLoading(true);
      const response = await axios.put(
        `${baseUrl}/user-change-password`,
        { ...passwordData, userID: userID },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status === 200) {
        setOpenChangePasswordSider(false);
        setButtonLoading(false);
        showSuccessToast(response.data.message);
      } else {
        showErrorToast(response.data.message);
        setButtonLoading(false);
      }
    } catch {
      setButtonLoading(false);
      showErrorToast("An error occurred. Please contact administrator.");
    }
  };

  return (
    <div className="page-container">
      <p className="page-header">User Profile</p>

      <div className="user-profile-container">
        {loading ? (
          <Loaders />
        ) : (
          <div className="user-profile-details-container">
            <div className="user-profile-detail-header">
              <div className="user-profile-detail-header-left">
                <p className="user-profile-detail-user-icon">
                  {userData.name.charAt(0).toUpperCase()}
                </p>
                <div className="user-profile-detail-header-texts">
                  <p className="user-profile-detail-user-name">
                    {userData.name}
                  </p>
                  <p className="user-profile-detail-user-mail">
                    {userData.mail}
                  </p>
                </div>
              </div>

              <div className="user-profile-detail-header-right">
                <div className="user-profile-detail-buttons-container">
                  <button
                    className="primary-button"
                    onClick={() => setOpenEditUserSider(!openEditUserSider)}
                  >
                    <EditIcon />
                    Edit Profile
                  </button>

                  <button
                    className="primary-button"
                    onClick={() =>
                      setOpenChangePasswordSider(!openChangePasswordSider)
                    }
                  >
                    <PasswordIcon />
                    Change Password
                  </button>
                </div>
              </div>
            </div>

            <div className="user-profile-detail-info-container">
              <div className="user-profile-detail-info-card">
                <p className="user-profile-detail-info-card-header-text">
                  <UsersIcon />
                  Personal Information
                </p>

                <div className="user-profile-detail-info-card-content">
                  <div className="user-profile-detail-info-card-content-row">
                    <p className="user-profile-detail-info-card-content-label">
                      User ID
                    </p>
                    <p className="user-profile-detail-info-card-content-value">
                      {userData.userID || "-"}
                    </p>
                  </div>
                  <div className="user-profile-detail-info-card-content-row">
                    <p className="user-profile-detail-info-card-content-label">
                      Full Name
                    </p>
                    <p className="user-profile-detail-info-card-content-value">
                      {userData.name || "-"}
                    </p>
                  </div>
                  <div className="user-profile-detail-info-card-content-row">
                    <p className="user-profile-detail-info-card-content-label">
                      User Type
                    </p>
                    <p className="user-profile-detail-info-card-content-value">
                      {userData.userType || "-"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="user-profile-detail-info-card">
                <p className="user-profile-detail-info-card-header-text">
                  <OrganisationIcon />
                  Organizational Information
                </p>

                <div className="user-profile-detail-info-card-content">
                  <div className="user-profile-detail-info-card-content-row">
                    <p className="user-profile-detail-info-card-content-label">
                      Department
                    </p>
                    <p className="user-profile-detail-info-card-content-value">
                      {userData.department || "-"}
                    </p>
                  </div>
                  <div className="user-profile-detail-info-card-content-row">
                    <p className="user-profile-detail-info-card-content-label">
                      Roll Number
                    </p>
                    <p className="user-profile-detail-info-card-content-value">
                      {userData.rollNumber || "-"}
                    </p>
                  </div>
                  <div className="user-profile-detail-info-card-content-row">
                    <p className="user-profile-detail-info-card-content-label">
                      Year
                    </p>
                    <p className="user-profile-detail-info-card-content-value">
                      {userData.year || "-"}
                    </p>
                  </div>
                  <div className="user-profile-detail-info-card-content-row">
                    <p className="user-profile-detail-info-card-content-label">
                      Section
                    </p>
                    <p className="user-profile-detail-info-card-content-value">
                      {userData.section || "-"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="user-profile-detail-info-card">
                <p className="user-profile-detail-info-card-header-text">
                  <ContactIcon />
                  Contact Information
                </p>

                <div className="user-profile-detail-info-card-content">
                  <div className="user-profile-detail-info-card-content-row">
                    <p className="user-profile-detail-info-card-content-label">
                      Email
                    </p>
                    <p className="user-profile-detail-info-card-content-value">
                      {userData.mail || "-"}
                    </p>
                  </div>
                  <div className="user-profile-detail-info-card-content-row">
                    <p className="user-profile-detail-info-card-content-label">
                      Phone Number
                    </p>
                    <p className="user-profile-detail-info-card-content-value">
                      {userData.phoneNumber || "-"}
                    </p>
                  </div>
                  <div className="user-profile-detail-info-card-content-row">
                    <p className="user-profile-detail-info-card-content-label">
                      Parent Email
                    </p>
                    <p className="user-profile-detail-info-card-content-value">
                      {userData.parentMail || "-"}
                    </p>
                  </div>
                  <div className="user-profile-detail-info-card-content-row">
                    <p className="user-profile-detail-info-card-content-label">
                      Parent Phone
                    </p>
                    <p className="user-profile-detail-info-card-content-value">
                      {userData.parentPhone || "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Side tab for adding new user */}
      <SideTab
        open={openEditUserSider}
        setOpen={setOpenEditUserSider}
        title={"Edit User Information"}
        footer={
          <button
            className="primary-button"
            onClick={handleEditUser}
            disabled={buttonLoading}
          >
            {buttonLoading ? (
              <span className="button-loader"></span>
            ) : (
              <>
                Submit
                <SubmitIcon />
              </>
            )}
          </button>
        }
      >
        <EditUserInfoForm
          userData={editUserData}
          setUserData={setEditUserData}
        />
      </SideTab>

      {/* Side tab for changing password */}
      <SideTab
        open={openChangePasswordSider}
        setOpen={setOpenChangePasswordSider}
        title={"Change Password"}
        footer={
          <button
            className="primary-button"
            onClick={handleChangePassword}
            disabled={buttonLoading}
          >
            {buttonLoading ? (
              <span className="button-loader"></span>
            ) : (
              <>
                Submit
                <SubmitIcon />
              </>
            )}
          </button>
        }
      >
        <ChangePassword
          passwordData={passwordData}
          setPasswordData={setPasswordData}
        />
      </SideTab>
    </div>
  );
}
