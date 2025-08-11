import React from "react";
import Logo from "../../../../assets/kec-logo.png";
import {
  DashboardIcon,
  NewRequestIcon,
  HistoryIcon,
  SettingsIcon,
  AddUserIcon,
  UsersInfoIcon,
} from "../../../../Assets/Icons";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import "./Sidebar.css";

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
        <p>Student</p>
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

        {userType === "Admin" && (
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
        {userType === "Admin" && (
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

        {userType === "Student" && (
          <button
            onClick={() => {
              navigate("/requests");
              setActiveTab(3);
            }}
          >
            <NewRequestIcon filled={activeTab === 3} />
            <p>New Request</p>
          </button>
        )}

        <button
          onClick={() => {
            navigate("/history");
            setActiveTab(4);
          }}
        >
          <HistoryIcon filled={activeTab === 4} />
          <p>History</p>
        </button>

        <button
          onClick={() => {
            navigate("/settings");
            setActiveTab(5);
          }}
        >
          <SettingsIcon filled={activeTab === 5} />
          <p>Settings</p>
        </button>
      </div>
    </div>
  );
}
