import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import "./Dashboard.css";

export default function Dashboard() {
    const [username, setUserName] = useState("");

    useEffect(() => {
        setUserName(jwtDecode(Cookies.get("authToken")).name);
    },[]);

    return(
        <>
        <div className = "advisor-dashboard-container">
            <p className = "advisor-dashboard-welcome">Welcome {username}🎉</p>
        </div>
        </>
    )
}