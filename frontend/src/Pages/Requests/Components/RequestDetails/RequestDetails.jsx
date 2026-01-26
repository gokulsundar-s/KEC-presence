import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { baseUrl } from "../../../../Utils/Constants";
import { SidebarLoader } from "../../../../Components/Loaders/Loaders";
import { showErrorToast } from "../../../../Components/Alerts/Alert";
import { getGenericCodeNameByValue } from "../../../../Utils/GenericCodeServices";
import { formatTags } from "../../../../Utils/Formatters";

export default function RequestDetails({
  requestID,
  setRequestData,
  requestData,
}) {
  const navigate = useNavigate();

  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  // useEffect to check authentication token and fetch user data
  useEffect(() => {
    const tokenValue = Cookies.get("token");
    if (!tokenValue) {
      navigate("/login");
      return;
    }
    setToken(tokenValue);
  }, [navigate]);

  // useEffect to fetch request data when selectedRequest changes
  useEffect(() => {
    const getUserData = async () => {
      try {
        if (requestID) {
          setLoading(true);
          const response = await axios.get(`${baseUrl}/requests/${requestID}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

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
  }, [requestID]);

  return (
    <div className="sidebar-info-container">
      {loading ? (
        <SidebarLoader />
      ) : (
        <div className="sidebar-info-table-container">
          <table>
            <tbody>
              <tr>
                <th>Request ID</th>
                <td>{requestID ?? "-"}</td>
              </tr>
              <tr>
                <th>Request Type</th>
                <td>{formatTags(requestData.requestType)}</td>
              </tr>
              <tr>
                <th>From Date</th>
                <td>{requestData.fromDate ?? "-"}</td>
              </tr>
              <tr>
                <th>From Session</th>
                <td>
                  {getGenericCodeNameByValue(requestData.fromSession) ?? "-"}
                </td>
              </tr>
              <tr>
                <th>To Date</th>
                <td>{requestData.toDate ?? "-"}</td>
              </tr>
              <tr>
                <th>To Session</th>
                <td>
                  {getGenericCodeNameByValue(requestData.toSession) ?? "-"}
                </td>
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
                <td>{formatTags(requestData.advisorStatus)}</td>
              </tr>
              <tr>
                <th>Class Advisor Notes</th>
                <td>{requestData.advisorNotes ?? "-"}</td>
              </tr>
              <tr>
                <th>Year Incharge Status</th>
                <td>{formatTags(requestData.inchargeStatus)}</td>
              </tr>
              <tr>
                <th>Year Incharge Notes</th>
                <td>{requestData.inchargeNotes ?? "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
