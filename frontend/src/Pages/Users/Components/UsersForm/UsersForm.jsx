import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../../../Utils/Constants";
import { SidebarLoader } from "../../../../Components/Loaders/Loaders";
import { showErrorToast } from "../../../../Components/Alerts/Alert";
import { getGenericCodeByType } from "../../../../Utils/GenericCodeServices";

export default function UsersForm({ userID, userData = {}, setUserData }) {
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

    if (userID && token) {
      getUserData();
    }
  }, [userID, token]);

  return (
    <div className="sidebar-form-container">
      {loading ? (
        <SidebarLoader />
      ) : (
        <div className="sidebar-form-form">
          <div className="form-input">
            <p>User Type</p>
            <select
              value={userData.userType}
              onChange={(e) =>
                setUserData({ ...userData, userType: e.target.value })
              }
              className={!!userID ? "disabled-form-input" : ""}
              disabled={!!userID}
            >
              <option value="">Select User Type</option>
              {getGenericCodeByType("USERTYPE").map((code) => (
                <option key={code.code} value={code.code}>
                  {code.codeDescription}
                </option>
              ))}
            </select>
          </div>

          <div className="form-input">
            <p>Department</p>
            <select
              disabled={userData.userType && userData.userType === "ADMIN"}
              className={
                userData.userType && userData.userType === "ADMIN"
                  ? "disabled-form-input"
                  : ""
              }
              value={userData.department}
              onChange={(e) =>
                setUserData({ ...userData, department: e.target.value })
              }
            >
              <option value="">Select Department</option>
              {getGenericCodeByType("DEPARTMENT").map((code) => (
                <option key={code.code} value={code.code}>
                  {code.codeDescription}
                </option>
              ))}
            </select>
          </div>

          <div className="form-input">
            <p>Full Name</p>
            <input
              value={userData.name}
              type="text"
              placeholder="Enter Full Name"
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
            />
          </div>

          <div className="form-input">
            <p>Roll Number</p>
            <input
              disabled={userData.userType && userData.userType !== "STUDENT"}
              className={
                userData.userType && userData.userType !== "STUDENT"
                  ? "disabled-form-input"
                  : ""
              }
              value={userData.rollNumber}
              type="text"
              placeholder="Enter Roll Number"
              onChange={(e) =>
                setUserData({ ...userData, rollNumber: e.target.value })
              }
            />
          </div>

          <div className="form-input">
            <p>Year</p>
            <select
              disabled={
                userData.userType &&
                (userData.userType === "ADMIN" || userData.userType === "HOD")
              }
              className={
                userData.userType &&
                (userData.userType === "ADMIN" || userData.userType === "HOD")
                  ? "disabled-form-input"
                  : ""
              }
              value={userData.year}
              onChange={(e) =>
                setUserData({ ...userData, year: e.target.value })
              }
            >
              <option value="">Select Year</option>
              {getGenericCodeByType("YEAR").map((code) => (
                <option key={code.code} value={code.code}>
                  {code.codeDescription}
                </option>
              ))}
            </select>
          </div>

          <div className="form-input">
            <p>Section</p>
            <select
              disabled={
                userData.userType &&
                userData.userType !== "STUDENT" &&
                userData.userType !== "CLASSADVISOR"
              }
              className={
                userData.userType &&
                userData.userType !== "STUDENT" &&
                userData.userType !== "CLASSADVISOR"
                  ? "disabled-form-input"
                  : ""
              }
              value={userData.section}
              onChange={(e) =>
                setUserData({ ...userData, section: e.target.value })
              }
            >
              <option value="">Select Section</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>

          <div className="form-input">
            <p>Kongu Mail ID</p>
            <input
              value={userData.mail}
              type="text"
              placeholder="Enter Kongu Mail ID"
              onChange={(e) =>
                setUserData({ ...userData, mail: e.target.value })
              }
            />
          </div>

          <div className="form-input">
            <p>Phone Number</p>
            <input
              value={userData.phoneNumber}
              type="text"
              placeholder="Enter Phone Number"
              onChange={(e) =>
                setUserData({ ...userData, phoneNumber: e.target.value })
              }
            />
          </div>

          <div className="form-input">
            <p>Parent Mail ID</p>
            <input
              disabled={userData.userType && userData.userType !== "STUDENT"}
              className={
                userData.userType && userData.userType !== "STUDENT"
                  ? "disabled-form-input"
                  : ""
              }
              value={userData.parentMail}
              type="text"
              placeholder="Enter Parent Mail ID"
              onChange={(e) =>
                setUserData({ ...userData, parentMail: e.target.value })
              }
            />
          </div>

          <div className="form-input">
            <p>Parent Phone Number</p>
            <input
              disabled={userData.userType && userData.userType !== "STUDENT"}
              className={
                userData.userType && userData.userType !== "STUDENT"
                  ? "disabled-form-input"
                  : ""
              }
              value={userData.parentPhone}
              type="text"
              placeholder="Enter Parent Phone Number"
              onChange={(e) =>
                setUserData({ ...userData, parentPhone: e.target.value })
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
