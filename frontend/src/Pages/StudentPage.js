import { React, useState } from "react";
import StudentDashboard from "../Components/StudentDashboard";
import StudentRequest from "../Components/StudentRequest";
import StudentHistory from "../Components/StudentHistory";

import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

export default function StudentPage() {
    const [activeTab, setactiveTab] = useState(1);

    const handleTabClick = (id) => {
      setactiveTab(id);
    };

    return (
      <div className = "student-container">
        <ul className = "sidebar-container">
          <div className = "sidebar-container-logo">
            <img src={require("F:/Projects/kecpresence/frontend/src/Sources/KEC.png")} alt = "logo1"></img>
            <p>Student</p>
          </div>
          
          <button className={activeTab === 1 ? 'active' : ''} onClick={() => handleTabClick(1)}><div><img src={require("F:/Projects/kecpresence/frontend/src/Sources/dashboard.png")} alt = "icon"></img><p>Dashboard</p></div></button>
          <button className={activeTab === 2 ? 'active' : ''} onClick={() => handleTabClick(2)}><div><img src={require("F:/Projects/kecpresence/frontend/src/Sources/user.png")} alt = "icon"></img><p>Add request</p></div></button>
          <button className={activeTab === 3 ? 'active' : ''} onClick={() => handleTabClick(3)}><div><img src={require("F:/Projects/kecpresence/frontend/src/Sources/history.png")} alt = "icon"></img><p>History</p></div></button>
          
          <Popup trigger=
                {<button><div><img src={require("F:/Projects/kecpresence/frontend/src/Sources/setting.png")} alt = "icon"></img><p>Settings</p></div></button>} position="right">
                  <button className = "profile-button">Change Password</button>
                  <button className = "logout-button">Logout</button>
            </Popup>
        </ul>

        <div className = "student-right">
          {activeTab === 1 && <StudentDashboard/>}
          {activeTab === 2 && <StudentRequest/>}
          {activeTab === 3 && <StudentHistory/>}
        </div>
      </div>
  )
}