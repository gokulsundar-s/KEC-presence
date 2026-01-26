import { formatDateTime, formatTags } from "../../../../Utils/Formatters";
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
                <td>{formatDateTime(sessionData.loginTime ?? "-")}</td>
              </tr>
              <tr>
                <th>Logout Time</th>
                <td>{formatDateTime(sessionData.logoutTime ?? "-")}</td>
              </tr>
              <tr>
                <th>Is Active</th>
                <td>
                  <p>
                    {formatTags(sessionData.isActive ? "ACTIVE" : "INACTIVE")}
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
