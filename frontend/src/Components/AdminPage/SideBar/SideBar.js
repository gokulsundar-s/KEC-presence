import React, { useState } from "react";
import Popup from 'reactjs-popup';
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import LogoutPopup from "../../LogoutPopup/LogoutPopup";
import ChangePasswordPopup from "../../ChangePasswordPopup/ChangePasswordPopup";
import 'reactjs-popup/dist/index.css';
import "./SideBar.css";

export default function SideBar({handleMenuChange, activeMenu}) {   
    const [logoutPopup, setLogoutPopup] = useState(false);
    const [changePasswordPopup, setChangePasswordPopup] = useState(false);

    const handleLogoutPopup = () => setLogoutPopup(true);
    const handleChangePasswordPopup = (value) => setChangePasswordPopup(value);
    
    const navigate = useNavigate();
    const handleLogoutUser = (value) => {
        if(!value) {
            setLogoutPopup(false);
        } else {
            Cookies.remove("authToken");
            navigate("/");
        }
    }

    return (
        <>
        <div className = "admin-sidebar-container">
            <div className = "admin-sidebar-logo-container">
                <img src={require("../../../Sources/kec-logo.png")} alt="logo1"></img>
            </div>
            <p className = "admin-sidebar-user">Admin</p>
            <div className = "admin-sidebar-buttons-container">
                <button className={activeMenu === 1 ? 'active' : ''} onClick={() => handleMenuChange(1)}>
                    <img src={require("../../../Sources/dashboard.png")} alt="logo1"></img>
                    <p>Dashboard</p>
                </button>
                <button className={activeMenu === 2 ? 'active' : ''} onClick={() => handleMenuChange(2)}>
                    <img src={require("../../../Sources/add-user.png")} alt="logo1"></img>
                    <p>Add User</p>
                </button>
                <button className={activeMenu === 3 ? 'active' : ''} onClick={() => handleMenuChange(3)}>
                    <img src={require("../../../Sources/user-info.png")} alt="logo1"></img>
                    <p>Users Info</p>
                </button>
                <button className={activeMenu === 4 ? 'active' : ''} onClick={() => handleMenuChange(4)}>
                    <img src={require("../../../Sources/configuration.png")} alt="logo1"></img>
                    <p>Configurations</p>
                </button>
                
                <Popup trigger=
                    {<button><img src={require("../../../Sources/setting.png")} alt="logo1"></img><p>Settings</p></button>} position="right">
                    <div className = "admin-sidebar-popup-button-container">
                        <button onClick={() => handleChangePasswordPopup(true)}><img src={require("../../../Sources/change-password.png")} alt="logo1"></img><p>Change Password</p></button>
                    </div>  
                    <div className = "admin-sidebar-popup-button-container admin-sidebar-popup-button-container-logout">
                        <button onClick={handleLogoutPopup}><img src={require("../../../Sources/logout.png")} alt="logo1"></img><p>Logout</p></button>
                    </div>  
                </Popup>
            </div>
        </div>

        {logoutPopup && <LogoutPopup handleLogoutUser={handleLogoutUser}/>}
        {changePasswordPopup && <ChangePasswordPopup handleChangePasswordPopup={handleChangePasswordPopup}/>}
        </>
    )
}
