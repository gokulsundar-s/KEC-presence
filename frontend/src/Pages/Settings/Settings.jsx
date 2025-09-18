import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import AdminSettings from "./Components/AdminSettings/AdminSettings";

export default function Settings() {
  const navigate = useNavigate();

  let userType = "";
  try {
    const userDetailsToken = Cookies.get("userDetailsToken");
    if (!userDetailsToken) {
      navigate("/login");
    } else {
      const decodedToken = jwtDecode(userDetailsToken);
      userType = decodedToken.userType;
    }
  } catch (error) {
    navigate("/login");
  }

  return (
    <div className="page-container">
      <p className="page-header">User Settings</p>

      {userType === "ADM" && <AdminSettings />}
    </div>
  );
}
