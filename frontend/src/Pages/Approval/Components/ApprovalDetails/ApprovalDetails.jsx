import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../../../Utils/Constants";
import Loaders from "../../../../Components/Loaders/Loaders";
import { showErrorToast } from "../../../../Components/Alerts/Alert";

export default function RequestDetails({
  selectedRequest,
  setRequestData,
  requestData,
  handleUpdateStatus,
}) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUserData = async () => {
      try {
        if (selectedRequest) {
          setLoading(true);
          const response = await axios.get(
            `${baseUrl}/requests/approval/${selectedRequest}`
          );

          if (response.data.status === 200) {
            setRequestData(response.data.data);
          } else {
            showErrorToast(response.data.message);
          }
          setLoading(false);
        }
      } catch {
        showErrorToast("An error occurred. Please contact administrator.");
        setLoading(false);
      }
    };

    getUserData();
  }, [selectedRequest]);

  return (
    <div className="sidebar-info-container">
      {loading ? (
        <Loaders />
      ) : (
        <div className="sidebar-info-table-container">
          <table>
            <tbody>
              <tr>
                <th>Request ID</th>
                <td>{selectedRequest ?? "-"}</td>
              </tr>
              <tr>
                <th>User ID</th>
                <td>{requestData.userID ?? "-"}</td>
              </tr>
              <tr>
                <th>Name</th>
                <td>{requestData.name ?? "-"}</td>
              </tr>
              <tr>
                <th>Roll Number</th>
                <td>{requestData.rollNumber ?? "-"}</td>
              </tr>
              <tr>
                <th>Year</th>
                <td>{requestData.year ?? "-"}</td>
              </tr>
              <tr>
                <th>Section</th>
                <td>{requestData.section ?? "-"}</td>
              </tr>
              <tr>
                <th>Request Type</th>
                <td>{requestData.reqType ?? "-"}</td>
              </tr>
              <tr>
                <th>From Date</th>
                <td>{requestData.fromDate ?? "-"}</td>
              </tr>
              <tr>
                <th>From Session</th>
                <td>{requestData.fromSession ?? "-"}</td>
              </tr>
              <tr>
                <th>To Session</th>
                <td>{requestData.toDate ?? "-"}</td>
              </tr>
              <tr>
                <th>To Session</th>
                <td>{requestData.toSession ?? "-"}</td>
              </tr>
              <tr>
                <th>Total Days</th>
                <td>{requestData.days ?? "-"}</td>
              </tr>
              <tr>
                <th>Reason</th>
                <td>{requestData.reason ?? "-"}</td>
              </tr>
              <tr>
                <th>Proof Link</th>
                <td>
                  {requestData.proofLink ? (
                    <a href={requestData.proofLink} target="_blank">
                      Proof Link
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
              <tr>
                <th>Class Advisor Status</th>
                <td>
                  {requestData.advisorStatus
                    ? requestData.advisorStatus.charAt(0).toUpperCase() +
                      requestData.advisorStatus.slice(1)
                    : "-"}
                </td>
              </tr>
              <tr>
                <th>Year Incharge Status</th>
                <td>
                  {requestData.inchargeStatus
                    ? requestData.inchargeStatus.charAt(0).toUpperCase() +
                      requestData.inchargeStatus.slice(1)
                    : "-"}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="form-input notes-input">
            <p>Comments</p>
            <textarea
              type="text"
              placeholder="Please provide any comments if required"
              rows="3"
              value={requestData.advisorNotes}
            />
          </div>
          <button className="primary-button">Update Comments</button>

          <div className="sidebar-buttons-container">
            <button
              className="primary-button green-button"
              onClick={() => handleUpdateStatus("approved")}
            >
              Approve
            </button>
            <button
              className="primary-button red-button"
              onClick={() => handleUpdateStatus("rejected")}
            >
              Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
