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
import ViewUserInfo from "./Components/ViewUserInfo/ViewUserInfo";
import EditUserInfo from "./Components/EditUserInfo/EditUserInfo";

export default function UserInfo() {
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [openSider, setOpenSider] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUserInfo, setEditUserInfo] = useState(false);
  const [deleteUser, setDeleteUser] = useState(false);

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
    } catch (error) {
      showErrorToast("An error occurred. Please contact administrator.");
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const handleDeleteUser = async () => {
    try {
      setDeleteLoading(true);
      const response = await axios.delete(`${baseUrl}/users/${selectedUser}`);
      if (response.data.status === 200) {
        showSuccessToast(response.data.message);
        getUserData();
        setDeleteUser(false);
        setOpenSider(false);
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
            <p>Department</p>
            <select>
              <option value="all">All</option>
              <option value="cse">Computer Science and Engineering</option>
              <option value="eee">
                Electrical and Electronics Engineering
              </option>
              <option value="me">Mechanical Engineering</option>
            </select>
          </div>

          <div className="view-info-input">
            <p>Search</p>
            <input type="text" placeholder="Search" />
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
                          setOpenSider(true);
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
        open={openSider}
        setOpen={setOpenSider}
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
                <button className="primary-button">Update</button>
              </div>
            )}
          </>
        }
      >
        {editUserInfo ? (
          <EditUserInfo userID={selectedUser} />
        ) : (
          <ViewUserInfo userID={selectedUser} />
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
    </div>
  );
}
