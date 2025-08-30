import React, { useEffect } from "react";
import Logo from "../../../../assets/kec-logo.png";
import {
  DashboardIcon,
  NewRequestIcon,
  HistoryIcon,
  SettingsIcon,
  UsersInfoIcon,
  ConfigIcon,
  CalendarIcon,
} from "../../../../Assets/Icons";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import "./Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = React.useState(0);

  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath.includes("users")) {
      setActiveTab(1);
    } else if (currentPath.includes("configs")) {
      setActiveTab(2);
    } else if (currentPath.includes("calendar")) {
      setActiveTab(3);
    } else if (currentPath.includes("settings")) {
      setActiveTab(6);
    } else {
      setActiveTab(0);
    }
  }, []);

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
            : "Unknown"}
        </p>
      </div>

      <div className="sidebar-buttons">
        <button
          onClick={() => {
            navigate("/");
            setActiveTab(0);
          }}
        >
          <DashboardIcon filled={activeTab === 0} />
          <p>Dashboard</p>
        </button>

        {userType === "ADM" && (
          <button
            onClick={() => {
              navigate("/users");
              setActiveTab(1);
            }}
          >
            <UsersInfoIcon filled={activeTab === 1} />
            <p>User Info</p>
          </button>
        )}

        {userType === "ADM" && (
          <button
            onClick={() => {
              navigate("/configs");
              setActiveTab(2);
            }}
          >
            <ConfigIcon filled={activeTab === 2} />
            <p>Configs</p>
          </button>
        )}

        {userType === "ADM" && (
          <button
            onClick={() => {
              navigate("/calendar");
              setActiveTab(3);
            }}
          >
            <CalendarIcon filled={activeTab === 3} />
            <p>Calendar</p>
          </button>
        )}

        {userType === "STU" && (
          <button
            onClick={() => {
              navigate("/new-request");
              setActiveTab(4);
            }}
          >
            <NewRequestIcon filled={activeTab === 4} />
            <p>New Request</p>
          </button>
        )}

        {userType === "STU" && (
          <button
            onClick={() => {
              navigate("/history");
              setActiveTab(5);
            }}
          >
            <HistoryIcon filled={activeTab === 5} />
            <p>History</p>
          </button>
        )}

        <button
          onClick={() => {
            navigate("/settings");
            setActiveTab(6);
          }}
        >
          <SettingsIcon filled={activeTab === 6} />
          <p>Settings</p>
        </button>
      </div>
    </div>
  );
}
