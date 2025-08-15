import React from "react";
import Logo from "../../../../assets/kec-logo.png";
import {
  DashboardIcon,
  NewRequestIcon,
  HistoryIcon,
  SettingsIcon,
  AddUserIcon,
  UsersInfoIcon,
  ConfigIcon
} from "../../../../Assets/Icons";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import "./Sidebar.css";
import { use } from "react";

export default function Sidebar() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState(0);

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
              navigate("/add-user");
              setActiveTab(1);
            }}
          >
            <AddUserIcon filled={activeTab === 1} />
            <p>Add User</p>
          </button>
        )}

        {userType === "ADM" && (
          <button
            onClick={() => {
              navigate("/users");
              setActiveTab(2);
            }}
          >
            <UsersInfoIcon filled={activeTab === 2} />
            <p>User Info</p>
          </button>
        )}
        
        {userType === "ADM" && (
          <button
            onClick={() => {
              navigate("/users");
              setActiveTab(3);
            }}
          >
            <ConfigIcon filled={activeTab === 3} />
            <p>Configs</p>
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
