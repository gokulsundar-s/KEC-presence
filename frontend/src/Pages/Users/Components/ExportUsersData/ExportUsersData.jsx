import { Exporter } from "../../../../Utils/Exporter";
export default function ExportUsersData({ exportData = {}, setExportData }) {
  return (
    <div className="sidebar-form-container">
      <div className="sidebar-form-form">
        <div className="form-input">
          <p>User Type</p>
          <select
            value={exportData.userType}
            onChange={(e) =>
              setExportData({ ...exportData, userType: e.target.value })
            }
          >
            <option value="">All</option>
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
            value={exportData.department}
            onChange={(e) =>
              setExportData({ ...exportData, department: e.target.value })
            }
          >
            <option value="">All</option>
            <option value="CSE">Computer Science and Engineering</option>
            <option value="EEE">Electrical and Electronics Engineering</option>
            <option value="ME">Mechanical Engineering</option>
          </select>
        </div>

        <div className="form-input">
          <p>Year</p>
          <select
            value={exportData.year}
            onChange={(e) =>
              setExportData({ ...exportData, year: e.target.value })
            }
          >
            <option value="">All</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>

        <div className="form-input">
          <p>Section</p>
          <select
            value={exportData.section}
            onChange={(e) =>
              setExportData({ ...exportData, section: e.target.value })
            }
          >
            <option value="">All</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </div>

        <div className="form-input">
          <p>User Status</p>
          <select
            value={exportData.status}
            onChange={(e) =>
              setExportData({ ...exportData, status: e.target.value })
            }
          >
            <option value="">All</option>
            <option value="A">Active</option>
            <option value="B">Inactive</option>
          </select>
        </div>
      </div>
    </div>
  );
}
