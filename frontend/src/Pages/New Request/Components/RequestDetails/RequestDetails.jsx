export default function ConfigsDetails({ configData }) {
  if (!configData) return null; // Guard clause for empty data

  return (
    <div className="sidebar-info-table-container">
      <table>
        <tbody>
          <tr>
            <th>Code Type</th>
            <td>
              {configData.codeType === "DEPT"
                ? "Department"
                : configData.codeType === "RTYPE"
                ? "Request Type"
                : configData.codeType === "ROLE"
                ? "Role"
                : configData.codeType === "YEAR"
                ? "Year"
                : configData.codeType === "SECTION"
                ? "Section"
                : "-"}
            </td>
          </tr>
          <tr>
            <th>Code</th>
            <td>{configData.code ?? "-"}</td>
          </tr>
          <tr>
            <th>Description</th>
            <td>{configData.description ?? "-"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
