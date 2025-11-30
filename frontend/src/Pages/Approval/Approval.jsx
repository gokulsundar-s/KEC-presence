import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../Utils/Constants";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import SideTab from "../../Components/SiderTab/SideTab";
import Loaders from "../../Components/Loaders/Loaders";
import NoData from "../../Components/NoData/NoData";
import ApprovalDetails from "./Components/ApprovalDetails/ApprovalDetails";
import ApprovalForm from "./Components/ApprovalForm/ApprovalForm";
import { ConfirmModal } from "../../Components/Modals/Modals";
import {
  showErrorToast,
  showSuccessToast,
} from "../../Components/Alerts/Alert";

export default function NewRequest() {
  const [loading, setLoading] = useState(false);
  const [userID, setUserID] = useState("");
  const [userType, setUserType] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requestsData, setRequestsData] = useState([]);
  const [requestData, setRequestData] = useState({
    userID: "",
    reqType: "",
    fromDate: "",
    fromSession: "",
    toDate: "",
    toSession: "",
    reason: "",
    proofLink: "",
  });
  const [openInfoSider, setOpenInfoSider] = useState(false);
  const [editRequest, setEditRequest] = useState(false);
  const [cancelRequest, setCancelRequest] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const getRequestsData = async (userID) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${baseUrl}/requests/approvals/${userID}`,
        {}
      );

      if (response.data.status === 200) {
        setRequestsData(response.data.data);
      }
      setLoading(false);
    } catch {
      setLoading(false);
      showErrorToast("Internal Server Error! Please contact Administrator");
    }
  };

  const handleCancelRequest = async () => {
    try {
      setCancelLoading(true);
      const response = await axios.put(
        `${baseUrl}/requests/status/${selectedRequest}`,
        {
          advisorStatus: "cancelled",
          inchargeStatus: "cancelled",
        }
      );
      if (response.data.status === 200) {
        showSuccessToast("Request cancelled successfully");
        getRequestsData(userID);
        setOpenInfoSider(false);
        setCancelRequest(false);
      } else {
        showErrorToast(response.data.message);
        setOpenInfoSider(false);
        setCancelRequest(false);
      }
      setCancelLoading(false);
    } catch (error) {
      setCancelLoading(false);
      showErrorToast("Internal Server Error! Please contact Administrator");
    }
  };

  const handleEditRequest = async () => {
    try {
      setEditLoading(true);
      const response = await axios.put(
        `${baseUrl}/requests/${selectedRequest}`,
        requestData
      );
      if (response.data.status === 200) {
        showSuccessToast("Request updated successfully");
        getRequestsData(userID);
        setOpenInfoSider(false);
        setEditRequest(false);
      } else {
        showErrorToast(response.data.message);
        setOpenInfoSider(false);
        setEditRequest(false);
      }
    } catch (error) {
      setEditLoading(false);
      showErrorToast("Internal Server Error! Please contact Administrator");
    }
  };

  const handleUpdateStatus = async (status) => {
    try {
      let body = {};
      if (userType === "CA") {
        body = { advisorStatus: status };
      } else if (userType === "YI") {
        body = { inchargeStatus: status };
      }
      setStatusLoading(true);
      const response = await axios.put(
        `${baseUrl}/requests/status/${selectedRequest}`,
        body
      );
      if (response.data.status === 200) {
        showSuccessToast("Request cancelled successfully");
        getRequestsData(userID);
        setOpenInfoSider(false);
      } else {
        showErrorToast(response.data.message);
        setOpenInfoSider(false);
      }
      setStatusLoading(false);
    } catch (error) {
      setStatusLoading(false);
      showErrorToast("Internal Server Error! Please contact Administrator");
    }
  };

  useEffect(() => {
    const userDetailsToken = Cookies.get("userDetailsToken");
    const decodedUsersToken = jwtDecode(userDetailsToken);
    setRequestData({ ...requestData, userID: decodedUsersToken?.userID });
    setUserType(decodedUsersToken?.userType);
    setUserID(decodedUsersToken?.userID);
    getRequestsData(decodedUsersToken?.userID);
  }, []);

  return (
    <div className="page-container">
      <p className="page-header">Pending Requests</p>

      <div className="view-info-container">
        <div className="view-info-inputs-container">
          <div className="view-info-input">
            <p>From Date</p>
            <input type="date" />
          </div>

          <div className="view-info-input">
            <p>To Date</p>
            <input type="date" />
          </div>

          <div className="view-info-input">
            <p>Search</p>
            <input type="text" placeholder="Search" />
          </div>
        </div>
      </div>

      <div className="view-info-table-container">
        {loading ? (
          <Loaders />
        ) : requestsData.length === 0 ? (
          <NoData />
        ) : (
          <table className="view-info-table">
            <thead>
              <tr>
                <td>Roll Number</td>
                <td>Request ID</td>
                <td>Request Type</td>
                <td>From Date</td>
                <td>To Date</td>
                <td>Total Days</td>
                <td>Actions</td>
              </tr>
            </thead>
            <tbody>
              {requestsData.map((request) => (
                <tr key={request.requestID}>
                  <td>{request.rollNumber}</td>
                  <td>{request.requestID}</td>
                  <td>{request.reqType}</td>
                  <td>{request.fromDate.slice(0, 10)}</td>
                  <td>{request.toDate.slice(0, 10)}</td>
                  <td>{request.days}</td>
                  <td>
                    <button
                      className="details-button"
                      onClick={() => {
                        setOpenInfoSider(true);
                        setSelectedRequest(request.requestID);
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <SideTab
        open={openInfoSider}
        setOpen={setOpenInfoSider}
        title={editRequest ? "Edit Request" : "Request Details"}
        footer={
          <>
            {!editRequest ? (
              <div>
                <button
                  className="primary-button"
                  onClick={() => setCancelRequest(true)}
                >
                  Cancel Request
                </button>
                <button
                  className="primary-button"
                  onClick={() => setEditRequest(true)}
                >
                  Edit
                </button>
              </div>
            ) : (
              <div>
                <button
                  className="primary-button"
                  onClick={() => setEditRequest(false)}
                >
                  Back
                </button>
                <button
                  className="primary-button"
                  onClick={handleEditRequest}
                  disabled={editLoading}
                >
                  {editLoading ? (
                    <span className="login-button-loader"></span>
                  ) : (
                    "Update"
                  )}
                </button>
              </div>
            )}
          </>
        }
      >
        {editRequest ? (
          <ApprovalForm
            requestData={requestData}
            setRequestData={setRequestData}
          />
        ) : (
          <ApprovalDetails
            selectedRequest={selectedRequest}
            setRequestData={setRequestData}
            requestData={requestData}
            handleUpdateStatus={handleUpdateStatus}
          />
        )}
      </SideTab>

      {cancelRequest && (
        <ConfirmModal
          title="Cancel Request"
          message="Are you sure you want to cancel this request?"
          onConfirm={handleCancelRequest}
          onClose={() => setCancelRequest(false)}
          loading={cancelLoading}
        />
      )}
    </div>
  );
}
