import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../Utils/Constants";
import { Loaders } from "../../Components/Loaders/Loaders";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import CountCards from "./Components/CountCards/CountCards";
import BarGraph from "./Components/BarGraph/BarGraph";
import LineGraph from "./Components/LineGraph/LineGraph";
import { dashboardCountFormatter } from "../../Utils/Formatters";
import SessionsTable from "./Components/SessionsTable/SessionsTable";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  // State variables for data handling
  const [token, setToken] = useState("");
  const [name, setName] = useState("");
  const [userType, setUserType] = useState("");
  const [dashboardData, setDashboardData] = useState(null);

  // State variable for loading state
  const [loading, setLoading] = useState(false);

  // useEffect to check authentication token and fetch user data
  useEffect(() => {
    const tokenValue = Cookies.get("token");
    if (!tokenValue) {
      navigate("/login");
      return;
    }
    setToken(tokenValue);
  }, [navigate]);

  // useEffect to decode token and set user information
  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      setName(decodedToken.name);
      setUserType(decodedToken.userType);
    }
  }, [token]);

  // useEffect to fetch dashboard data when token and userType are set
  useEffect(() => {
    if (token && userType) {
      getDashboardData();
    }
  }, [token, userType]);

  // Function to fetch dashboard data
  const getDashboardData = async () => {
    const userTypeDef = {
      ADMIN: "admin",
      STUDENT: "student",
    };
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/dashboard/${userTypeDef[userType]}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setDashboardData(response.data.data);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <p className="page-header">Welcome {name}🎉</p>

      {loading && <Loaders />}

      {!loading && (
        <div className="dashboard-content-container">
          <div className="dashboard-count-cards-container">
            {dashboardData && (
              <CountCards
                dashboardCountData={dashboardCountFormatter(
                  dashboardData.countsData,
                  "USERS",
                )}
              />
            )}
          </div>

          {userType === "ADMIN" && (
            <>
              <div className="dashboard-bar-graph-container">
                <BarGraph />
                <LineGraph />
              </div>
              {dashboardData && (
                <SessionsTable sessionsData={dashboardData.sessionData} />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
