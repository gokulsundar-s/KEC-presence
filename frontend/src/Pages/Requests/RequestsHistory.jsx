import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../Utils/Constants";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import SideTab from "../../Components/SiderTab/SideTab";
import RequestDetails from "./Components/RequestDetails/RequestDetails";
import Loaders from "../../Components/Loaders/Loaders";
import NoData from "../../Components/NoData/NoData";
import { showErrorToast } from "../../Components/Alerts/Alert";

export default function RequestsHistory() {
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    const userDetailsToken = Cookies.get("userDetailsToken");
    const decodedUsersToken = jwtDecode(userDetailsToken);
    setRequestData({ ...requestData, userID: decodedUsersToken?.userID });
    getRequestsData(decodedUsersToken?.userID);
  }, []);

  useEffect(() => {
    if (!openInfoSider) {
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
      <p className="page-header">Requests History</p>

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
        title={"Request Details"}
      >
        <RequestDetails
          selectedRequest={selectedRequest}
          setRequestData={setRequestData}
          requestData={requestData}
        />
      </SideTab>
    </div>
  );
}
