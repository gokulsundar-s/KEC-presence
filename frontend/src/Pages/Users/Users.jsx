import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { baseUrl } from "../../Utils/Constants";
import {
  showErrorToast,
  showSuccessToast,
} from "../../Components/Alerts/Alert";
import { Loaders } from "../../Components/Loaders/Loaders";
import { ConfirmModal } from "../../Components/Modals/Modals";
import SideTab from "../../Components/SiderTab/SideTab";
import NoData from "../../Components/NoData/NoData";
import UsersDetails from "./Components/UsersDetails/UsersDetails";
import UsersForm from "./Components/UsersForm/UsersForm";
import ExportUsersData from "./Components/ExportUsersData/ExportUsersData";
import { DataExporter } from "../../Utils/DataExporter";
import { formatTags } from "../../Utils/Formatters";
import {
  FilterIcon,
  AddIcon,
  InfoIcon,
  EditIcon,
  InActivateIcon,
  ExportIcon,
  SubmitIcon,
  LoadIcon,
} from "../../Assets/Icons";

export default function UserInfo() {
  const navigate = useNavigate();

  // State variables for data handling
  const [token, setToken] = useState("");
  const [usersData, setUsersData] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [userData, setUserData] = useState({
    userType: "",
    department: "",
    name: "",
    rollNumber: "",
    year: "",
    section: "",
    mail: "",
    phoneNumber: "",
    parentMail: "",
    parentPhone: "",
  });
  const [exportData, setExportData] = useState({
    userType: "",
    department: "",
    year: "",
    section: "",
    status: "",
  });

  // State variable for controlling drawer visibility
  const [openAddUserSider, setOpenAddUserSider] = useState(false);
  const [openUserInfoSider, setOpenUserInfoSider] = useState(false);
  const [openEditUserSider, setOpenEditUserSider] = useState(false);
  const [openExportDataSider, setOpenExportDataSider] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  // State variable for loaders
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [rowLoading, setRowLoading] = useState(false);

  // useEffect to check authentication token and fetch user data
  useEffect(() => {
    const tokenValue = Cookies.get("token");
    if (!tokenValue) {
      navigate("/login");
      return;
    }
    setToken(tokenValue);
  }, [navigate]);

  // Fetch user data when token is set
  useEffect(() => {
    if (token) {
      getUserData();
    }
  }, [token, pageNumber, pageSize]);

  // Reset user data form when add/edit sider is closed
  useEffect(() => {
    if (!openEditUserSider && !openUserInfoSider && !openAddUserSider)
      setUserData({
        userType: "",
        department: "",
        name: "",
        rollNumber: "",
        year: "",
        section: "",
        mail: "",
        phoneNumber: "",
        parentMail: "",
        parentPhone: "",
      });
  }, [openAddUserSider, openEditUserSider, openUserInfoSider]);

  // Reset export data filters when export sider is closed
  useEffect(() => {
    setExportData({
      userType: "",
      department: "",
      year: "",
      section: "",
      status: "",
    });
  }, [openExportDataSider]);

  // Function to update the selected users list
  const handleSelectUser = (userID) => {
    if (selectedUsers.includes(userID)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userID));
    } else {
      setSelectedUsers([...selectedUsers, userID]);
    }
  };

  // Function to select or deselect all users
  const handleSelectAllUsers = () => {
    if (selectedUsers.length === usersData.length) {
      setSelectedUsers([]);
    } else {
      const allUserIDs = usersData.map((user) => user.userID);
      setSelectedUsers(allUserIDs);
    }
  };

  // Function to load more users based on pagination
  const handleLoadUsers = () => {
    setPageNumber(pageNumber + 1);
  };

  // Refresh users data
  const refreshUsersData = async () => {
    const response = await axios.get(`${baseUrl}/users`, {
      params: {
        pageNumber: 1,
        pageSize: pageSize,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data.status === 200) {
      setUsersData(response.data.data.data);
      setTotalRecords(response.data.data.total);
    }
  };

  // Function to fetch all the users info
  const getUserData = async () => {
    try {
      if (usersData.length > 0) {
        setRowLoading(true);
      } else {
        setLoading(true);
      }
      const response = await axios.get(`${baseUrl}/users`, {
        params: {
          pageNumber: pageNumber,
          pageSize: pageSize,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status === 200) {
        setUsersData([...usersData, ...response.data.data.data]);
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

  // Function to add a new user
  const handleAddUser = async () => {
    try {
      setButtonLoading(true);
      const response = await axios.post(`${baseUrl}/users`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status === 201) {
        setUsersData([]);
        setSelectedUsers([]);
        refreshUsersData();
        setOpenAddUserSider(false);
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

  // Function to edit a user information
  const handleEditUser = async () => {
    try {
      setButtonLoading(true);
      const response = await axios.put(
        `${baseUrl}/users/${userData.userID}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.data.status === 200) {
        setUsersData([]);
        setSelectedUsers([]);
        refreshUsersData();
        setOpenEditUserSider(false);
        setButtonLoading(false);
        showSuccessToast(response.data.message);
      } else {
        showErrorToast(response.data.message);
        setButtonLoading(false);
      }
    } catch {
      setButtonLoading(false);
      showErrorToast("An error occurred. Please contact administrator.");
    }
  };

  // Function to inactivate selected users
  const handleInactivateUsers = async () => {
    try {
      const response = await axios.put(
        `${baseUrl}/users/inactivate`,
        { userID: selectedUsers },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.data.status === 200) {
        setUsersData([]);
        setSelectedUsers([]);
        refreshUsersData();
        setOpenConfirmModal(false);
        setButtonLoading(false);
        showSuccessToast(response.data.message);
      } else {
        showErrorToast(response.data.message);
        setButtonLoading(false);
      }
    } catch {
      setButtonLoading(false);
      showErrorToast("An error occurred. Please contact administrator.");
    }
  };

  // Function to export users data based on filters
  const handleExportData = async () => {
    try {
      setButtonLoading(true);
      const response = await axios.get(`${baseUrl}/users/export`, {
        params: exportData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status === 200) {
        setOpenExportDataSider(false);
        setButtonLoading(false);
        DataExporter({
          fileName: "Users_Data",
          data: response.data.data,
        });
      } else {
        showErrorToast(response.data.message);
        setButtonLoading(false);
      }
    } catch {
      setButtonLoading(false);
      showErrorToast("An error occurred. Please contact administrator.");
    }
  };

  return (
    <div className="page-container">
      <p className="page-header">Users Information</p>

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
                  selectedUsers.length === 1 && setOpenUserInfoSider(true);
                }}
                className={`primary-button view-info-buttons-list-first-button${
                  selectedUsers.length !== 1 ? " disabled-button" : ""
                }`}
              >
                <InfoIcon />
              </button>
              <button
                onClick={() => {
                  selectedUsers.length === 1 && setOpenEditUserSider(true);
                }}
                className={`primary-button view-info-buttons-list-middle-button${
                  selectedUsers.length !== 1 ? " disabled-button" : ""
                }`}
              >
                <EditIcon />
              </button>
              <button
                onClick={() => {
                  selectedUsers.length >= 1 && setOpenConfirmModal(true);
                }}
                className={`primary-button view-info-buttons-list-last-button${
                  selectedUsers.length < 1 ? " disabled-button" : ""
                }`}
              >
                <InActivateIcon />
              </button>
            </div>

            <div className="view-info-input">
              <button
                onClick={() => setOpenExportDataSider(true)}
                className="primary-button"
              >
                <ExportIcon />
                Export Data
              </button>
            </div>

            <div className="view-info-input">
              <button
                className="primary-button"
                onClick={() => setOpenAddUserSider(true)}
              >
                <AddIcon />
                New User
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <Loaders />
        ) : usersData.length === 0 ? (
          <NoData />
        ) : (
          <div className="view-info-table-container">
            <table className="view-info-table">
              <thead>
                <tr>
                  <td>
                    <input
                      type="checkbox"
                      onChange={handleSelectAllUsers}
                      checked={selectedUsers.length === usersData.length}
                    />
                  </td>
                  <td>Name</td>
                  <td>User ID</td>
                  <td>User Type</td>
                  <td>Kongu Mail</td>
                  <td>Status</td>
                </tr>
              </thead>
              <tbody>
                {usersData.map((user) => (
                  <tr key={user.userID}>
                    <td>
                      <input
                        type="checkbox"
                        onChange={() => handleSelectUser(user.userID)}
                        checked={selectedUsers.includes(user.userID)}
                      />
                    </td>
                    <td>
                      {user.name.length > 30
                        ? user.name.slice(0, 30) + "..."
                        : user.name}
                    </td>
                    <td>{user.userID}</td>
                    <td>{formatTags(user.userType)}</td>
                    <td>
                      {user.mail.length > 35
                        ? `${user.mail.substring(0, 15)}...${user.mail.substring(user.mail.length - 12)}`
                        : user.mail}
                    </td>
                    <td>
                      <p>{formatTags(user.isActive ? "Active" : "Inactive")}</p>
                    </td>
                  </tr>
                ))}
                {rowLoading && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      <span className="view-info-table-data-loader"></span>
                    </td>
                  </tr>
                )}
              </tbody>

              <tfoot>
                <tr>
                  <td colSpan="6">
                    <div className="view-info-table-footer-container">
                      <div className="view-info-table-footer-left-container">
                        <button
                          onClick={handleLoadUsers}
                          className={
                            usersData.length >= totalRecords
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
                          Showing <span>{usersData.length}</span> User Entries
                        </p>
                        <select
                          type="number"
                          value={pageSize}
                          onChange={() => {
                            setPageSize(event.target.value);
                            setPageNumber(1);
                            setUsersData([]);
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

      {/* Side tab for adding or editing user */}
      <SideTab
        open={openAddUserSider || openEditUserSider}
        setOpen={openAddUserSider ? setOpenAddUserSider : setOpenEditUserSider}
        title={openAddUserSider ? "Add New User" : "Edit User Information"}
        footer={
          <button
            className="primary-button"
            onClick={openAddUserSider ? handleAddUser : handleEditUser}
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
        <UsersForm
          userID={openEditUserSider && selectedUsers && selectedUsers[0]}
          userData={userData}
          setUserData={setUserData}
        />
      </SideTab>

      {/* Side tab to view user information*/}
      <SideTab
        open={openUserInfoSider}
        setOpen={setOpenUserInfoSider}
        title="View User Information"
      >
        <UsersDetails
          userID={openUserInfoSider && selectedUsers && selectedUsers[0]}
          userData={userData}
          setUserData={setUserData}
        />
      </SideTab>

      {/* Side tab for exporting user data */}
      <SideTab
        open={openExportDataSider}
        setOpen={setOpenExportDataSider}
        title="Export Users Data"
        footer={
          <button
            className="primary-button"
            onClick={handleExportData}
            disabled={buttonLoading}
          >
            {buttonLoading ? (
              <span className="button-loader"></span>
            ) : (
              <>
                Export Data
                <SubmitIcon />
              </>
            )}
          </button>
        }
      >
        <ExportUsersData
          exportData={exportData}
          setExportData={setExportData}
        />
      </SideTab>

      {/* Confirm Modal to inactivate selected users */}
      <ConfirmModal
        open={openConfirmModal}
        title={"Inactivate Users"}
        message={"Are you sure to inactivate the selected users?"}
        onClose={() => setOpenConfirmModal(false)}
        onConfirm={handleInactivateUsers}
        loading={buttonLoading}
      />
    </div>
  );
}
