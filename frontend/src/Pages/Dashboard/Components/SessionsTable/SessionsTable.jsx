import { formateDuration, formatTags } from "../../../../Utils/Formatters";
export default function SessionsTable({ sessionsData }) {
  return (
    <div className="view-info-table-container">
      <table className="view-info-table">
        <thead>
          <tr>
            <td>User ID</td>
            <td>IP Address</td>
            <td>Login Time</td>
            <td>Device Type</td>
            <td>Status</td>
          </tr>
        </thead>
        <tbody>
          {sessionsData.map((session) => (
            <tr key={session._id}>
              <td>{session.userID}</td>
              <td>{session.ipAddress}</td>
              <td>{formateDuration(session.loginTime)} ago</td>
              <td>{session.device}</td>
              <td>
                <p>{formatTags(session.isActive ? "ACTIVE" : "INACTIVE")}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
