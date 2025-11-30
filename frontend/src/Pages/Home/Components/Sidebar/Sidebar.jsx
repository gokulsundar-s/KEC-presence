import { useState, useEffect } from "react";
import Logo from "../../../../assets/kec-logo.png";
import {
  DashboardIcon,
  NewRequestIcon,
  HistoryIcon,
  SettingsIcon,
  UsersInfoIcon,
  GenericCodesIcon,
  SessionIcon,
} from "../../../../Assets/Icons";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import "./Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);

  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location.pathname]);

  console.log("activeTab", activeTab);

  var userType = "";
  try {
    userType = jwtDecode(Cookies.get("token")).userType;
  } catch (error) {
    navigate("/login");
  }

  return (
    <div className="sidebar-container">
      <div className="sidebar-logo">
        <img src={Logo} alt="logo" />
      </div>

      <div className="sidebar-buttons-container">
        <button
          className={`sidebar-button ${
            activeTab === "/" ? "sidebar-active-button" : ""
          }`}
          onClick={() => navigate("/")}
        >
          <DashboardIcon />
          <p>Dashboard</p>
        </button>

        {userType === "ADMIN" && (
          <button
            className={`sidebar-button ${
              activeTab === "/users" ? "sidebar-active-button" : ""
            }`}
            onClick={() => navigate("/users")}
          >
            <UsersInfoIcon />
            <p>Users Info</p>
          </button>
        )}

        {userType === "ADMIN" && (
          <button
            className={`sidebar-button ${
              activeTab === "/configs" ? "sidebar-active-button" : ""
            }`}
            onClick={() => navigate("/configs")}
          >
            <GenericCodesIcon />
            <p>Generic Codes</p>
          </button>
        )}

        {userType === "ADMIN" && (
          <button
            className={`sidebar-button ${
              activeTab === "/sessions" ? "sidebar-active-button" : ""
            }`}
            onClick={() => navigate("/sessions")}
          >
            <SessionIcon />
            <p>Sessions</p>
          </button>
        )}

        {userType === "STU" && (
          <button
            className={`sidebar-button ${
              activeTab === "/new-request" ? "sidebar-active-button" : ""
            }`}
            onClick={() => navigate("/new-request")}
          >
            <NewRequestIcon />
            <p>New Request</p>
          </button>
        )}

        {userType === "STU" && (
          <button
            className={`sidebar-button ${
              activeTab === "/history" ? "sidebar-active-button" : ""
            }`}
            onClick={() => navigate("/history")}
          >
            <HistoryIcon />
            <p>History</p>
          </button>
        )}

        {userType === "CA" && (
          <button
            className={`sidebar-button ${
              activeTab === "/approval" ? "sidebar-active-button" : ""
            }`}
            onClick={() => navigate("/approval")}
          >
            <NewRequestIcon />
            <p>Approvals</p>
          </button>
        )}

        {userType === "CA" && (
          <button
            className={`sidebar-button ${
              activeTab === "/approval-history" ? "sidebar-active-button" : ""
            }`}
            onClick={() => navigate("/approval-history")}
          >
            <HistoryIcon />
            <p>History</p>
          </button>
        )}

        <button
          className={`sidebar-button ${
            activeTab === "/settings" ? "sidebar-active-button" : ""
          }`}
          onClick={() => navigate("/settings")}
        >
          <SettingsIcon />
          <p>Settings</p>
        </button>
      </div>
    </div>
  );
}
