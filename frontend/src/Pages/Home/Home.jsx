import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import LoadingWrapper from "../../Components/LoadingWrapper/LoadingWrapper";
import Header from "./Components/Header/Header";
import Sidebar from "./Components/Sidebar/Sidebar";
import Dashboard from "../Dashboard/Dashboard";
import Profile from "../Profile/Profile";
import Users from "../Users/Users";
import GenericCodes from "../GenericCodes/GenericCodes";
import Sessions from "../Sessions/Sessions";
import NewRequest from "../Requests/NewRequest";
import RequestsHistory from "../Requests/RequestsHistory";
import Approval from "../Approval/Approval";
import ApprovalsHistory from "../Approval/ApprovalsHistory";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import "./Home.css";

export default function Home() {
  document.title = "KEC Presence";
  const navigate = useNavigate();

  // State variables for data handling
  const [token, setToken] = useState("");
  const [userType, setUserType] = useState("");

  // useEffect to check authentication token and fetch user data
  useEffect(() => {
    const tokenValue = Cookies.get("token");
    const decodedToken = tokenValue ? jwtDecode(tokenValue) : null;
    if (decodedToken && decodedToken.userType) {
      setUserType(decodedToken.userType);
    }
    if (!tokenValue) {
      navigate("/login");
      return;
    }
    setToken(tokenValue);
  }, [navigate]);
  return (
    <LoadingWrapper>
      <div className="home-container">
        <Sidebar />
        <div className="home-pages-container">
          <Header />
          <Routes>
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />

            {userType === "ADMIN" && <Route path="users" element={<Users />} />}
            {userType === "ADMIN" && (
              <Route path="generic-codes" element={<GenericCodes />} />
            )}
            {userType === "ADMIN" && (
              <Route path="sessions" element={<Sessions />} />
            )}

            {userType === "STU" && (
              <Route path="new-request" element={<NewRequest />} />
            )}
            {userType === "STU" && (
              <Route path="history" element={<RequestsHistory />} />
            )}

            {userType === "CA" && (
              <Route path="approval" element={<Approval />} />
            )}
            {userType === "CA" && (
              <Route path="approval-history" element={<ApprovalsHistory />} />
            )}
          </Routes>
        </div>
      </div>
    </LoadingWrapper>
  );
}
