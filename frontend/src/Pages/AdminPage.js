import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import Popup from "reactjs-popup";
import AdminDashboard from "../Components/AdminDashBoard";
import AdminAddUser from "../Components/AdminAddUser";
import AdminUserdata from "../Components/AdminUserdata";

export default function AdminPage() {
  const [activeTab, setactiveTab] = useState(2);
  const [isLoading, setIsLoading] = useState(true);
  const [currentpassword, setCurrentPassword] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [showpassword, setShowPassword] = useState(false);
  const [showChangePasswordPopup, setChangePasswordPopup] = useState(false);
  const [showLogoutPopup, setLogouPopup] = useState(false);
  const navigate = useNavigate();

  setTimeout(() => {
    setIsLoading(false);
  }, 2000);

  const handleTabClick = (id) => setactiveTab(id);

  const handleCurrentPasswordChange = (event) =>
    setCurrentPassword(event.target.value);

  const handleNewPasswordChange = (event) => setNewPassword(event.target.value);
  const handleConfirmPasswordChange = (event) =>
    setConfirmPassword(event.target.value);
  const handleCheckboxChange = () => setShowPassword((prevState) => !prevState);

  const handleChangePasswordPopup = () => setChangePasswordPopup(true);
  const handleChangePassword = async () => {
    if (newpassword === confirmpassword) {
      if (newpassword.length < 8) {
        toast.error("Your new password is weak");
      } else {
        const jwt_data = jwtDecode(Cookies.get("data"));
        const mail = jwt_data.mail;

        const response = await axios.post(
          "http://localhost:3003/changepassword",
          { mail, currentpassword, newpassword }
        );

        if (response.data === "202") {
          toast.success("Password changed");
          setChangePasswordPopup(false);
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setShowPassword(false);
        } else if (response.data === "402") {
          toast.error("Wrong current password");
        }
      }
    } else {
      toast.error("Passwords doesnot match");
    }
  };
  const handleCloseChangePasswordPopup = () => {
    setChangePasswordPopup(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPassword(false);
  };

  useEffect(() => {
    if (Cookies.get("data") === undefined) {
      navigate("/");
    } else {
      const jwt_data = jwtDecode(Cookies.get("data"));

      if (jwt_data.usertype === "Advoicer") {
        navigate("/advoicer");
      } else if (jwt_data.usertype === "Student") {
        navigate("/student");
      } else if (jwt_data.usertype === "Admin") {
        navigate("/admin");
      }
    }
  }, [navigate]);

  const handleLogoutPopup = () => {
    setLogouPopup(true);
  };
  const handleLogout = async () => {
    Cookies.remove("data");
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    window.location.reload(false);
  };
  const handleCloseLogoutPopup = () => {
    setLogouPopup(false);
  };

  return (
    <>
      {isLoading ? (
        <div className="loading-component">
          <p>Loading...</p>
        </div>
      ) : (
        <div className="pages-container">
          <ul className="drawer-container">
            <div className="drawer-header">
              <img src={require("../Sources/KEC.png")} alt="logo1"></img>
              <p>Admin</p>
            </div>

            {/* <button
              className={activeTab === 1 ? "active" : ""}
              onClick={() => handleTabClick(1)}
            >
              <div>
                <img src={require("../Sources/dashboard.png")} alt="icon"></img>
                <p>Dashboard</p>
              </div>
            </button> */}
            
            <button
              className={activeTab === 2 ? "active" : ""}
              onClick={() => handleTabClick(2)}
            >
              <div>
                <img src={require("../Sources/add-user.png")} alt="icon"></img>
                <p>Add User</p>
              </div>
            </button>
            <button
              className={activeTab === 3 ? "active" : ""}
              onClick={() => handleTabClick(3)}
            >
              <div>
                <img src={require("../Sources/user-data.png")} alt="icon"></img>
                <p>User Data</p>
              </div>
            </button>

            <Popup
              trigger={
                <button>
                  <div>
                    <img
                      src={require("../Sources/settings.png")}
                      alt="icon"
                    ></img>
                    <p>Settings</p>
                  </div>
                </button>
              }
              position="right"
            >
              <button
                className="drawer-settings-button"
                onClick={handleChangePasswordPopup}
              >
                <img src={require("../Sources/password.png")} alt="icon"></img>
                Change Password
              </button>
              <button
                className="drawer-settings-button drawer-logout-button"
                onClick={handleLogoutPopup}
              >
                <img src={require("../Sources/logout.png")} alt="icon"></img>
                Logout
              </button>
            </Popup>
          </ul>

          <div className="page-components-container">
            {activeTab === 1 && <AdminDashboard />}
            {activeTab === 2 && <AdminAddUser />}
            {activeTab === 3 && <AdminUserdata />}
          </div>
        </div>
      )}

      {showChangePasswordPopup && (
        <div className="popups-container">
          <div className="popups-box">
            <p className="popups-header">
              <b>Change Password</b>
            </p>

            <div className="popups-input-container">
              <p>Current password</p>
              <input
                className="popups-input-container-inputs"
                type={showpassword ? "text" : "password"}
                value={currentpassword}
                onChange={handleCurrentPasswordChange}
              ></input>

              <p>New password</p>
              <input
                className="popups-input-container-inputs"
                type={showpassword ? "text" : "password"}
                value={newpassword}
                onChange={handleNewPasswordChange}
              ></input>

              <p>Confirm password</p>
              <input
                className="popups-input-container-inputs"
                type={showpassword ? "text" : "password"}
                value={confirmpassword}
                onChange={handleConfirmPasswordChange}
              ></input>

              <div className="popups-show-password">
                <input
                  type="checkbox"
                  checked={showpassword}
                  onChange={handleCheckboxChange}
                ></input>
                <label>Show passwords</label>
              </div>
            </div>

            <div className="popups-buttons-container">
              <button
                className="popups-button popups-blue-button"
                onClick={handleChangePassword}
              >
                Submit
              </button>
              <button
                className="popups-button popups-white-button"
                onClick={handleCloseChangePasswordPopup}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showLogoutPopup && (
        <div className="popups-container">
          <div className="popups-box">
            <p className="popups-header">Are you sure to logout?</p>

            <div className="popups-buttons-container">
              <button
                className="popups-button popups-red-button"
                onClick={handleLogout}
              >
                Yes
              </button>
              <button
                className="popups-button popups-white-button"
                onClick={handleCloseLogoutPopup}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      <Toaster toastOptions={{ duration: 5000 }} />
    </>
  );
}
