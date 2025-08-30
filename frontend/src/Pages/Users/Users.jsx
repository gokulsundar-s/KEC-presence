import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../Utils/Constants";
import {
  showErrorToast,
  showSuccessToast,
} from "../../Components/Alerts/Alert";
import { ConfirmModal } from "../../Components/Modals/Modals";
import SideTab from "../../Components/SiderTab/SideTab";
import NoData from "../../Components/NoData/NoData";
import Loaders from "../../Components/Loaders/Loaders";
import UsersDetails from "./Components/UsersDetails/UsersDetails";
import UsersForm from "./Components/UsersForm/UsersForm";
import AddBulkUser from "./Components/AddBulkUser/AddBulkUser";
import { SuccessModal, BulkAddModal } from "../../Components/Modals/Modals";

export default function UserInfo() {
  const [usersData, setUsersData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openInfoSider, setOpenInfoSider] = useState(false);
  const [openAddUserSider, setOpenAddUserSider] = useState(false);
  const [openBulkAddUser, setOpenBulkAddUser] = useState(false);
  const [editUserInfo, setEditUserInfo] = useState(false);
  const [deleteUser, setDeleteUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [addUserModal, setAddUserModal] = useState(false);
  const [bulkAddUserModal, setBulkAddUserModal] = useState(false);
  const [bulkUserData, setBulkUserData] = useState([]);
  const [bulkUserDataRes, setBulkUserDataRes] = useState();
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

  const getUserData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/users`);
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

  const handleEditUser = async () => {
    try {
      setEditLoading(true);
      const response = await axios.put(
        `${baseUrl}/users/${selectedUser}`,
        userData
      );
      if (response.data.status === 200) {
        getUserData();
        setOpenInfoSider(false);
        setEditUserInfo(false);
        setSelectedUser(null);
        setEditLoading(false);
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
        setEditLoading(false);
      }
    } catch (error) {
      setEditLoading(false);
      showErrorToast("An error occurred. Please contact administrator.");
    }
  };

  const handleDeleteUser = async () => {
    try {
      setDeleteLoading(true);
      const response = await axios.delete(`${baseUrl}/users/${selectedUser}`);
      if (response.data.status === 200) {
        showSuccessToast(response.data.message);
        getUserData();
        setDeleteUser(false);
        setOpenInfoSider(false);
        setSelectedUser(null);
        setDeleteLoading(false);
      } else {
        setDeleteLoading(false);
        showErrorToast(response.data.message);
      }
    } catch (error) {
      setDeleteLoading(false);
      showErrorToast("An error occurred. Please contact administrator.");
    }
  };

  const handleAddBulkUser = async () => {
    try {
      if (bulkUserData.length === 0) {
        showErrorToast("Please upload a file to continue.");
        return;
      }
      setAddLoading(true);
      const response = await axios.post(
        `${baseUrl}/users/bulk-users`,
        bulkUserData
      );
      setBulkUserDataRes(response.data.data);
      setAddLoading(false);
      setOpenAddUserSider(false);
      setBulkAddUserModal(true);
    } catch {
      setAddLoading(false);
      showErrorToast("An error occurred. Please contact administrator.");
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    setEditUserInfo(!openInfoSider);
    setOpenBulkAddUser(!openAddUserSider);
    if (!openInfoSider) {
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
      setSelectedUser(null);
    }
    if (openAddUserSider) {
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
      setBulkUserDataRes(null);
    }
  }, [openInfoSider, openAddUserSider]);

  return (
    <div className="page-container">
      <p className="page-header">Users Information</p>

      <div className="view-info-container">
        <div className="view-info-inputs-container">
          <div className="view-info-input">
            <p>User Type</p>
            <select>
              <option value="all">All</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="guest">Guest</option>
            </select>
          </div>

          <div className="view-info-input">
            <p>Search</p>
            <input type="text" placeholder="Search" />
          </div>

          <div className="view-info-input">
            <button
              className="primary-button"
              onClick={() => setOpenAddUserSider(true)}
            >
              Add User
            </button>
          </div>
        </div>

        <div className="view-info-table-container">
          {loading ? (
            <Loaders />
          ) : usersData.length === 0 ? (
            <NoData />
          ) : (
            <table className="view-info-table">
              <thead>
                <tr>
                  <td>User ID</td>
                  <td>User Type</td>
                  <td>Department</td>
                  <td>Name</td>
                  <td>Actions</td>
                </tr>
              </thead>
              <tbody>
                {usersData.map((user) => (
                  <tr key={user.userID}>
                    <td>{user.userID}</td>
                    <td>{user.userType === "STU" ? "Student" : "Admin"}</td>
                    <td>
                      {user.department === "CSE"
                        ? "Computer Science and Engineering"
                        : "Information Technology"}
                    </td>
                    <td>{user.name}</td>
                    <td>
                      <button
                        className="details-button"
                        onClick={() => {
                          setOpenInfoSider(true);
                          setSelectedUser(user.userID);
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
      </div>

      <SideTab
        open={openInfoSider}
        setOpen={setOpenInfoSider}
        title={editUserInfo ? "Edit User Information" : "User Information"}
        footer={
          <>
            {!editUserInfo ? (
              <div>
                <button
                  className="secondary-button"
                  onClick={() => setDeleteUser(true)}
                >
                  Delete
                </button>
                <button
                  className="primary-button"
                  onClick={() => setEditUserInfo(true)}
                >
                  Edit
                </button>
              </div>
            ) : (
              <div>
                <button
                  className="secondary-button"
                  onClick={() => setEditUserInfo(false)}
                >
                  Back
                </button>
                <button
                  className="primary-button"
                  onClick={handleEditUser}
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
        {editUserInfo ? (
          <UsersForm userData={userData} setUserData={setUserData} />
        ) : (
          <UsersDetails
            userID={selectedUser}
            userData={userData}
            setUserData={setUserData}
          />
        )}
      </SideTab>

      <SideTab
        open={openAddUserSider}
        setOpen={setOpenAddUserSider}
        title={openBulkAddUser ? "Add Bulk Users" : "Add New User"}
        footer={
          <>
            {openBulkAddUser ? (
              <div>
                <button
                  className="secondary-button"
                  onClick={() => setOpenBulkAddUser(false)}
                >
                  Back
                </button>

                <button
                  className="primary-button"
                  onClick={handleAddBulkUser}
                  disabled={addLoading}
                >
                  {addLoading ? (
                    <span className="login-button-loader"></span>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            ) : (
              <div>
                <button
                  className="secondary-button"
                  onClick={() => setOpenBulkAddUser(true)}
                >
                  Add Bulk Users
                </button>

                <button
                  className="primary-button"
                  onClick={handleAddUser}
                  disabled={addLoading}
                >
                  {addLoading ? (
                    <span className="login-button-loader"></span>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            )}
          </>
        }
      >
        {openBulkAddUser ? (
          <AddBulkUser setBulkUserData={setBulkUserData} />
        ) : (
          <UsersForm userData={userData} setUserData={setUserData} />
        )}
      </SideTab>

      {deleteUser && (
        <ConfirmModal
          title="Confirm Deletion"
          message="Are you sure you want to delete this user?"
          onConfirm={handleDeleteUser}
          onClose={() => setDeleteUser(false)}
          loading={deleteLoading}
        />
      )}

      {addUserModal && (
        <SuccessModal
          message={"Your new user has been added successfully."}
          onClose={() => {
            setAddUserModal(false);
          }}
        />
      )}

      {bulkAddUserModal && (
        <BulkAddModal
          data={bulkUserDataRes}
          onClose={() => {
            setBulkAddUserModal(false);
          }}
        />
      )}
    </div>
  );
}
