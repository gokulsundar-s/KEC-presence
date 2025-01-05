import React, {useEffect, useState} from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import SideBar from "../../Components/StudentPage/SideBar/SideBar";
import Dashboard from "../../Components/StudentPage/Dashboard/Dashboard";
import AddRequest from "../../Components/StudentPage/AddRequest/AddRequest";
import RequestHistory from "../../Components/StudentPage/RequestHistory/RequestHistory";
import Report from "../../Components/StudentPage/Report/Report";
import "./StudentPage.css";

export default function StudentPage() {
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
            } else if(user === "STU"){
                navigate("/student");
            }
        } else {
            navigate("/");
        }
    },[Cookies.get("authToken")]);
    
    return (
        <>
        <div className = "studentpage-container">
            <SideBar handleMenuChange={handleMenuChange} activeMenu={activeMenu}/>
            <div className = "studentpage-menus-container">
                {activeMenu === 1 && <Dashboard/>}
                {activeMenu === 2 && <AddRequest/>}
                {activeMenu === 3 && <RequestHistory/>}
                {activeMenu === 4 && <Report/>}
            </div>
        </div>
        </>
    )
}