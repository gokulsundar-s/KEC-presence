import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { baseUrl } from "../../../../Utils/Constants";
import { SidebarLoader } from "../../../../Components/Loaders/Loaders";
import { showErrorToast } from "../../../../Components/Alerts/Alert";
import { getGenericCodeByType } from "../../../../Utils/GenericCodeServices";

export default function RequestForm({
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
  }, [requestID, token]);

  return (
    <div className="sidebar-form-container">
      {loading ? (
        <SidebarLoader />
      ) : (
        <div className="sidebar-form-form">
          <div className="form-input">
            <p>Request Type</p>
            <select
              value={requestData.requestType}
              onChange={(e) =>
                setRequestData({ ...requestData, requestType: e.target.value })
              }
            >
              <option value="">Select Request Type</option>
              {getGenericCodeByType("REQUESTTYPE").map((code) => (
                <option key={code.code} value={code.code}>
                  {code.codeDescription}
                </option>
              ))}
            </select>
          </div>

          <div className="form-input">
            <p>From Date</p>
            <input
              type="date"
              value={requestData.fromDate}
              onChange={(e) =>
                setRequestData({ ...requestData, fromDate: e.target.value })
              }
            />
          </div>

          <div className="form-input">
            <p>From Session</p>
            <select
              value={requestData.fromSession}
              onChange={(e) =>
                setRequestData({ ...requestData, fromSession: e.target.value })
              }
            >
              <option value="">From Session</option>
              <option value="FD">Full Day</option>
              <option value="FN">Fore Noon</option>
              <option value="AN">After Noon</option>
            </select>
          </div>

          <div className="form-input">
            <p>To Date</p>
            <input
              type="date"
              value={requestData.toDate}
              onChange={(e) =>
                setRequestData({ ...requestData, toDate: e.target.value })
              }
            />
          </div>

          <div className="form-input">
            <p>To Session</p>
            <select
              value={requestData.toSession}
              onChange={(e) =>
                setRequestData({ ...requestData, toSession: e.target.value })
              }
            >
              <option value="">To Session</option>
              <option value="FD">Full Day</option>
              <option value="FN">Fore Noon</option>
              <option value="AN">After Noon</option>
            </select>
          </div>

          <div className="form-input">
            <p>Reason for Leave or On Duty</p>
            <textarea
              type="text"
              placeholder="Your reason to avail leave or on duty"
              rows="4"
              value={requestData.reason}
              onChange={(e) =>
                setRequestData({ ...requestData, reason: e.target.value })
              }
            />
          </div>

          <div className="form-input">
            <p>Proof Link</p>
            <input
              type="text"
              placeholder="Give your proof link here"
              value={requestData.proofLink}
              onChange={(e) =>
                setRequestData({ ...requestData, proofLink: e.target.value })
              }
            />
          </div>

          <div className="form-info">
            <p>
              Note: Please make sure your proof link is accessible to the
              reviewers
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
