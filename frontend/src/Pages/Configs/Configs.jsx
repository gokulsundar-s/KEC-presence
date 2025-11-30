import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../Utils/Constants";
import {
  showErrorToast,
  showSuccessToast,
} from "../../Components/Alerts/Alert";
import { ConfirmModal, SuccessModal } from "../../Components/Modals/Modals";
import ConfigsForm from "./Components/ConfigsForm/ConfigsForm";
import ConfigDetails from "./Components/ConfigsDetails/ConfigsDetails";
import SideTab from "../../Components/SiderTab/SideTab";
import NoData from "../../Components/NoData/NoData";
import Loaders from "../../Components/Loaders/Loaders";

export default function Configs() {
  const [configsData, setConfigsData] = useState([]);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [openInfoSider, setOpenInfoSider] = useState(false);
  const [openAddConfigSider, setOpenAddConfigSider] = useState(false);
  const [editConfigs, setEditConfigs] = useState(false);
  const [deleteConfig, setDeleteConfig] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [addConfigModal, setAddConfigModal] = useState(false);
  const [configData, setConfigData] = useState({
    configID: "",
    codeType: "",
    code: "",
    description: "",
  });

  const getConfigsData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/configs`);
      if (response.data.status === 200) {
        setConfigsData(response.data.data);
      } else {
        showErrorToast(response.data.message);
      }
      setLoading(false);
    } catch {
      showErrorToast("An error occurred. Please contact administrator.");
      setLoading(false);
    }
  };

  const handleAddConfig = async () => {
    try {
      setAddLoading(true);
      const response = await axios.post(`${baseUrl}/configs`, configData);
      if (response.data.status === 200) {
        getConfigsData();
        setOpenAddConfigSider(false);
        setAddLoading(false);
        setAddConfigModal(true);
        setConfigData({
          configID: "",
          codeType: "",
          code: "",
          description: "",
        });
      } else {
        setAddLoading(false);
        showErrorToast(response.data.message);
      }
    } catch {
      setAddLoading(false);
      showErrorToast("An error occurred. Please contact administrator.");
    }
  };

  const handleEditConfig = async () => {
    try {
      setEditLoading(true);
      const response = await axios.put(
        `${baseUrl}/configs/${selectedConfig}`,
        configData
      );
      if (response.data.status === 200) {
        getConfigsData();
        setOpenInfoSider(false);
        setEditConfigs(false);
        setSelectedConfig(null);
        setEditLoading(false);
        setConfigData({
          configID: "",
          codeType: "",
          code: "",
          description: "",
        });
        showSuccessToast(response.data.message);
      } else {
        setEditLoading(false);
        showErrorToast(response.data.message);
      }
    } catch {
      setEditLoading(false);
      showErrorToast("An error occurred. Please contact administrator.");
    }
  };

  const handleDeleteConfig = async () => {
    try {
      setDeleteLoading(true);
      const response = await axios.delete(
        `${baseUrl}/configs/${selectedConfig}`
      );
      if (response.data.status === 200) {
        showSuccessToast(response.data.message);
        getConfigsData();
        setDeleteConfig(false);
        setOpenInfoSider(false);
        setSelectedConfig(null);
        setDeleteLoading(false);
      } else {
        setDeleteLoading(false);
        showErrorToast(response.data.message);
      }
    } catch {
      setDeleteLoading(false);
      showErrorToast("An error occurred. Please contact administrator.");
    }
  };

  useEffect(() => {
    getConfigsData();
  }, []);

  useEffect(() => {
    setEditConfigs(!openInfoSider);
    if (!openInfoSider) {
      setConfigData({ codeType: "", code: "", description: "" });
      setSelectedConfig(null);
    }
    if (openAddConfigSider) {
      setConfigData({ codeType: "", code: "", description: "" });
    }
  }, [openInfoSider, openAddConfigSider]);

  return (
    <div className="page-container">
      <p className="page-header">Configurations</p>

      <div className="view-info-container">
        <div className="view-info-inputs-container">
          <div className="view-info-input">
            <p>Code Type</p>
            <select>
              <option value="all">All</option>
              <option value="DEPT">Department</option>
              <option value="ROLE">Role</option>
              <option value="RTYPE">Request Type</option>
            </select>
          </div>

          <div className="view-info-input">
            <p>Search</p>
            <input type="text" placeholder="Search" />
          </div>

          <div className="view-info-input">
            <button
              className="primary-button"
              onClick={() => setOpenAddConfigSider(true)}
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
                {configsData.map((config) => (
                  <tr key={config.code}>
                    <td>
                      {config.codeType === "DEPT"
                        ? "Department"
                        : config.codeType === "RTYPE"
                        ? "Request Type"
                        : config.codeType === "ROLE"
                        ? "Role"
                        : config.codeType === "YEAR"
                        ? "Year"
                        : config.codeType === "SECTION"
                        ? "Section"
                        : config.codeType}
                    </td>
                    <td>{config.code}</td>
                    <td>{config.description}</td>
                    <td>
                      <button
                        className="details-button"
                        onClick={() => {
                          setOpenInfoSider(true);
                          setSelectedConfig(config.configID);
                          setConfigData(config);
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
        title={editConfigs ? "Edit Config" : "Configuration Details"}
        footer={
          <>
            {!editConfigs ? (
              <div>
                <button
                  className="primary-button"
                  onClick={() => setDeleteConfig(true)}
                >
                  Delete
                </button>
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
                  className="primary-button"
                  onClick={() => setEditConfigs(false)}
                >
                  Back
                </button>
                <button
                  className="primary-button"
                  onClick={handleEditConfig}
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
        {editConfigs ? (
          <ConfigsForm configData={configData} setConfigData={setConfigData} />
        ) : (
          <ConfigDetails configData={configData} />
        )}
      </SideTab>

      <SideTab
        open={openAddConfigSider}
        setOpen={setOpenAddConfigSider}
        title={"Add Configuration"}
        footer={
          <button
            className="primary-button"
            onClick={handleAddConfig}
            disabled={addLoading}
          >
            {addLoading ? (
              <span className="login-button-loader"></span>
            ) : (
              "Submit"
            )}
          </button>
        }
      >
        <ConfigsForm configData={configData} setConfigData={setConfigData} />
      </SideTab>

      {deleteConfig && (
        <ConfirmModal
          title="Confirm Deletion"
          message="Are you sure you want to delete this configuration?"
          onConfirm={handleDeleteConfig}
          onClose={() => setDeleteConfig(false)}
          loading={deleteLoading}
        />
      )}

      {addConfigModal && (
        <SuccessModal
          message="Your new configuration has been added successfully."
          onClose={() => setAddConfigModal(false)}
        />
      )}
    </div>
  );
}
