import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../Utils/Constants";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Loaders from "../../Components/Loaders/Loaders";
import "./Dashboard.css";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  let name = "";
  let userType = "";

  try {
    const userDetailsToken = Cookies.get("userDetailsToken");
    if (!userDetailsToken) {
      navigate("/login");
    } else {
      name = jwtDecode(userDetailsToken).name;
      userType = jwtDecode(userDetailsToken).userType;
    }
  } catch (error) {
    navigate("/login");
  }

  useEffect(() => {
    const getDashboardData = async () => {
      if (userType === "ADM") {
        setLoading(true);
        try {
          const response = await axios.get(`${baseUrl}/dashboard/admin`);
          setDashboardData(response.data);
        } catch (err) {
          console.error("Failed to fetch dashboard data:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    getDashboardData();
  }, [userType]);

  return (
    <div className="page-container">
      <p className="page-header">Welcome {name}🎉</p>

      {loading && <Loaders />}

      {!loading && userType === "ADM" && dashboardData && (
        <>
          <div className="dashboard-counts">
            {dashboardData.data.usersCount.map((item, index) => (
              <div key={index} className="dashboard-counts-box blue-box">
                <p className="blue-count">{item.count}</p>
                <p className="blue-label">{item.type}</p>
              </div>
            ))}
          </div>

          <div className="dashboard-sessions-container">
            <div className="dashboard-table">
              <table>
                <thead>
                  <tr>
                    <th>Active User Type</th>
                    <th>Count</th>
                  </tr>
                </thead>

                {dashboardData.data.usersCount.map((item, index) => (
                  <tbody key={index}>
                    <tr>
                      <td>{item.type}</td>
                      <td>{item.count}</td>
                    </tr>
                  </tbody>
                ))}
              </table>
            </div>

            <div className="dashboard-table">
              <table>
                <thead>
                  <tr>
                    <th>Active Device Type</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.data.sessionsCount.map((item, index) => (
                    <tr key={index}>
                      <td>{item.type}</td>
                      <td>{item.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
