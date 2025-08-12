import React, { useState } from "react";
import axios from "axios";

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

  const onSubmit = async () => {
    console.log("Submitting user data");
    const response = await axios.post("http://localhost:3003/users/adduser", {
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
  };

  return (
    <div className="page-container">
      <p className="page-header">Add New User</p>

      <div className="form-container">
        <div className="form-row">
          <div className="form-input">
            <p>User Type</p>
            <select
              placeholder="User Type"
              onChange={(e) => setUserType(e.target.value)}
            >
              <option value="ADM">Admin</option>
              <option value="STU">Student</option>
            </select>
          </div>

          <div className="form-input">
            <p>Department</p>
            <select onChange={(e) => setDepartment(e.target.value)}>
              <option value="cse">Computer Science and Engineering</option>
              <option value="eee">
                Electrical and Electronics Engineering
              </option>
              <option value="me">Mechanical Engineering</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-input">
            <p>Name</p>
            <input
              type="text"
              placeholder="Enter Name"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-input">
            <p>Roll Number</p>
            <input
              type="text"
              placeholder="Enter Roll Number"
              onChange={(e) => setRollNumber(e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-input">
            <p>Year</p>
            <select onChange={(e) => setYear(e.target.value)}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>

          <div className="form-input">
            <p>Section</p>
            <select onChange={(e) => setSection(e.target.value)}>
              <option value="a">A</option>
              <option value="b">B</option>
              <option value="c">C</option>
              <option value="d">D</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-input">
            <p>Kongu Mail ID</p>
            <input
              type="text"
              placeholder="Enter Kongu Mail ID"
              onChange={(e) => setMail(e.target.value)}
            />
          </div>

          <div className="form-input">
            <p>Phone Number</p>
            <input
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
              type="text"
              placeholder="Enter Parent Mail ID"
              onChange={(e) => setParentMail(e.target.value)}
            />
          </div>

          <div className="form-input">
            <p>Parent Phone Number</p>
            <input
              type="text"
              placeholder="Enter Parent Phone Number"
              onChange={(e) => setParentPhone(e.target.value)}
            />
          </div>
        </div>

        <div className="form-bottom">
          <p></p>
          <button onClick={onSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
}
