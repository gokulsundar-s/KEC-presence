import "./AddBulkUser.css";

export default function AddBulkUser() {
  return (
    <div className="add-bulk-user-container">
      <input type="file" accept=".csv" />
      <button className="primary-button">Download Template</button>
    </div>
  );
}
