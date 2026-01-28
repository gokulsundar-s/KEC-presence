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
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { getGenericCodesData } from "../../Utils/GenericCodeServices";
import "./Home.css";

export default function Home() {
  document.title = "KEC Presence";
  const navigate = useNavigate();

  // State variables for data handling
  const [userType, setUserType] = useState("");
  const [loading, setLoading] = useState(false);

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
  }, [navigate]);

  // useEffect to fetch generic codes data on component mount
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      getGenericCodesData(token, setLoading);
    }
  }, []);

  return (
    <LoadingWrapper loading={loading}>
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
            {userType === "STUDENT" && (
              <Route path="requests" element={<NewRequest />} />
            )}
          </Routes>
        </div>
      </div>
    </LoadingWrapper>
  );
}
