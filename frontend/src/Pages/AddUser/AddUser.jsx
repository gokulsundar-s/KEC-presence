import React, { useState } from "react";
import axios from "axios";
import { showErrorToast } from "../../Components/Alerts/Alert";
import { SuccessModal } from "../../Components/Modals/Modals";
import SideTab from "../../Components/SiderTab/SideTab";
import AddBulkUser from "./AddBulkUser/AddBulkUser";

export default function AddUser() {
  const [userType, setUserType] = useState("");
  const [department, setDepartment] = useState("");
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [year, setYear] = useState("");
  const [section, setSection] = useState("");
  const [mail, setMail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [parentMail, setParentMail] = useState("");
  const [parentPhone, setParentPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [openBulkAdd, setOpenBulkAdd] = useState(false);

  const onUserTypeChange = (e) => {
    setUserType(e.target.value);
    setDepartment("");
    setName("");
    setRollNumber("");
    setYear("");
    setSection("");
    setMail("");
    setPhoneNumber("");
    setParentMail("");
    setParentPhone("");
  };

  const onSubmit = async () => {
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:3003/users/", {
        userType,
        department,
        name,
        rollNumber,
        year,
        section,
        mail,
        phoneNumber,
        parentMail,
        parentPhone,
      });

      if (response.data.status === 200) {
        setLoading(false);
        setOpenSuccessModal(true);
        setUserType("");
        setDepartment("");
        setName("");
        setRollNumber("");
        setYear("");
        setSection("");
        setMail("");
        setPhoneNumber("");
        setParentMail("");
        setParentPhone("");
      } else if (response.data.status === 400) {
        setLoading(false);
        showErrorToast(response.data.message);
      } else {
        setLoading(false);
        showErrorToast("An error occurred. Please contact administrator.");
      }
    } catch {
      setLoading(false);
      showErrorToast("An error occurred. Please contact administrator.");
    }
  };

  return (
    <div className="page-container">
      <p className="page-header">Add New User</p>
      <div className="form-container">
        <div className="form-row">
          <div className="form-input">
            <p>User Type</p>
            <select
              value={userType}
              placeholder="User Type"
              onChange={(e) => onUserTypeChange(e)}
            >
              <option value="">Select User Type</option>
              <option value="ADM">Admin</option>
              <option value="STU">Student</option>
              <option value="CA">Class Advisor</option>
              <option value="YI">Year Incharge</option>
              <option value="HOD">Head of Department</option>
            </select>
          </div>

          <div className="form-input">
            <p>Department</p>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              disabled={userType === "ADM"}
              className={userType === "ADM" ? "disabled-form-input" : ""}
            >
              <option value="">Select Department</option>
              <option value="CSE">Computer Science and Engineering</option>
              <option value="EEE">
                Electrical and Electronics Engineering
              </option>
              <option value="ME">Mechanical Engineering</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-input">
            <p>Full Name</p>
            <input
              value={name}
              type="text"
              placeholder="Enter Full Name"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-input">
            <p>Roll Number</p>
            <input
              value={rollNumber}
              type="text"
              placeholder="Enter Roll Number"
              onChange={(e) => setRollNumber(e.target.value)}
              disabled={userType !== "" && userType !== "STU"}
              className={
                userType !== "" && userType !== "STU"
                  ? "disabled-form-input"
                  : ""
              }
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-input">
            <p>Year</p>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              disabled={userType === "HOD" || userType === "ADM"}
              className={
                userType === "HOD" || userType === "ADM"
                  ? "disabled-form-input"
                  : ""
              }
            >
              <option value="">Select Year</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>

          <div className="form-input">
            <p>Section</p>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              disabled={
                userType === "YI" || userType === "HOD" || userType === "ADM"
              }
              className={
                userType === "YI" || userType === "HOD" || userType === "ADM"
                  ? "disabled-form-input"
                  : ""
              }
            >
              <option value="">Select Section</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-input">
            <p>Kongu Mail ID</p>
            <input
              value={mail}
              type="text"
              placeholder="Enter Kongu Mail ID"
              onChange={(e) => setMail(e.target.value)}
            />
          </div>

          <div className="form-input">
            <p>Phone Number</p>
            <input
              value={phoneNumber}
              type="text"
              placeholder="Enter Phone Number"
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-input">
            <p>Parent Mail ID</p>
            <input
              value={parentMail}
              type="text"
              placeholder="Enter Parent Mail ID"
              onChange={(e) => setParentMail(e.target.value)}
              disabled={userType !== "" && userType !== "STU"}
              className={
                userType !== "" && userType !== "STU"
                  ? "disabled-form-input"
                  : ""
              }
            />
          </div>

          <div className="form-input">
            <p>Parent Phone Number</p>
            <input
              value={parentPhone}
              type="text"
              placeholder="Enter Parent Phone Number"
              onChange={(e) => setParentPhone(e.target.value)}
              disabled={userType !== "" && userType !== "STU"}
              className={
                userType !== "" && userType !== "STU"
                  ? "disabled-form-input"
                  : ""
              }
            />
          </div>
        </div>

        <div className="form-bottom">
          <p></p>
          <div className="form-buttons-container">
            <button
              className="secondary-button"
              disabled={loading}
              onClick={() => setOpenBulkAdd(true)}
            >
              Add Bulk Users
            </button>
            <button
              className="primary-button"
              onClick={onSubmit}
              disabled={loading}
            >
              {loading ? <span className="button-loader"></span> : "Submit"}
            </button>
          </div>
        </div>
      </div>

      {openSuccessModal && (
        <SuccessModal
          message={"Your new user has been added successfully."}
          onClose={() => {
            setOpenSuccessModal(false);
          }}
        />
      )}

      <SideTab
        title={"Add Bulk Users"}
        open={openBulkAdd}
        setOpen={setOpenBulkAdd}
        footer={<button className="primary-button">Submit</button>}
      >
        <AddBulkUser />
      </SideTab>
    </div>
  );
}
