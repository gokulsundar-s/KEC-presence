import { Routes, Route, useNavigate } from "react-router-dom";
import LoadingWrapper from "../../Components/LoadingWrapper/LoadingWrapper";
import Sidebar from "./Components/Sidebar/Sidebar";
import Dashboard from "../Dashboard/Dashboard";
import AddUser from "../AddUser/AddUser";
import NewRequest from "../New Request/NewRequest";
import UsersInfo from "../UsersInfo/UserInfo";
import History from "../History/History";
import Configs from "../Configs/Configs";
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

          {userType === "ADM" && (
            <Route path="add-user" element={<AddUser />} />
          )}
          {userType === "ADM" && <Route path="users" element={<UsersInfo />} />}
          {userType === "ADM" && <Route path="configs" element={<Configs />} />}

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
