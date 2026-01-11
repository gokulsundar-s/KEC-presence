import { useState, useEffect, use } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../Utils/Constants";
import {
  showErrorToast,
  showSuccessToast,
} from "../../Components/Alerts/Alert";
import { Loaders } from "../../Components/Loaders/Loaders";
import { formatDateTime } from "../../Utils/Formatters";
import NoData from "../../Components/NoData/NoData";
import { ConfirmModal } from "../../Components/Modals/Modals";
import SideTab from "../../Components/SiderTab/SideTab";
import SesssioDetails from "./Components/SessionDetails/SessionDetails";
import {
  FilterIcon,
  InfoIcon,
  InActivateIcon,
  LoadIcon,
} from "../../Assets/Icons";

export default function Sessions() {
  const navigate = useNavigate();

  // State variables for data handling
  const [token, setToken] = useState("");
  const [sessionsData, setSessionsData] = useState([]);
  const [selectedSessions, setSelectedSessions] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  // State variable for controlling drawer visibility
  const [openSessionDetailsSider, setOpenSessionDetailsSider] = useState(false);
  const [openInactivateModal, setOpenInactivateModal] = useState(false);
  const [openInactivateAllModal, setOpenInactivateAllModal] = useState(false);

  // State variable for loaders
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [rowLoading, setRowLoading] = useState(false);

  // useEffect to check authentication token and fetch user session data
  useEffect(() => {
    const tokenValue = Cookies.get("token");
    if (!tokenValue) {
      navigate("/login");
      return;
    }
    setToken(tokenValue);
  }, [navigate]);

  // Fetch user session data when token is set
  useEffect(() => {
    if (token) {
      getSessionData();
    }
  }, [token, pageNumber, pageSize]);

  // Function to update the selected sessions list
  const handleSelectSession = (session) => {
    if (selectedSessions.includes(session)) {
      setSelectedSessions(selectedSessions.filter((s) => s !== session));
    } else {
      setSelectedSessions([...selectedSessions, session]);
    }
  };

  // Function to select or deselect all sessions
  const handleSelectAllSessions = () => {
    if (selectedSessions.length === sessionsData.length) {
      setSelectedSessions([]);
    } else {
      const allSessions = sessionsData.map((session) => session);
      setSelectedSessions(allSessions);
    }
  };

  // Function to load more sessions based on pagination
  const handleLoadSessions = () => {
    setPageNumber(pageNumber + 1);
  };

  // Refresh sessions data
  const refreshSessionData = async () => {
    const response = await axios.get(`${baseUrl}/users/sessions`, {
      params: {
        pageNumber: 1,
        pageSize: pageSize,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data.status === 200) {
      setSessionsData(response.data.data.data);
      setTotalRecords(response.data.data.total);
    }
  };

  // Function to fetch session data
  const getSessionData = async () => {
    try {
      if (sessionsData.length > 0) {
        setRowLoading(true);
      } else {
        setLoading(true);
      }
      const response = await axios.get(`${baseUrl}/users/sessions`, {
        params: {
          pageNumber: pageNumber,
          pageSize: pageSize,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status === 200) {
        setSessionsData([...sessionsData, ...response.data.data.data]);
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

  // Function to inactivate selected sessions
  const handleInactivateSessions = async () => {
    try {
      setButtonLoading(true);
      const sessionID = selectedSessions.map((session) => session._id);
      const response = await axios.put(
        `${baseUrl}/users/sessions/inactivate`,
        {
          sessionID: sessionID,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status === 200) {
        setSessionsData([]);
        setPageNumber(1);
        setSelectedSessions([]);
        refreshSessionData();
        setOpenInactivateModal(false);
      } else {
        showErrorToast(response.data.message);
      }
      setButtonLoading(false);
    } catch {
      showErrorToast("An error occurred. Please contact administrator.");
      setButtonLoading(false);
    }
  };

  // Function to inactivate selected sessions
  const handleInactivateAllSessions = async () => {
    try {
      setButtonLoading(true);
      const response = await axios.put(
        `${baseUrl}/users/sessions/inactivateAll`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status === 200) {
        setSessionsData([]);
        setPageNumber(1);
        setSelectedSessions([]);
        refreshSessionData();
        setOpenInactivateAllModal(false);
        showSuccessToast(response.data.message);
      } else {
        showErrorToast(response.data.message);
      }
      setButtonLoading(false);
    } catch {
      showErrorToast("An error occurred. Please contact administrator.");
      setButtonLoading(false);
    }
  };

  return (
    <div className="page-container">
      <p className="page-header">User Sessions</p>

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
                  selectedSessions.length === 1 &&
                    setOpenSessionDetailsSider(true);
                }}
                className={`primary-button view-info-buttons-list-first-button${
                  selectedSessions.length !== 1 ? " disabled-button" : ""
                }`}
              >
                <InfoIcon />
              </button>
              <button
                onClick={() => {
                  selectedSessions.length >= 1 && setOpenInactivateModal(true);
                }}
                className={`primary-button view-info-buttons-list-last-button${
                  selectedSessions.length < 1 ? " disabled-button" : ""
                }`}
              >
                <InActivateIcon />
              </button>
            </div>
            <div className="view-info-input">
              <button
                onClick={() => setOpenInactivateAllModal(true)}
                className="primary-button"
              >
                <InActivateIcon />
                Inactivate All Sessions
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <Loaders />
        ) : sessionsData.length === 0 ? (
          <NoData />
        ) : (
          <div className="view-info-table-container">
            <table className="view-info-table">
              <thead>
                <tr>
                  <td>
                    <input
                      type="checkbox"
                      onChange={handleSelectAllSessions}
                      checked={selectedSessions.length === sessionsData.length}
                    />
                  </td>
                  <td>User ID</td>
                  <td>IP Address</td>
                  <td>Login Time</td>
                  <td>Logout Time</td>
                  <td>Status</td>
                </tr>
              </thead>
              <tbody>
                {sessionsData.map((session) => (
                  <tr key={session.sessionID}>
                    <td>
                      <input
                        type="checkbox"
                        onChange={() => handleSelectSession(session)}
                        checked={selectedSessions.includes(session)}
                      />
                    </td>
                    <td>{session.userID}</td>
                    <td>{session.ipAddress}</td>
                    <td>{formatDateTime(session.loginTime)}</td>
                    <td>{formatDateTime(session.logoutTime)}</td>
                    <td>
                      <p
                        className={
                          session.isActive ? "active-text" : "inactive-text"
                        }
                      >
                        {session.isActive ? "Active" : "Inactive"}
                      </p>
                    </td>
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
                          onClick={handleLoadSessions}
                          className={
                            sessionsData.length >= totalRecords
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
                          Showing <span>{sessionsData.length}</span> Session
                          Entries
                        </p>
                        <select
                          type="number"
                          value={pageSize}
                          onChange={(event) => {
                            setPageSize(event.target.value);
                            setPageNumber(1);
                            setSessionsData([]);
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

      {/* Side tab for editing user information*/}
      <SideTab
        open={openSessionDetailsSider}
        setOpen={setOpenSessionDetailsSider}
        title="View User Information"
      >
        <SesssioDetails sessionData={selectedSessions[0]} />
      </SideTab>

      {/* Confirm Modal for inactivating sessions */}
      <ConfirmModal
        open={openInactivateModal}
        setOpen={setOpenInactivateModal}
        title="Inactivate Sessions"
        message={`Are you sure to inactivate the sessions?`}
        onClose={() => setOpenInactivateModal(false)}
        onConfirm={handleInactivateSessions}
        loading={buttonLoading}
      />

      {/* Confirm Modal for inactivating all sessions */}
      <ConfirmModal
        open={openInactivateAllModal}
        setOpen={setOpenInactivateAllModal}
        title="Inactivate All Sessions"
        message={`Are you sure to inactivate all the sessions?`}
        onClose={() => setOpenInactivateAllModal(false)}
        onConfirm={handleInactivateAllSessions}
        loading={buttonLoading}
      />
    </div>
  );
}
