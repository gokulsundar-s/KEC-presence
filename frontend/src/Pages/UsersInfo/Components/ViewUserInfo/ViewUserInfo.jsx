import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../../../Utils/Constants";
import Loaders from "../../../../Components/Loaders/Loaders";
import { showErrorToast } from "../../../../Components/Alerts/Alert";
import "./ViewUserInfo.css";

export default function ViewUserInfo({ userID }) {
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUserData = async () => {
      try {
        if (userID) {
          setLoading(true);
          const response = await axios.get(`${baseUrl}/users/${userID}`);

          if (response.data.status === 200) {
            setUsersData(response.data.data);
          } else {
            showErrorToast(response.data.message);
          }
          setLoading(false);
        }
      } catch (error) {
        showErrorToast("An error occurred. Please contact administrator.");
        setLoading(false);
      }
    };

    getUserData();
  }, [userID]);

  return (
    <div className="userinfo-container">
      {loading ? (
        <Loaders />
      ) : (
        <div className="userinfo-table-container">
          <table>
            <tbody>
              <tr>
                <th>User ID</th>
                <td>{userID ?? "-"}</td>
              </tr>
              <tr>
                <th>User Type</th>
                <td>{usersData.userType ?? "-"}</td>
              </tr>
              <tr>
                <th>Department</th>
                <td>{usersData.department ?? "-"}</td>
              </tr>
              <tr>
                <th>Name</th>
                <td>{usersData.name ?? "-"}</td>
              </tr>
              <tr>
                <th>Year</th>
                <td>{usersData.year ?? "-"}</td>
              </tr>
              <tr>
                <th>Section</th>
                <td>{usersData.section ?? "-"}</td>
              </tr>
              <tr>
                <th>Kongu Mail ID</th>
                <td>{usersData.mail ?? "-"}</td>
              </tr>
              <tr>
                <th>Phone Number</th>
                <td>{usersData.phoneNumber ?? "-"}</td>
              </tr>
              <tr>
                <th>Parent Mail ID</th>
                <td>{usersData.parentMail ?? "-"}</td>
              </tr>
              <tr>
                <th>Parent Phone Number</th>
                <td>{usersData.parentPhone ?? "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
