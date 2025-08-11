import React from "react";
import { Routes, Route } from "react-router-dom";
import LoadingWrapper from "../../Components/LoadingWrapper/LoadingWrapper";
import Sidebar from "./Components/Sidebar/Sidebar";
import Dashboard from "../Dashboard/Dashboard";
import AddUser from "../AddUser/AddUser";
import NewRequest from "../New Request/NewRequest";
import UsersInfo from "../UsersInfo/UserInfo";
import History from "../History/History";
import Settings from "../Settings/Settings";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import "./Home.css";

export default function Home() {
  var userType = "";

  try {
    userType = jwtDecode(Cookies.get("userDetailsToken")).userType;
  } catch (error) {
    navigate("/login");
  }

  return (
    <LoadingWrapper>
      <div className="home-container">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Dashboard />} />

          {userType === "Admin" && (
            <Route path="add-user" element={<AddUser />} />
          )}

          {userType === "Student" && (
            <Route path="requests" element={<NewRequest />} />
          )}

          {userType === "Admin" && (
            <Route path="users" element={<UsersInfo />} />
          )}

          {userType === "Student" && (
            <Route path="history" element={<History />} />
          )}

          <Route path="settings" element={<Settings />} />
        </Routes>
      </div>
    </LoadingWrapper>
  );
}
