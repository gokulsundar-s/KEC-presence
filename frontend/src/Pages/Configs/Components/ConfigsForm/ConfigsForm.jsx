export default function ConfigsForm({ configData = {}, setConfigData }) {
  return (
    <div className="sidebar-form-container">
      <div className="sidebar-form-form">
        <div className="form-input">
          <p>Code Type</p>
          <select
            value={configData.codeType}
            onChange={(e) =>
              setConfigData({ ...configData, codeType: e.target.value })
            }
          >
            <option value="">Select Code Type</option>
            <option value="RTYPE">Request Type</option>
            <option value="ROLE">Role</option>
            <option value="DEPT">Department</option>
            <option value="YEAR">Year</option>
            <option value="SECTION">Section</option>
          </select>
        </div>

        <div className="form-input">
          <p>Code</p>
          <input
            value={configData.code}
            type="text"
            placeholder="Enter Code"
            onChange={(e) =>
              setConfigData({ ...configData, code: e.target.value })
            }
          />
        </div>

        <div className="form-input">
          <p>Description</p>
          <input
            value={configData.description}
            type="text"
            placeholder="Enter Description"
            onChange={(e) =>
              setConfigData({ ...configData, description: e.target.value })
            }
          />
        </div>
      </div>
    </div>
  );
}
