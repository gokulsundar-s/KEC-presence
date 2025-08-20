import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../../../Utils/Constants";
import Loaders from "../../../../Components/Loaders/Loaders";
import { showErrorToast } from "../../../../Components/Alerts/Alert";
import "./EditUserInfo.css";

export default function EditUserInfo({ userID }) {
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
    <div className="edit-userinfo-container">
      {loading ? (
        <Loaders />
      ) : (
        <div className="edit-userinfo-form">
          <div className="form-input">
            <p>Department</p>
            <select
              value={usersData.department}
              disabled={usersData.userType === "ADM"}
              className={
                usersData.userType === "ADM" ? "disabled-form-input" : ""
              }
            >
              <option value="CSE">Computer Science and Engineering</option>
              <option value="EEE">
                Electrical and Electronics Engineering
              </option>
              <option value="ME">Mechanical Engineering</option>
            </select>
          </div>

          <div className="form-input">
            <p>Full Name</p>
            <input
              value={usersData.name}
              type="text"
              placeholder="Enter Full Name"
            />
          </div>

          <div className="form-input">
            <p>Roll Number</p>
            <input
              value={usersData.rollNumber}
              type="text"
              placeholder="Enter Roll Number"
              disabled={
                usersData.userType !== "" && usersData.userType !== "STU"
              }
              className={
                usersData.userType !== "" && usersData.userType !== "STU"
                  ? "disabled-form-input"
                  : ""
              }
            />
          </div>

          <div className="form-input">
            <p>Year</p>
            <select
              value={usersData.year}
              onChange={(e) => setYear(e.target.value)}
              disabled={
                usersData.userType === "HOD" || usersData.userType === "ADM"
              }
              className={
                usersData.userType === "HOD" || usersData.userType === "ADM"
                  ? "disabled-form-input"
                  : ""
              }
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>

          <div className="form-input">
            <p>Section</p>
            <select
              value={usersData.section}
              disabled={
                usersData.userType === "YI" ||
                usersData.userType === "HOD" ||
                usersData.userType === "ADM"
              }
              className={
                usersData.userType === "YI" ||
                usersData.userType === "HOD" ||
                usersData.userType === "ADM"
                  ? "disabled-form-input"
                  : ""
              }
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>

          <div className="form-input">
            <p>Kongu Mail ID</p>
            <input
              value={usersData.mail}
              type="text"
              placeholder="Enter Kongu Mail ID"
            />
          </div>

          <div className="form-input">
            <p>Phone Number</p>
            <input
              value={usersData.phoneNumber}
              type="text"
              placeholder="Enter Phone Number"
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div className="form-input">
            <p>Parent Mail ID</p>
            <input
              value={usersData.parentMail}
              type="text"
              placeholder="Enter Parent Mail ID"
              disabled={
                usersData.userType !== "" && usersData.userType !== "STU"
              }
              className={
                usersData.userType !== "" && usersData.userType !== "STU"
                  ? "disabled-form-input"
                  : ""
              }
            />
          </div>

          <div className="form-input">
            <p>Parent Phone Number</p>
            <input
              value={usersData.parentPhone}
              type="text"
              placeholder="Enter Parent Phone Number"
              onChange={(e) => setParentPhone(e.target.value)}
              disabled={
                usersData.userType !== "" && usersData.userType !== "STU"
              }
              className={
                usersData.userType !== "" && usersData.userType !== "STU"
                  ? "disabled-form-input"
                  : ""
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
