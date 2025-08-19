import { useState, useEffect, use } from "react";
import axios from "axios";
import { showErrorToast } from "../../Components/Alerts/Alert";
import NoData from "../../Components/NoData/NoData";
import Loaders from "../../Components/Loaders/Loaders";

export default function UserInfo() {
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openSider, setOpenSider] = useState(false);

  useEffect(() => {
    const getUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3003/users");
        if (response.data.status === 200) {
          setUsersData(response.data.data);
        } else {
          showErrorToast(response.data.message);
        }
        setLoading(false);
      } catch (error) {
        showErrorToast("An error occurred. Please contact administrator.");
        setLoading(false);
      }
    };

    getUserData();
  }, []);

  return (
    <div className="page-container">
      <p className="page-header">Users Information</p>

      <div className="view-info-container">
        <div className="view-info-inputs-container">
          <div className="view-info-input">
            <p>User Type</p>
            <select>
              <option value="all">All</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="guest">Guest</option>
            </select>
          </div>

          <div className="view-info-input">
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

          <div className="view-info-input">
            <p>Search</p>
            <input type="text" placeholder="Search" />
          </div>
        </div>

        <div className="view-info-table-container">
          {loading && <Loaders /> ? (
            <Loaders />
          ) : usersData.length === 0 ? (
            <NoData />
          ) : (
            <table className="view-info-table">
              <thead>
                <tr>
                  <td>User ID</td>
                  <td>User Type</td>
                  <td>Department</td>
                  <td>Name</td>
                  <td>Actions</td>
                </tr>
              </thead>
              <tbody>
                {usersData.map((user) => (
                  <tr key={user.id}>
                    <td>{user.userID}</td>
                    <td>{user.userType === "STU" ? "Student" : "Admin"}</td>
                    <td>
                      {user.department === "CSE"
                        ? "Computer Science and Engineering"
                        : "Information Technology"}
                    </td>
                    <td>{user.name}</td>
                    <td>
                      <button
                        className="details-button"
                        onClick={() => setOpenSider(true)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
