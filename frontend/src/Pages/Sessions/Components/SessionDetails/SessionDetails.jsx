export default function SessionDetails({ sessionData }) {
  return (
    <div className="sidebar-info-container">
      {sessionData && (
        <div className="sidebar-info-table-container">
          <table>
            <tbody>
              <tr>
                <th>User ID</th>
                <td>{sessionData.userID ?? "-"}</td>
              </tr>
              <tr>
                <th>Device Type</th>
                <td>{sessionData.device ?? "-"}</td>
              </tr>
              <tr>
                <th>Browser</th>
                <td>{sessionData.browser ?? "-"}</td>
              </tr>
              <tr>
                <th>IP Address</th>
                <td>{sessionData.ipAddress ?? "-"}</td>
              </tr>
              <tr>
                <th>Login Time</th>
                <td>{sessionData.loginTime ?? "-"}</td>
              </tr>
              <tr>
                <th>Logout Time</th>
                <td>{sessionData.logoutTime ?? "-"}</td>
              </tr>
              <tr>
                <th>Is Active</th>
                <td>
                  <p
                    className={
                      sessionData.isActive ? "active-text" : "inactive-text"
                    }
                  >
                    {sessionData.isActive ? "Active" : "Inactive"}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
