import React, {useEffect, useState} from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import SideBar from "../../Components/AdminPage/SideBar/SideBar";
import Dashboard from "../../Components/AdminPage/Dashboard/Dashboard";
import AddUser from "../../Components/AdminPage/AddUser/AddUser";
import UserInfo from "../../Components/AdminPage/UserInfo/UserInfo";
import Configurations from "../../Components/AdminPage/Configurations/Configurations";
import "./AdminPage.css";

export default function AdminPage() {
    const [activeMenu, setActiveMenu] = useState(1);
    const handleMenuChange = (value) => {
        setActiveMenu(value);
    }

    const navigate = useNavigate();
    useEffect(() => {
        if(Cookies.get("authToken")){
            const user = jwtDecode(Cookies.get("authToken")).usertype;
            if(user === "Admin"){
                navigate("/admin");
            } 
        } else {
            navigate("/");
        }
    },[Cookies.get("authToken")]);
    
    return (
        <>
        <div className = "adminpage-container">
            <SideBar handleMenuChange={handleMenuChange} activeMenu={activeMenu}/>
            <div className = "adminpage-menus-container">
                {activeMenu === 1 && <Dashboard/>}
                {activeMenu === 2 && <AddUser/>}
                {activeMenu === 3 && <UserInfo/>}
                {activeMenu === 4 && <Configurations/>}
            </div>
        </div>
        </>
    )
}