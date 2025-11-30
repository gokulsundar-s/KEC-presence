import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import LoadingWrapper from "../../Components/LoadingWrapper/LoadingWrapper";
import Header from "./Components/Header/Header";
import Sidebar from "./Components/Sidebar/Sidebar";
import Dashboard from "../Dashboard/Dashboard";
import Settings from "../Settings/Settings";
import Users from "../Users/Users";
import Configs from "../Configs/Configs";
import Sessions from "../Sessions/Sessions";
import NewRequest from "../Requests/NewRequest";
import RequestsHistory from "../Requests/RequestsHistory";
import Approval from "../Approval/Approval";
import ApprovalsHistory from "../Approval/ApprovalsHistory";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  var userType = "";

  try {
    userType = jwtDecode(Cookies.get("token")).userType;
  } catch (error) {
    navigate("/login");
  }

  return (
    <LoadingWrapper>
      <div className="home-container">
        <Sidebar />
        <div className="home-pages-container">
          <Header />
          <Routes>
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="settings" element={<Settings />} />

            {userType === "ADMIN" && <Route path="users" element={<Users />} />}
            {userType === "ADMIN" && (
              <Route path="configs" element={<Configs />} />
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
