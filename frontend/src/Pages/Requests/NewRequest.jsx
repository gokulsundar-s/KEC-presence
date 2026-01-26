import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../Utils/Constants";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import SideTab from "../../Components/SiderTab/SideTab";
import RequestForm from "./Components/RequestForm/RequestForm";
import RequestDetails from "./Components/RequestDetails/RequestDetails";
import { Loaders } from "../../Components/Loaders/Loaders";
import NoData from "../../Components/NoData/NoData";
import { ConfirmModal } from "../../Components/Modals/Modals";
import {
  showErrorToast,
  showSuccessToast,
} from "../../Components/Alerts/Alert";
import { formatTags, formatDate } from "../../Utils/Formatters";
import {
  FilterIcon,
  AddIcon,
  InfoIcon,
  EditIcon,
  InActivateIcon,
  SubmitIcon,
  LoadIcon,
} from "../../Assets/Icons";

export default function NewRequest() {
  const navigate = useNavigate();

  // State variables for data handling
  const [token, setToken] = useState("");
  const [requestsData, setRequestsData] = useState([]);
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [requestData, setRequestData] = useState({
    userID: "",
    requestType: "",
    fromDate: "",
    fromSession: "",
    toDate: "",
    toSession: "",
    reason: "",
    proofLink: "",
  });

  // State variable for controlling drawer visibility
  const [openAddRequestSider, setOpenAddRequestSider] = useState(false);
  const [openEditRequestSider, setOpenEditRequestSider] = useState(false);
  const [openRequestInfoSider, setOpenRequestInfoSider] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  // State variable for loaders
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [rowLoading, setRowLoading] = useState(false);

  // useEffect to check authentication token and fetch request data
  useEffect(() => {
    const tokenValue = Cookies.get("token");
    if (!tokenValue) {
      navigate("/login");
      return;
    }
    setToken(tokenValue);
  }, [navigate]);

  // Fetch request data when token is set
  useEffect(() => {
    if (token) {
      getRequestsData();
    }
  }, [token, pageNumber, pageSize]);

  // Reset request data form when add/edit sider is closed
  useEffect(() => {
    if (!openEditRequestSider && !openRequestInfoSider && !openAddRequestSider)
      setRequestData({
        userID: "",
        requestType: "",
        fromDate: "",
        fromSession: "",
        toDate: "",
        toSession: "",
        reason: "",
        proofLink: "",
      });
  }, [openAddRequestSider, openEditRequestSider, openRequestInfoSider]);

  // Function to update the selected users list
  const handleSelectRequests = (reqID) => {
    if (selectedRequests.includes(reqID)) {
      setSelectedRequests(selectedRequests.filter((id) => id !== reqID));
    } else {
      setSelectedRequests([...selectedRequests, reqID]);
    }
  };

  // Function to select or deselect all users
  const handleSelectAllRequests = () => {
    if (selectedRequests.length === requestsData.length) {
      setSelectedRequests([]);
    } else {
      const allRequestsIDs = requestsData.map((req) => req.requestID);
      setSelectedRequests(allRequestsIDs);
    }
  };

  // Function to load more users based on pagination
  const handleLoadRequests = () => {
    setPageNumber(pageNumber + 1);
  };

  // Refresh users data
  const refreshRequestData = async () => {
    const response = await axios.get(`${baseUrl}/requests`, {
      params: {
        pageNumber: 1,
        pageSize: pageSize,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data.status === 200) {
      setRequestsData(response.data.data.data);
      setTotalRecords(response.data.data.total);
    }
  };

  // Function to fetch all the request info
  const getRequestsData = async () => {
    try {
      if (requestsData.length > 0) {
        setRowLoading(true);
      } else {
        setLoading(true);
      }
      const response = await axios.get(`${baseUrl}/requests`, {
        params: {
          pageNumber: pageNumber,
          pageSize: pageSize,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status === 200) {
        setRequestsData([...requestsData, ...response.data.data.data]);
        setTotalRecords(response.data.data.total);
      } else {
        showErrorToast(response.data.message);
      }
      setLoading(false);
      setRowLoading(false);
    } catch {
      showErrorToast("An error occurred. Please contact administrator.");
      setLoading(false);
      setRowLoading(false);
    }
  };

  // Function to handle adding a new request
  const handleAddRequest = async () => {
    try {
      setButtonLoading(true);
      requestData.userID = jwtDecode(token).userID;
      const response = await axios.post(`${baseUrl}/requests`, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status === 201) {
        setRequestsData([]);
        setSelectedRequests([]);
        refreshRequestData();
        // setOpenAddRequestSider(false);
        showSuccessToast(response.data.message);
      } else {
        showErrorToast(response.data.message);
      }
      setButtonLoading(false);
    } catch {
      setButtonLoading(false);
      showErrorToast("An error occurred. Please contact administrator.");
    }
  };

  // Function to handle adding a new request
  const handleEditRequest = async () => {
    try {
      setButtonLoading(true);
      requestData.userID = jwtDecode(token).userID;
      const response = await axios.put(
        `${baseUrl}/requests/${requestData.requestID}`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.data.status === 200) {
        setRequestsData([]);
        setSelectedRequests([]);
        refreshRequestData();
        setOpenEditRequestSider(false);
        showSuccessToast(response.data.message);
      } else {
        showErrorToast(response.data.message);
      }
      setButtonLoading(false);
    } catch {
      setButtonLoading(false);
      showErrorToast("An error occurred. Please contact administrator.");
    }
  };

  const handleCancelRequests = async () => {};

  return (
    <div className="page-container">
      <p className="page-header">Requests</p>

      <div className="view-info-container">
        <div className="view-info-inputs-container">
          <div className="view-info-inputs-left-container">
            <div className="view-info-input">
              <input type="text" placeholder="Search" />
            </div>
            {/* <button className="view-info-input-icon-button">
                    <FilterIcon />
                  </button> */}
          </div>

          <div className="view-info-inputs-right-container">
            <div className="view-info-buttons-list">
              <button
                onClick={() => {
                  selectedRequests.length === 1 &&
                    setOpenRequestInfoSider(true);
                }}
                className={`primary-button view-info-buttons-list-first-button${
                  selectedRequests.length !== 1 ? " disabled-button" : ""
                }`}
              >
                <InfoIcon />
              </button>
              <button
                onClick={() => {
                  selectedRequests.length === 1 &&
                    setOpenEditRequestSider(true);
                }}
                className={`primary-button view-info-buttons-list-middle-button${
                  selectedRequests.length !== 1 ? " disabled-button" : ""
                }`}
              >
                <EditIcon />
              </button>
              <button
                onClick={() => {
                  selectedRequests.length >= 1 && setOpenConfirmModal(true);
                }}
                className={`primary-button view-info-buttons-list-last-button${
                  selectedRequests.length < 1 ? " disabled-button" : ""
                }`}
              >
                <InActivateIcon />
              </button>
            </div>

            <div className="view-info-input">
              <button
                className="primary-button"
                onClick={() => setOpenAddRequestSider(true)}
              >
                <AddIcon />
                New Request
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <Loaders />
        ) : !loading && requestsData.length === 0 ? (
          <NoData />
        ) : (
          <div className="view-info-table-container">
            <table className="view-info-table">
              <thead>
                <tr>
                  <td>
                    <input
                      type="checkbox"
                      onChange={handleSelectAllRequests}
                      checked={selectedRequests.length === requestData.length}
                    />
                  </td>
                  <td>Request ID</td>
                  <td>Request Type</td>
                  <td>From Date</td>
                  <td>To Date</td>
                  <td>Total Days</td>
                  <td>Status</td>
                </tr>
              </thead>
              <tbody>
                {requestsData.map((request) => (
                  <tr key={request.requestID}>
                    <td>
                      <input
                        type="checkbox"
                        onChange={() => handleSelectRequests(request.requestID)}
                        checked={selectedRequests.includes(request.requestID)}
                      />
                    </td>
                    <td>{request.requestID}</td>
                    <td>{formatTags(request.requestType)}</td>
                    <td>{formatDate(request.fromDate)}</td>
                    <td>{formatDate(request.toDate)}</td>
                    <td>{request.days}</td>
                    <td>{formatTags(request.status)}</td>
                  </tr>
                ))}
                {rowLoading && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
                      <span className="view-info-table-data-loader"></span>
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="7">
                    <div className="view-info-table-footer-container">
                      <div className="view-info-table-footer-left-container">
                        <button
                          onClick={handleLoadRequests}
                          className={
                            requestsData.length >= totalRecords
                              ? "view-info-table-footer-left-container-button-disabled"
                              : "view-info-table-footer-left-container-button"
                          }
                        >
                          <LoadIcon />
                          Load More
                        </button>
                      </div>
                      <div className="view-info-table-footer-right-container">
                        <p>
                          Showing <span>{requestsData.length}</span> User
                          Entries
                        </p>
                        <select
                          type="number"
                          value={pageSize}
                          onChange={() => {
                            setPageSize(event.target.value);
                            setPageNumber(1);
                            setRequestsData([]);
                          }}
                        >
                          <option value="10">10</option>
                          <option value="25">25</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                        </select>
                      </div>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Side tab for adding or editing request */}
      <SideTab
        open={openAddRequestSider || openEditRequestSider}
        setOpen={
          openAddRequestSider ? setOpenAddRequestSider : setOpenEditRequestSider
        }
        title={openAddRequestSider ? "Add New Request" : "Edit Request"}
        footer={
          <button
            className="primary-button"
            onClick={openAddRequestSider ? handleAddRequest : handleEditRequest}
            disabled={buttonLoading}
          >
            {buttonLoading ? (
              <span className="button-loader"></span>
            ) : (
              <>
                Submit
                <SubmitIcon />
              </>
            )}
          </button>
        }
      >
        <RequestForm
          requestID={selectedRequests ? selectedRequests[0] : null}
          requestData={requestData}
          setRequestData={setRequestData}
        />
      </SideTab>

      {/* Side tab to view request information*/}
      <SideTab
        open={openRequestInfoSider}
        setOpen={setOpenRequestInfoSider}
        title="View Request Information"
      >
        <RequestDetails
          requestID={
            openRequestInfoSider && selectedRequests && selectedRequests[0]
          }
          requestData={requestData}
          setRequestData={setRequestData}
        />
      </SideTab>

      {/* Confirm Modal to inactivate selected users */}
      <ConfirmModal
        open={openConfirmModal}
        title={"Cancel Requests"}
        message={"Are you sure to cancel the selected requests?"}
        onClose={() => setOpenConfirmModal(false)}
        onConfirm={handleCancelRequests}
        loading={buttonLoading}
      />
    </div>
  );
}
