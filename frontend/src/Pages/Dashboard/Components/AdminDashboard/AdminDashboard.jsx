import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { baseUrl } from "../../../../Utils/Constants";
import { Loaders } from "../../../../Components/Loaders/Loaders";
import {
  TableLaptopIcon,
  TableMobileIcon,
  TableUserIcon,
} from "../../../../Assets/Icons";
import { formatDateTime } from "../../.././../Utils/Formatters";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // State variables for data handling
  const [token, setToken] = useState("");
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

  // Function to fetch dashboard data
  const getDashboardData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/dashboard/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDashboardData(response.data);
      setLoading(false);
    } catch {
      console.error("Failed to fetch dashboard data");
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <>
      {loading && <Loaders />}

      {!loading && dashboardData && (
        <>
          <div className="admin-dashboard-counts">
            {dashboardData.data.usersCount.map((item, index) => (
              <div key={index} className="admin-dashboard-counts-box blue-box">
                <p className="blue-count">{item.count}</p>
                <p className="blue-label">{item.type}</p>
              </div>
            ))}
          </div>

          <div className="admin-dashboard-sessions-container">
            <div className="admin-dashboard-table">
              <table>
                <thead>
                  <tr>
                    <th>User Type</th>
                    <th>Total Count</th>
                  </tr>
                </thead>

                {dashboardData.data.usersCount.map((item, index) => (
                  <tbody key={index}>
                    <tr>
                      <td className="admin-dashboard-table-types">
                        {<TableUserIcon />}
                        {item.type}
                      </td>
                      <td>{item.count}</td>
                    </tr>
                  </tbody>
                ))}
              </table>
            </div>

            <div className="admin-dashboard-table">
              <table>
                <thead>
                  <tr>
                    <th>Active Device Type</th>
                    <th>Total Count</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.data.sessionsCount.map((item, index) => (
                    <tr key={index}>
                      <td className="admin-dashboard-table-types">
                        {item.type === "Windows" || item.type === "Mac" ? (
                          <TableLaptopIcon />
                        ) : (
                          <TableMobileIcon />
                        )}
                        {item.type}
                      </td>
                      <td>{item.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="admin-dashboard-table">
            <table>
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Device Type</th>
                  <th>IP Address</th>
                  <th>Login Time</th>
                </tr>
              </thead>

              <tbody>
                {dashboardData.data.sessionsData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.userID}</td>
                    <td className="admin-dashboard-table-types">
                      {item.device === "Windows" || item.device === "Mac" ? (
                        <TableLaptopIcon />
                      ) : (
                        <TableMobileIcon />
                      )}
                      {item.device}
                    </td>
                    <td>{item.ipAddress}</td>
                    <td>{formatDateTime(item.loginTime)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
