import { Routes, Route, useNavigate } from "react-router-dom";
import LoadingWrapper from "../../Components/LoadingWrapper/LoadingWrapper";
import Sidebar from "./Components/Sidebar/Sidebar";
import Dashboard from "../Dashboard/Dashboard";
import NewRequest from "../New Request/NewRequest";
import Users from "../Users/Users";
import History from "../History/History";
import Configs from "../Configs/Configs";
import Calendar from "../Calendar/Calendar";
import Settings from "../Settings/Settings";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
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

          {userType === "ADM" && <Route path="users" element={<Users />} />}
          {userType === "ADM" && <Route path="configs" element={<Configs />} />}
          {userType === "ADM" && (
            <Route path="calendar" element={<Calendar />} />
          )}

          {userType === "STU" && (
            <Route path="new-request" element={<NewRequest />} />
          )}
          {userType === "STU" && <Route path="history" element={<History />} />}

          <Route path="settings" element={<Settings />} />
        </Routes>
      </div>
    </LoadingWrapper>
  );
}
