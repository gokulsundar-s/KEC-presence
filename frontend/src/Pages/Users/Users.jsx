import { useState, useEffect, use } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../Utils/Constants";
import { showErrorToast } from "../../Components/Alerts/Alert";
import { Loaders } from "../../Components/Loaders/Loaders";
import { ConfirmModal } from "../../Components/Modals/Modals";
import SideTab from "../../Components/SiderTab/SideTab";
import NoData from "../../Components/NoData/NoData";
import UsersDetails from "./Components/UsersDetails/UsersDetails";
import UsersForm from "./Components/UsersForm/UsersForm";
import ExportUsersData from "./Components/ExportUsersData/ExportUsersData";
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

  // State variable for controlling drawer visibility
  const [openAddUserSider, setOpenAddUserSider] = useState(false);
  const [openUserInfoSider, setOpenUserInfoSider] = useState(false);
  const [openEditUserSider, setOpenEditUserSider] = useState(false);
  const [openExportDataSider, setOpenExportDataSider] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  // State variable for loaders
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

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
  }, [token]);

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

  // Function to fetch all the users info
  const getUserData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status === 200) {
        setUsersData(response.data.data);
      } else {
        showErrorToast(response.data.message);
      }
      setLoading(false);
    } catch {
      showErrorToast("An error occurred. Please contact administrator.");
      setLoading(false);
    }
  };

  // State variables for adding user
  const handleAddUser = async () => {
    try {
      setAddLoading(true);
      const response = await axios.post(`${baseUrl}/users`, userData);
      if (response.data.status === 200) {
        getUserData();
        setOpenAddUserSider(false);
        setAddLoading(false);
        setAddUserModal(true);
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
      } else {
        showErrorToast(response.data.message);
        setAddLoading(false);
      }
    } catch {
      setAddLoading(false);
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
            <button className="view-info-input-icon-button">
              <FilterIcon />
            </button>
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
                onClick={() => setOpenConfirmModal(true)}
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
                  <td>User ID</td>
                  <td>User Type</td>
                  <td>Department</td>
                  <td>Name</td>
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
                    <td>{user.userID}</td>
                    <td>{user.userType === "STU" ? "Student" : "Admin"}</td>
                    <td>
                      {user.department === "CSE"
                        ? "Computer Science and Engineering"
                        : "Information Technology"}
                    </td>
                    <td>{user.name}</td>
                    <td>
                      {user.isActive ? (
                        <p style={{ color: "green" }}>Active</p>
                      ) : (
                        <p style={{ color: "red" }}>Inactive</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr>
                  <td colSpan="6">
                    <div className="view-info-table-footer-container">
                      <button className="">
                        <LoadIcon />
                        Load More
                      </button>
                      <p>
                        Showing <span>{usersData.length}</span> User Entries
                      </p>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Side tab for adding new user */}
      <SideTab
        open={openAddUserSider || openEditUserSider}
        setOpen={openAddUserSider ? setOpenAddUserSider : setOpenEditUserSider}
        title={openAddUserSider ? "Add New User" : "Edit User Information"}
        footer={
          <button
            className="primary-button"
            onClick={handleAddUser}
            disabled={addLoading}
          >
            {addLoading ? (
              <span className="login-button-loader"></span>
            ) : (
              <>
                Submit
                <SubmitIcon />
              </>
            )}
          </button>
        }
      >
        <UsersForm userData={userData} setUserData={setUserData} />
      </SideTab>

      {/* Side tab for editing user information*/}
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
          <button className="primary-button" onClick={{}} disabled={{}}>
            {addLoading ? (
              <span className="login-button-loader"></span>
            ) : (
              <>
                Export
                <ExportIcon />
              </>
            )}
          </button>
        }
      >
        <ExportUsersData />
      </SideTab>

      {/* Confirm Modal to inactivate selected users */}
      <ConfirmModal
        open={openConfirmModal}
        title={"Inactivate Users"}
        message={"Are you sure to inactivate the selected users?"}
        onClose={() => setOpenConfirmModal(false)}
        onConfirm={{}}
        loading={false}
      />
    </div>
  );
}
