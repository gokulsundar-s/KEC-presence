export default function ExportUsersData({ userData = {} }) {
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
          <p>User Status</p>
          <select
            value={userData.section}
            onChange={(e) =>
              setUserData({ ...userData, section: e.target.value })
            }
          >
            <option value="">Select User Status</option>
            <option value="A">Active</option>
            <option value="B">Inactive</option>
          </select>
        </div>
      </div>
    </div>
  );
}
