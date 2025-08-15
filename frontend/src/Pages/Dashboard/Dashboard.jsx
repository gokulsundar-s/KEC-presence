import React from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import "./Dashboard.css";

export default function Dashboard() {
  var name = "";

  try {
    name = jwtDecode(Cookies.get("userDetailsToken")).name;
  } catch (error) {
    navigate("/login");
  }
  return (
    <div className="page-container">
      <p className="page-header">Welcome {name}🎉</p>

      <div className="dashboard-counts">
        <div className="dashboard-counts-box gray-box">
          <p className="gray-count">200</p>
          <p className="gray-label">Working Days</p>
        </div>
        <div className="dashboard-counts-box green-box">
          <p className="green-count">180</p>
          <p className="green-label">Days Present</p>
        </div>
        <div className="dashboard-counts-box red-box">
          <p className="red-count">10</p>
          <p className="red-label">Days Absent</p>
        </div>
        <div className="dashboard-counts-box orange-box">
          <p className="orange-count">10</p>
          <p className="orange-label">Days On Duty</p>
        </div>
      </div>

      <div className="dashboard-table-container">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Request Type</th>
              <th>From Date</th>
              <th>To Date</th>
              <th>Session</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>REQ123456</td>
              <td>Leave</td>
              <td>2023-10-01</td>
              <td>2023-10-01</td>
              <td>Full Day</td>
              <td>Completed</td>
            </tr>
            <tr>
              <td>REQ123456</td>
              <td>Leave</td>
              <td>2023-10-01</td>
              <td>2023-10-01</td>
              <td>Full Day</td>
              <td>Completed</td>
            </tr>
            <tr>
              <td>REQ123456</td>
              <td>Leave</td>
              <td>2023-10-01</td>
              <td>2023-10-01</td>
              <td>Full Day</td>
              <td>Completed</td>
            </tr>
            <tr>
              <td>REQ123456</td>
              <td>Leave</td>
              <td>2023-10-01</td>
              <td>2023-10-01</td>
              <td>Full Day</td>
              <td>Completed</td>
            </tr>
            <tr>
              <td>REQ123456</td>
              <td>Leave</td>
              <td>2023-10-01</td>
              <td>2023-10-01</td>
              <td>Full Day</td>
              <td>Completed</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
