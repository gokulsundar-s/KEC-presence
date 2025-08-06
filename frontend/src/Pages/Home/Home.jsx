import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./Components/Sidebar/Sidebar";
import Dashboard from "../Dashboard/Dashboard";
import NewRequest from "../New Request/NewRequest";
import History from "../History/History";
import Settings from "../Settings/Settings";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-container">
      <Sidebar />
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="new-request" element={<NewRequest />} />
        <Route path="history" element={<History />} />
        <Route path="settings" element={<Settings />} />
      </Routes>
    </div>
  );
}
