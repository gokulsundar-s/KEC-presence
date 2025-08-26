import { useState } from "react";
import ViewConfigs from "./Components/ViewConfigs/ViewConfigs";
import EditConfigs from "./Components/EditConfigs/EditConfigs";
import SideTab from "../../Components/SiderTab/SideTab";
import NoData from "../../Components/NoData/NoData";
import Loaders from "../../Components/Loaders/Loaders";
import "./Configs.css";

export default function Configs() {
  const [configsData, setConfigsData] = useState([
    {
      parentCode: "Department",
      code: "CSE",
      description: "Computer Science and Engineering",
    },
    {
      parentCode: "Department",
      code: "ECE",
      description: "Electronics and Communication Engineering",
    },
    {
      parentCode: "Department",
      code: "ME",
      description: "Mechanical Engineering",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [openSider, setOpenSider] = useState(false);
  const [editConfigs, setEditConfigs] = useState(false);
  const [addConfigs, setAddConfigs] = useState(false);

  return (
    <div className="page-container">
      <p className="page-header">Configurations</p>

      <div className="view-info-container">
        <div className="view-info-inputs-container">
          <div className="view-info-input">
            <p>Code Type</p>
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
              onClick={() => setAddConfigs(true)}
            >
              Add Config
            </button>
          </div>
        </div>

        <div className="view-info-table-container">
          {loading ? (
            <Loaders />
          ) : configsData.length === 0 ? (
            <NoData />
          ) : (
            <table className="view-info-table">
              <thead>
                <tr>
                  <td>Code Type</td>
                  <td>Code</td>
                  <td>Description</td>
                  <td>Action</td>
                </tr>
              </thead>
              <tbody>
                {configsData.map((config, index) => (
                  <tr key={index}>
                    <td>{config.parentCode}</td>
                    <td>{config.code}</td>
                    <td>{config.description}</td>
                    <td>
                      <button
                        className="details-button"
                        onClick={() => setOpenSider(true)}
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
        title={editConfigs ? "Edit Configurations" : "Configurations"}
        footer={
          <>
            {!editConfigs ? (
              <div>
                <button className="secondary-button">Delete</button>
                <button
                  className="primary-button"
                  onClick={() => setEditConfigs(true)}
                >
                  Edit
                </button>
              </div>
            ) : (
              <div>
                <button
                  className="secondary-button"
                  onClick={() => setEditConfigs(false)}
                >
                  Back
                </button>
                <button className="primary-button">Update</button>
              </div>
            )}
          </>
        }
      >
        {editConfigs ? <EditConfigs /> : <ViewConfigs />}
      </SideTab>

      <SideTab
        open={addConfigs}
        setOpen={setAddConfigs}
        title={"Add Configurations"}
        footer={<button className="primary-button">Submit</button>}
      ></SideTab>
    </div>
  );
}
