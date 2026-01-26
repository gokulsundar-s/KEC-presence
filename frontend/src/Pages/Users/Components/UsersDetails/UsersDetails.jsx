import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../../../Utils/Constants";
import { SidebarLoader } from "../../../../Components/Loaders/Loaders";
import { showErrorToast } from "../../../../Components/Alerts/Alert";
import { getGenericCodeNameByValue } from "../../../../Utils/GenericCodeServices";
import { formatTags } from "../../../../Utils/Formatters";

export default function UsersDetails({ userID, userData, setUserData }) {
  const navigate = useNavigate();

  const [token, setToken] = useState("");
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

  // useEffect to fetch user data when userID changes
  useEffect(() => {
    const getUserData = async () => {
      try {
        if (userID) {
          setLoading(true);
          const response = await axios.get(`${baseUrl}/users/${userID}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.data.status === 200) {
            setUserData(response.data.data);
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

    if (userID) {
      getUserData();
    }
  }, [userID]);

  return (
    <div className="sidebar-info-container">
      {loading ? (
        <SidebarLoader />
      ) : (
        <div className="sidebar-info-table-container">
          <table>
            <tbody>
              <tr>
                <th>User ID</th>
                <td>{userID ?? "-"}</td>
              </tr>
              <tr>
                <th>User Type</th>
                <td>{getGenericCodeNameByValue(userData.userType)}</td>
              </tr>
              <tr>
                <th>Department</th>
                <td>
                  {getGenericCodeNameByValue(userData.department) != ""
                    ? getGenericCodeNameByValue(userData.department)
                    : "-"}
                </td>
              </tr>
              <tr>
                <th>Name</th>
                <td>{userData.name ?? "-"}</td>
              </tr>
              <tr>
                <th>Roll Number</th>
                <td>
                  {userData.rollNumber !== "" ? userData.rollNumber : "-"}
                </td>
              </tr>
              <tr>
                <th>Year</th>
                <td>{userData.year !== null ? userData.year : "-"}</td>
              </tr>
              <tr>
                <th>Section</th>
                <td>{userData.section !== "" ? userData.section : "-"}</td>
              </tr>
              <tr>
                <th>Kongu Mail ID</th>
                <td>{userData.mail ?? "-"}</td>
              </tr>
              <tr>
                <th>Phone Number</th>
                <td>{userData.phoneNumber ?? "-"}</td>
              </tr>
              <tr>
                <th>Parent Mail ID</th>
                <td>
                  {userData.parentMail !== "" ? userData.parentMail : "-"}
                </td>
              </tr>
              <tr>
                <th>Parent Phone Number</th>
                <td>
                  {userData.parentPhone !== "" ? userData.parentPhone : "-"}
                </td>
              </tr>
              <tr>
                <th>User Status</th>
                <td>
                  <div>
                    <p>
                      {formatTags(userData.isActive ? "ACTIVE" : "INACTIVE")}
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
