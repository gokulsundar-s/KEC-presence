import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import AdvoicerDashboard from "../Components/AdvoicerDashboard";
import AdvoicerRequest from "../Components/AdvoicerRequests";
import AdvoicerHistory from "../Components/AdvoicerHistory";

import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

export default function ClassAdvisor() {
  const [activeTab, setactiveTab] = useState(2);

  const handleTabClick = (id) => {
    setactiveTab(id);
  };

  const handleLogout = async () => {
    Cookies.remove("data");
    navigate("/");
  };
  
  const navigate = useNavigate();

  useEffect(() => {
    if(Cookies.get("data") === undefined){
      navigate("/");
    }
  }, []);

  return (
    <div className="advisorpage-container">
      <ul className="sidebar-container">
        <div className="sidebar-container-logo">
          <img src={require("..//Sources/KEC.png")} alt="logo1"></img>
          <p>Advisor</p>
        </div>

        {/* <button
          className={activeTab === 1 ? "active" : ""}
          onClick={() => handleTabClick(1)}
        >
          <div>
            <img src={require("..//Sources/dashboard.png")} alt="icon"></img>
            <p>Dashboard</p>
          </div>
        </button> */}
        <button
          className={activeTab === 2 ? "active" : ""}
          onClick={() => handleTabClick(2)}
        >
          <div>
            <img src={require("..//Sources/add.png")} alt="icon"></img>
            <p>Requests</p>
          </div>
        </button>
        <button
          className={activeTab === 3 ? "active" : ""}
          onClick={() => handleTabClick(3)}
        >
          <div>
            <img src={require("..//Sources/history.png")} alt="icon"></img>
            <p>History</p>
          </div>
        </button>

        <Popup
          trigger={
            <button>
              <div>
                <img src={require("..//Sources/setting.png")} alt="icon"></img>
                <p>Settings</p>
              </div>
            </button>
          }
          position="right"
        >
          {/* <button className="profile-button">Change Password</button> */}
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </Popup>
      </ul>

      <div className="advisorpage-right-container">
        {/* {activeTab === 1 && <AdvoicerDashboard />} */}
        {activeTab === 2 && <AdvoicerRequest />}
        {activeTab === 3 && <AdvoicerHistory />}
      </div>
    </div>
  );
}
