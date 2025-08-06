import React from "react";
import "./History.css";

export default function History() {
  return (
    <div className="page-container">
      <p className="page-header">Requests History</p>

      <div className="history-container">
        <div className="history-inputs-container">
          <div className="history-input">
            <p>From Date</p>
            <input type="date" />
          </div>

          <div className="history-input">
            <p>To Date</p>
            <input type="date" />
          </div>

          <div className="history-input">
            <p>Search</p>
            <input type="text" placeholder="Search" />
          </div>
        </div>

        <div className="history-table-container">
          <table className="history-table">
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
                <td>2023-10-01</td>
                <td>REQ123456</td>
                <td>Completed</td>
                <td>2023-10-01</td>
                <td>Completed</td>
                <td>
                  <button className="details-button">View</button>
                </td>
              </tr>
              <tr>
                <td>2023-10-01</td>
                <td>REQ123456</td>
                <td>Completed</td>
                <td>2023-10-01</td>
                <td>Completed</td>
                <td>
                  <button className="details-button">View</button>
                </td>
              </tr>
              <tr>
                <td>2023-10-01</td>
                <td>REQ123456</td>
                <td>Completed</td>
                <td>2023-10-01</td>
                <td>Completed</td>
                <td>
                  <button className="details-button">View</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
