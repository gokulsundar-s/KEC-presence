import { useState, useEffect } from "react";
import Logo from "../../../../assets/kec-logo.png";
import {
  DashboardIcon,
  NewRequestIcon,
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
              activeTab === "/generic-codes" ? "sidebar-active-button" : ""
            }`}
            onClick={() => navigate("/generic-codes")}
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

        {userType === "STUDENT" && (
          <button
            className={`sidebar-button ${
              activeTab === "/requests" ? "sidebar-active-button" : ""
            }`}
            onClick={() => navigate("/requests")}
          >
            <NewRequestIcon />
            <p>New Request</p>
          </button>
        )}
      </div>
    </div>
  );
}
