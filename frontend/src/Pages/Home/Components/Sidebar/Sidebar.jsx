import { useState } from "react";
import Logo from "../../../../assets/kec-logo.png";
import {
  DashboardIcon,
  NewRequestIcon,
  HistoryIcon,
  SettingsIcon,
  UsersInfoIcon,
  ConfigIcon,
  SessionIcon,
} from "../../../../Assets/Icons";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import "./Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  var userType = "";
  try {
    userType = jwtDecode(Cookies.get("userDetailsToken")).userType;
  } catch (error) {
    navigate("/login");
  }

  return (
    <div className="sidebar-container">
      <div className="sidebar-logo">
        <img src={Logo} alt="logo" />
        <p>
          {userType === "ADM"
            ? "Admin"
            : userType === "STU"
            ? "Student"
            : "Faculty"}
        </p>
      </div>

      <div className="sidebar-buttons">
        <button
          onClick={() => {
            navigate("/");
            setActiveTab(0);
          }}
        >
          <DashboardIcon filled={location.pathname === "/"} />
          <p>Dashboard</p>
        </button>

        {userType === "ADM" && (
          <button
            onClick={() => {
              navigate("/users");
            }}
          >
            <UsersInfoIcon filled={location.pathname === "/users"} />
            <p>User Info</p>
          </button>
        )}

        {userType === "ADM" && (
          <button
            onClick={() => {
              navigate("/configs");
            }}
          >
            <ConfigIcon filled={location.pathname === "/configs"} />
            <p>Configs</p>
          </button>
        )}

        {userType === "ADM" && (
          <button
            onClick={() => {
              navigate("/sessions");
            }}
          >
            <SessionIcon filled={location.pathname === "/sessions"} />
            <p>Sessions</p>
          </button>
        )}

        {userType === "STU" && (
          <button
            onClick={() => {
              navigate("/new-request");
            }}
          >
            <NewRequestIcon filled={location.pathname === "/new-request"} />
            <p>New Request</p>
          </button>
        )}

        {userType === "STU" && (
          <button
            onClick={() => {
              navigate("/history");
            }}
          >
            <HistoryIcon filled={location.pathname === "/history"} />
            <p>History</p>
          </button>
        )}

        {userType === "CA" && (
          <button
            onClick={() => {
              navigate("/approval");
            }}
          >
            <NewRequestIcon filled={location.pathname === "/approval"} />
            <p>Approvals</p>
          </button>
        )}

        {userType === "CA" && (
          <button
            onClick={() => {
              navigate("/approval-history");
            }}
          >
            <HistoryIcon filled={location.pathname === "/approval-history"} />
            <p>History</p>
          </button>
        )}

        <button
          onClick={() => {
            navigate("/settings");
          }}
        >
          <SettingsIcon filled={location.pathname === "/settings"} />
          <p>Settings</p>
        </button>
      </div>
    </div>
  );
}
