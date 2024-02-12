import { React, useState } from "react";
import YearInchargeRequest from "../Components/YearInchargeRequestes";
import YearInchargeHistory from "../Components/YearInchargeHistory";

export default function YearIncharge() {
    const [activeTab, setactiveTab] = useState(1);

    const handleTabClick = (id) => {
      setactiveTab(id);
    };
    
    return (
      <div className = "yearinchargepage-container">
          <ul  className = "sidebar-container">
            <div className = "sidebar-container-logo">
              <img src={require("F:/Projects/kecpresence/frontend/src/Sources/KEC.png")} alt = "logo1"></img>
              <p>Year Incharge</p>
            </div>

            <button className={activeTab === 1 ? 'active' : ''} onClick={() => handleTabClick(1)}><div><img src={require("F:/Projects/kecpresence/frontend/src/Sources/dashboard.png")} alt = "icon"></img><p>Dashboard</p></div></button>
            <button className={activeTab === 2 ? 'active' : ''} onClick={() => handleTabClick(2)}><div><img src={require("F:/Projects/kecpresence/frontend/src/Sources/add.png")} alt = "icon"></img><p>Requests</p></div></button>
            <button className={activeTab === 3 ? 'active' : ''} onClick={() => handleTabClick(3)}><div><img src={require("F:/Projects/kecpresence/frontend/src/Sources/history.png")} alt = "icon"></img><p>History</p></div></button>
            <button><div><img src={require("F:/Projects/kecpresence/frontend/src/Sources/setting.png")} alt = "icon"></img><p>Settings</p></div></button>
          </ul>

        <div className = "yearinchargepage-right-container">
          {activeTab === 1}
          {activeTab === 2 && <YearInchargeRequest/>}
          {activeTab === 3 && <YearInchargeHistory/>}
        </div>

    </div>
  )
}