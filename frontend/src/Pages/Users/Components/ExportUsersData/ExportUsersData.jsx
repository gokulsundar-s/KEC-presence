import { getGenericCodeByType } from "../../../../Utils/GenericCodeServices";

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
            value={exportData.department}
            onChange={(e) =>
              setExportData({ ...exportData, department: e.target.value })
            }
          >
            <option value="">All</option>
            {getGenericCodeByType("DEPARTMENT").map((code) => (
              <option key={code.code} value={code.code}>
                {code.codeDescription}
              </option>
            ))}
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
            value={exportData.section}
            onChange={(e) =>
              setExportData({ ...exportData, section: e.target.value })
            }
          >
            <option value="">All</option>
            {getGenericCodeByType("SECTION").map((code) => (
              <option key={code.code} value={code.code}>
                {code.codeDescription}
              </option>
            ))}
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
            {getGenericCodeByType("USERSTATUS").map((code) => (
              <option key={code.code} value={code.code}>
                {code.codeDescription}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
