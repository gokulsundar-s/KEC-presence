import React from "react";
import "./UserInfo.css";

export default function UserInfo() {
  return (
    <div className="page-container">
      <p className="page-header">Users Information</p>

      <div className="users-container">
        <div className="users-inputs-container">
          <div className="users-input">
            <p>User Type</p>
            <select>
              <option value="all">All</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="guest">Guest</option>
            </select>
          </div>

          <div className="users-input">
            <p>Department</p>
            <select>
              <option value="all">All</option>
              <option value="cse">Computer Science and Engineering</option>
              <option value="eee">
                Electrical and Electronics Engineering
              </option>
              <option value="me">Mechanical Engineering</option>
            </select>
          </div>

          <div className="users-input">
            <p>Search</p>
            <input type="text" placeholder="Search" />
          </div>
        </div>

        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>User Type</th>
                <th>Department</th>
                <th>Name</th>
                <th>Roll Number</th>
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
