import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../Utils/Constants";
import { showErrorToast } from "../../Components/Alerts/Alert";
import NoData from "../../Components/NoData/NoData";
import { Loaders } from "../../Components/Loaders/Loaders";
import { formatDateTime } from "../../Utils/Formatters";
import "./Sessions.css";

export default function Sessions() {
  const [sessionData, setSessionData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getSessionData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/session`);
      if (response.data.status === 200) {
        setSessionData(response.data.data);
      } else {
        showErrorToast(response.data.message);
      }
      setLoading(false);
    } catch {
      showErrorToast("An error occurred. Please contact administrator.");
      setLoading(false);
    }
  };

  useEffect(() => {
    getSessionData();
  }, []);

  return (
    <div className="page-container">
      <p className="page-header">User Sessions</p>

      <div className="view-info-container">
        <div className="view-info-inputs-container">
          <div className="view-info-input">
            <p>Device</p>
            <select>
              <option value="all">All</option>
              <option value="MAC">Mac</option>
              <option value="MOBILE">Mobile</option>
              <option value="WINDOWS">Windows</option>
            </select>
          </div>

          <div className="view-info-input">
            <p>Status</p>
            <select>
              <option value="all">All</option>
              <option value="ACTIVE">Active</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </div>

          <div className="view-info-input">
            <p>Search</p>
            <input type="text" placeholder="Search" />
          </div>
        </div>
      </div>

      <div className="view-info-table-container">
        {loading ? (
          <Loaders />
        ) : sessionData.length === 0 ? (
          <NoData />
        ) : (
          <table className="view-info-table">
            <thead>
              <tr>
                <td>User ID</td>
                <td>Device</td>
                <td>Browser</td>
                <td>IP Address</td>
                <td>Login Time</td>
                <td>Logout Time</td>
                <td>Status</td>
              </tr>
            </thead>
            <tbody>
              {sessionData.map((session) => (
                <tr key={session.code}>
                  <td>{session.userID}</td>
                  <td>{session.device}</td>
                  <td>{session.browser}</td>
                  <td>{session.ipAddress}</td>
                  <td>{formatDateTime(session.loginTime)}</td>
                  <td>{formatDateTime(session.logoutTime) ?? "-"}</td>
                  <td>
                    <div className="status-dot-container">
                      <span
                        className={`status-dot ${
                          session.isActive ? "active" : "inactive"
                        }`}
                      ></span>
                      {session.isActive ? "Active" : "Expired"}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
