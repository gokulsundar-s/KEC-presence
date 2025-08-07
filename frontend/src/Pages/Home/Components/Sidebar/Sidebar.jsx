import React from "react";
import Logo from "../../../../assets/kec-logo.png";
import {
  DashboardIcon,
  NewRequestIcon,
  HistoryIcon,
  SettingsIcon,
} from "../../../../Assets/Icons";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState(0);

  return (
    <div className="sidebar-container">
      <div className="sidebar-logo">
        <img src={Logo} alt="logo" />
        <p>Student</p>
      </div>

      <div className="sidebar-buttons">
        <button
          onClick={() => {
            navigate("/dashboard");
            setActiveTab(0);
          }}
        >
          <DashboardIcon filled={activeTab === 0} />
          <p>Dashboard</p>
        </button>
        <button
          onClick={() => {
            navigate("/new-request");
            setActiveTab(1);
          }}
        >
          <NewRequestIcon filled={activeTab === 1} />
          <p>New Request</p>
        </button>
        <button
          onClick={() => {
            navigate("/history");
            setActiveTab(2);
          }}
        >
          <HistoryIcon filled={activeTab === 2} />
          <p>History</p>
        </button>
        <button
          onClick={() => {
            navigate("/settings");
            setActiveTab(3);
          }}
        >
          <SettingsIcon filled={activeTab === 3} />
          <p>Settings</p>
        </button>
      </div>
    </div>
  );
}
