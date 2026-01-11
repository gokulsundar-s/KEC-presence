import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../Utils/Constants";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import SideTab from "../../Components/SiderTab/SideTab";
import RequestForm from "./Components/RequestForm/RequestForm";
import RequestDetails from "./Components/RequestDetails/RequestDetails";
import { Loaders } from "../../Components/Loaders/Loaders";
import NoData from "../../Components/NoData/NoData";
import {
  showErrorToast,
  showSuccessToast,
} from "../../Components/Alerts/Alert";
import { ConfirmModal, WarningModal } from "../../Components/Modals/Modals";

export default function NewRequest() {
  const [loading, setLoading] = useState(false);
  const [userID, setUserID] = useState("");
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
  const [openAddRequestSider, setOpenAddRequestSider] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [cancelRequestTitle, setCancelRequestTitle] = useState("");
  const [cancelRequestMsg, setCancelRequestMsg] = useState("");
  const [editRequest, setEditRequest] = useState(false);
  const [cancelRequest, setCancelRequest] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const getRequestsData = async (userID) => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/requests/`, {
        params: { userID: userID, isActiveRequest: true },
      });

      if (response.data.status === 200) {
        setRequestsData(response.data.data);
      }
      setLoading(false);
    } catch {
      setLoading(false);
      showErrorToast("Internal Server Error! Please contact Administrator");
    }
  };

  const handleAddRequest = async () => {
    try {
      requestData.userID = userID;
      setAddLoading(true);
      const response = await axios.post(`${baseUrl}/requests`, requestData);

      if (response.data.status === 200) {
        setAddLoading(false);
        setOpenAddRequestSider(false);
        showSuccessToast("Request posted successfully");

        const userDetailsToken = Cookies.get("userDetailsToken");
        const decodedUsersToken = jwtDecode(userDetailsToken);
        getRequestsData(decodedUsersToken?.userID);

        setRequestData({
          userID: "",
          reqType: "",
          fromDate: "",
          fromSession: "",
          toDate: "",
          toSession: "",
          reason: "",
          proofLink: "",
        });
      } else {
        setAddLoading(false);
        showErrorToast(response.data.message);
      }
    } catch (error) {
      setAddLoading(false);
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
        getRequestsData(requestData.userID);
        setOpenInfoSider(false);
        setCancelRequest(false);
      } else if (response.data.status === 100) {
        setOpenCancelModal(true);
        setCancelRequestTitle("Cannot Cancel Request");
        setCancelRequestMsg(response.data.message);
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
        getRequestsData(requestData.userID);
        setOpenInfoSider(false);
        setEditRequest(false);
      } else if (response.data.status === 100) {
        setOpenCancelModal(true);
        setCancelRequestTitle("Cannot Update Request");
        setCancelRequestMsg(response.data.message);
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

  useEffect(() => {
    const userDetailsToken = Cookies.get("userDetailsToken");
    const decodedUsersToken = jwtDecode(userDetailsToken);
    setUserID(decodedUsersToken?.userID);
    getRequestsData(decodedUsersToken?.userID);
  }, []);

  useEffect(() => {
    if (!openInfoSider) {
      setEditRequest(false);
      setSelectedRequest(null);
      setRequestData({
        userID: requestData.userID,
        reqType: "",
        fromDate: "",
        fromSession: "",
        toDate: "",
        toSession: "",
        reason: "",
        proofLink: "",
      });
    }
  }, [openInfoSider]);

  return (
    <div className="page-container">
      <p className="page-header">New Request</p>

      <div className="view-info-container">
        <div className="view-info-inputs-container">
          <div className="view-info-input">
            <p>Request Type</p>
            <select>
              <option value="all">All</option>
              <option value="OD">On-Duty</option>
              <option value="LEAVE">Leave</option>
            </select>
          </div>

          <div className="view-info-input">
            <p>Search</p>
            <input type="text" placeholder="Search" />
          </div>

          <div className="view-info-input">
            <button
              className="primary-button"
              onClick={() => setOpenAddRequestSider(true)}
            >
              Add New Request
            </button>
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
                <td>Request ID</td>
                <td>Request Type</td>
                <td>From Date</td>
                <td>To Date</td>
                <td>Total Days</td>
                <td>Status</td>
                <td>Actions</td>
              </tr>
            </thead>
            <tbody>
              {requestsData.map((request) => (
                <tr key={request.requestID}>
                  <td>{request.requestID}</td>
                  <td>{request.reqType}</td>
                  <td>{request.fromDate.slice(0, 10)}</td>
                  <td>{request.toDate.slice(0, 10)}</td>
                  <td>{request.days}</td>
                  <td>
                    {request.status.charAt(0).toUpperCase() +
                      request.status.slice(1)}
                  </td>
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
                    <span className="button-loader"></span>
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
          <RequestForm
            requestData={requestData}
            setRequestData={setRequestData}
          />
        ) : (
          <RequestDetails
            selectedRequest={selectedRequest}
            setRequestData={setRequestData}
            requestData={requestData}
          />
        )}
      </SideTab>

      <SideTab
        open={openAddRequestSider}
        setOpen={setOpenAddRequestSider}
        title={"New Request"}
        footer={
          <button
            className="primary-button"
            onClick={handleAddRequest}
            disabled={addLoading}
          >
            {addLoading ? <span className="button-loader"></span> : "Submit"}
          </button>
        }
      >
        <RequestForm
          requestData={requestData}
          setRequestData={setRequestData}
        />
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

      {openCancelModal && (
        <WarningModal
          title={cancelRequestTitle}
          message={cancelRequestMsg}
          onClose={() => setOpenCancelModal(false)}
        />
      )}
    </div>
  );
}
