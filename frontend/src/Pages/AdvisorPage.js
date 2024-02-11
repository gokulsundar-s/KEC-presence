import { React, useState } from "react";
import AdvoicerDashboard from "../Components/AdvoicerDashboard"
import AdvoicerRequest from "../Components/AdvoicerRequests"
import AdvoicerHistory from "../Components/AdvoicerHistory"

export default function ClassAdvisor() {
    const [activeTab, setactiveTab] = useState(1);

    const handleTabClick = (id) => {
      setactiveTab(id);
    };
    
    return (
      <div className = "advisorpage-container">
          <ul  className = "sidebar-container">
            <div className = "sidebar-container-logo">
              <img src={require("F:/Projects/kecpresence/frontend/src/Sources/KEC.png")} alt = "logo1"></img>
              <p>Advisor</p>
            </div>

            <button className={activeTab === 1 ? 'active' : ''} onClick={() => handleTabClick(1)}><div><img src={require("F:/Projects/kecpresence/frontend/src/Sources/dashboard.png")} alt = "icon"></img><p>Dashboard</p></div></button>
            <button className={activeTab === 2 ? 'active' : ''} onClick={() => handleTabClick(2)}><div><img src={require("F:/Projects/kecpresence/frontend/src/Sources/add.png")} alt = "icon"></img><p>Requests</p></div></button>
            <button className={activeTab === 3 ? 'active' : ''} onClick={() => handleTabClick(3)}><div><img src={require("F:/Projects/kecpresence/frontend/src/Sources/history.png")} alt = "icon"></img><p>History</p></div></button>
            <button><div><img src={require("F:/Projects/kecpresence/frontend/src/Sources/setting.png")} alt = "icon"></img><p>Settings</p></div></button>
          </ul>

        <div className = "advisorpage-right-container">
          {activeTab === 1 && <AdvoicerDashboard/>}
          {activeTab === 2 && <AdvoicerRequest/>}
          {activeTab === 3 && <AdvoicerHistory/>}
        </div>

    </div>
  )
}