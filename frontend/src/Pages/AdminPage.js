import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "../Components/AdminDashboard";
import AdminAdduser from "../Components/AdminAdduser";
import AdminEdituser from "../Components/AdminEdituser";
import AdminDeleteuser from "../Components/AdminDeleteuser";
import AdminUseractivity from "../Components/AdminUseractivity";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import "../Styles/AdvoicerPage.css";

export default function Admin() {
    const [activeTab, setactiveTab] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    const handleTabClick = (id) => {
      setactiveTab(id);
    };
    
    const handleLogout = async () => {
      Cookies.remove('data');
      window.location.reload(false);
    }
    
    setTimeout(() => {
      setIsLoading(false);},2000);
      
      useEffect(() => {
        if(Cookies.get('data') === undefined){
          navigate("/");
        }

        else{
          const jwt_data = jwtDecode(Cookies.get('data'));
          
          if(jwt_data.usertype === "Advoicer"){
            navigate("/advoicer");
          }
          else if(jwt_data.usertype === "Student"){
            navigate("/student");
          }
          else if(jwt_data.usertype === "Admin"){
            navigate("/admin");
          }
        }
    },[navigate]);
    
    return (
      <>
      {isLoading ? (<div className = "loading-container"><p>Loading...</p></div>) : (
      
      <div className = "adminpage-container">
          <ul  className = "sidebar-container">
            <div className = "sidebar-container-logo">
              <img src={require("F:/Projects/kecpresence/frontend/src/Sources/KEC.png")} alt = "logo1"></img>
              <p>Admin</p>
            </div>
            <button className={activeTab === 1 ? 'active' : ''} onClick={() => handleTabClick(1)}><div><img src={require("F:/Projects/kecpresence/frontend/src/Sources/dashboard.png")} alt = "icon"></img><p>Dashboard</p></div></button>
            <button className={activeTab === 2 ? 'active' : ''} onClick={() => handleTabClick(2)}><div><img src={require("F:/Projects/kecpresence/frontend/src/Sources/add.png")} alt = "icon"></img><p>Add User</p></div></button>
            <button className={activeTab === 3 ? 'active' : ''} onClick={() => handleTabClick(3)}><div><img src={require("F:/Projects/kecpresence/frontend/src/Sources/edit.png")} alt = "icon"></img><p>Edit User</p></div></button>
            <button className={activeTab === 4 ? 'active' : ''} onClick={() => handleTabClick(4)}><div><img src={require("F:/Projects/kecpresence/frontend/src/Sources/delete.png")} alt = "icon"></img><p>Delete User</p></div></button>
            <button className={activeTab === 5 ? 'active' : ''} onClick={() => handleTabClick(5)}><div><img src={require("F:/Projects/kecpresence/frontend/src/Sources/user-activity.png")} alt = "icon"></img><p>User Activity</p></div></button>
            
            <Popup trigger=
                {<button><div><img src={require("F:/Projects/kecpresence/frontend/src/Sources/setting.png")} alt = "icon"></img><p>Settings</p></div></button>} position="right">
                  <button className = "profile-button">Change Password</button>
                  <button className = "logout-button" onClick={handleLogout}>Logout</button>
            </Popup>
          </ul>

        <div className = "adminpage-right-container">
          {activeTab === 1 && <AdminDashboard />}
          {activeTab === 2 && <AdminAdduser />}
          {activeTab === 3 && <AdminEdituser />}
          {activeTab === 4 && <AdminDeleteuser />}
          {activeTab === 5 && <AdminUseractivity />}
        </div>
    </div>)}
      </>
  )
}
