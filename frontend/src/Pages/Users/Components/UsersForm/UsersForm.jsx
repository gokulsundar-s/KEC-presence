export default function UsersForm({ userData = {}, setUserData }) {
  return (
    <div className="sidebar-form-container">
      <div className="sidebar-form-form">
        <div className="form-input">
          <p>User Type</p>
          <select
            value={userData.userType}
            onChange={(e) =>
              setUserData({ ...userData, userType: e.target.value })
            }
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
            value={userData.department}
            onChange={(e) =>
              setUserData({ ...userData, department: e.target.value })
            }
          >
            <option value="">Select Department</option>
            <option value="CSE">Computer Science and Engineering</option>
            <option value="EEE">Electrical and Electronics Engineering</option>
            <option value="ME">Mechanical Engineering</option>
          </select>
        </div>

        <div className="form-input">
          <p>Full Name</p>
          <input
            value={userData.name}
            type="text"
            placeholder="Enter Full Name"
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
          />
        </div>

        <div className="form-input">
          <p>Roll Number</p>
          <input
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
            value={userData.year}
            onChange={(e) => setUserData({ ...userData, year: e.target.value })}
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
            onChange={(e) => setUserData({ ...userData, mail: e.target.value })}
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
            value={userData.parentPhone}
            type="text"
            placeholder="Enter Parent Phone Number"
            onChange={(e) =>
              setUserData({ ...userData, parentPhone: e.target.value })
            }
          />
        </div>
      </div>
    </div>
  );
}
