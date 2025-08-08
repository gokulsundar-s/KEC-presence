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
import "./Home.css";

export default function Home() {
  return (
    <LoadingWrapper>
      <div className="home-container">
        <Sidebar />
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="add-user" element={<AddUser />} />
          <Route path="requests" element={<NewRequest />} />
          <Route path="users" element={<UsersInfo />} />
          <Route path="history" element={<History />} />
          <Route path="settings" element={<Settings />} />
        </Routes>
      </div>
    </LoadingWrapper>
  );
}
