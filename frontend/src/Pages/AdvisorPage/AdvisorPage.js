import React, {useEffect, useState} from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import SideBar from "../../Components/AdvisorPage/SideBar/SideBar";
import Dashboard from "../../Components/AdvisorPage/Dashboard/Dashboard";
import Requests from "../../Components/AdvisorPage/Requests/Requests";
import History from "../../Components/AdvisorPage/History/History";
import AddEntry from "../../Components/AdvisorPage/AddEntry/AddEntry";
import "./AdvisorPage.css";

export default function AdvisorPage() {
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
            } else if(user === "CA"){
                navigate("/advisor");
            }
        } else {
            navigate("/");
        }
    },[Cookies.get("authToken")]);
    
    return (
        <>
        <div className = "advisorpage-container">
            <SideBar handleMenuChange={handleMenuChange} activeMenu={activeMenu}/>
            <div className = "advisorpage-menus-container">
                {activeMenu === 1 && <Dashboard/>}
                {activeMenu === 2 && <Requests/>}
                {activeMenu === 3 && <History/>}
                {activeMenu === 4 && <AddEntry/>}
            </div>
        </div>
        </>
    )
}