import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../Utils/Constants";
import {
  showErrorToast,
  showSuccessToast,
} from "../../Components/Alerts/Alert";
import { ConfirmModal } from "../../Components/Modals/Modals";
import { Loaders } from "../../Components/Loaders/Loaders";
import GenericCodeForm from "./Components/GenericCodeForm/GenericCodeForm";
import GenericCodeDetails from "./Components/GenericCodeDetails/GenericCodeDetails";
import SideTab from "../../Components/SiderTab/SideTab";
import NoData from "../../Components/NoData/NoData";
import {
  FilterIcon,
  AddIcon,
  InfoIcon,
  EditIcon,
  TrashIcon,
  SubmitIcon,
  LoadIcon,
} from "../../Assets/Icons";

export default function Configs() {
  const navigate = useNavigate();

  // State variables for data handling
  const [token, setToken] = useState("");
  const [genericCodesData, setGenericCodesData] = useState([]);
  const [selectedGenericCodes, setSelectedGenericCodes] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [genericCodeData, setGenericCodeData] = useState({
    codeType: "",
    code: "",
    codeDescription: "",
  });

  // State variable for controlling drawer visibility
  const [openAddCodeSider, setOpenAddCodeSider] = useState(false);
  const [openCodeInfoSider, setOpenCodeInfoSider] = useState(false);
  const [openEditCodeSider, setOpenEditCodeSider] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  // State variable for loaders
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [rowLoading, setRowLoading] = useState(false);

  // useEffect to check authentication token and fetch generic code data
  useEffect(() => {
    const tokenValue = Cookies.get("token");
    if (!tokenValue) {
      navigate("/login");
      return;
    }
    setToken(tokenValue);
  }, [navigate]);

  // Fetch generic code data when token is set
  useEffect(() => {
    if (token) {
      getGenericCodesData();
    }
  }, [token, pageNumber, pageSize]);

  // Reset generic code data form when add/edit sider is closed
  useEffect(() => {
    if (!openEditCodeSider && !openCodeInfoSider && !openAddCodeSider)
      setGenericCodeData({
        codeType: "",
        code: "",
        codeDescription: "",
      });
  }, [openAddCodeSider, openEditCodeSider, openCodeInfoSider]);

  // Function to update the selected generic codes list
  const handleSelectGenericCode = (code) => {
    if (selectedGenericCodes.includes(code)) {
      setSelectedGenericCodes(selectedGenericCodes.filter((id) => id !== code));
    } else {
      setSelectedGenericCodes([...selectedGenericCodes, code]);
    }
  };

  // Function to select or deselect all generic codes
  const handleSelectAllGenericCodes = () => {
    if (selectedGenericCodes.length === genericCodesData.length) {
      setSelectedGenericCodes([]);
    } else {
      const allCodeIDs = genericCodesData.map((code) => code.code);
      setSelectedGenericCodes(allCodeIDs);
    }
  };

  // Function to load more generic codes
  const handleLoadGenericCodes = () => {
    setPageNumber(pageNumber + 1);
  };

  // Refresh generic codes data
  const refreshGenericCodesData = async () => {
    const response = await axios.get(`${baseUrl}/generic-codes`, {
      params: {
        pageNumber: 1,
        pageSize: pageSize,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data.status === 200) {
      setGenericCodesData(response.data.data.data);
      setTotalRecords(response.data.data.total);
    }
  };

  // Function to fetch all the generic codes info
  const getGenericCodesData = async () => {
    try {
      if (genericCodesData.length > 0) {
        setRowLoading(true);
      } else {
        setLoading(true);
      }
      const response = await axios.get(`${baseUrl}/generic-codes`, {
        params: {
          pageNumber: pageNumber,
          pageSize: pageSize,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status === 200) {
        setGenericCodesData([...genericCodesData, ...response.data.data.data]);
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

  // Function to handle adding new generic code
  const handleAddGenericCode = async () => {
    try {
      setButtonLoading(true);
      const response = await axios.post(
        `${baseUrl}/generic-codes`,
        genericCodeData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.data.status === 201) {
        setGenericCodesData([]);
        setSelectedGenericCodes([]);
        setOpenAddCodeSider(false);
        refreshGenericCodesData();
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

  // Function to handle editing existing generic code
  const handleEditGenericCode = async () => {
    try {
      setButtonLoading(true);
      const response = await axios.put(
        `${baseUrl}/generic-codes/${selectedGenericCodes[0]}`,
        genericCodeData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.data.status === 200) {
        setGenericCodesData([]);
        setSelectedGenericCodes([]);
        setOpenEditCodeSider(false);
        refreshGenericCodesData();
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

  // Function to handle deleting selected generic codes
  const handleDeleteGenericCodes = async () => {
    try {
      setButtonLoading(true);
      const response = await axios.delete(
        `${baseUrl}/generic-codes/${selectedGenericCodes}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.data.status === 200) {
        setGenericCodesData([]);
        setSelectedGenericCodes([]);
        setOpenConfirmModal(false);
        refreshGenericCodesData();
        showSuccessToast(response.data.message);
      } else {
        setOpenConfirmModal(false);
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
      <p className="page-header">Generic Codes</p>
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
                  selectedGenericCodes.length === 1 &&
                    setOpenCodeInfoSider(true);
                }}
                className={`primary-button view-info-buttons-list-first-button${
                  selectedGenericCodes.length !== 1 ? " disabled-button" : ""
                }`}
              >
                <InfoIcon />
              </button>
              <button
                onClick={() => {
                  selectedGenericCodes.length === 1 &&
                    setOpenEditCodeSider(true);
                }}
                className={`primary-button view-info-buttons-list-middle-button${
                  selectedGenericCodes.length !== 1 ? " disabled-button" : ""
                }`}
              >
                <EditIcon />
              </button>
              <button
                onClick={() => {
                  selectedGenericCodes.length >= 1 && setOpenConfirmModal(true);
                }}
                className={`primary-button view-info-buttons-list-last-button${
                  selectedGenericCodes.length < 1 ? " disabled-button" : ""
                }`}
              >
                <TrashIcon />
              </button>
            </div>

            <div className="view-info-input">
              <button
                onClick={() => setOpenAddCodeSider(true)}
                className="primary-button"
              >
                <AddIcon />
                New Code
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <Loaders />
        ) : genericCodesData.length === 0 ? (
          <NoData />
        ) : (
          <div className="view-info-table-container">
            <table className="view-info-table">
              <thead>
                <tr>
                  <td>
                    <input
                      type="checkbox"
                      onChange={handleSelectAllGenericCodes}
                      checked={
                        selectedGenericCodes.length === genericCodesData.length
                      }
                    />
                  </td>
                  <td>Code Type</td>
                  <td>Code</td>
                  <td>Description</td>
                </tr>
              </thead>

              <tbody>
                {genericCodesData.map((code) => (
                  <tr key={code.code}>
                    <td>
                      <input
                        type="checkbox"
                        onChange={() => handleSelectGenericCode(code.code)}
                        checked={selectedGenericCodes.includes(code.code)}
                      />
                    </td>
                    <td>{code.codeType}</td>
                    <td>{code.code}</td>
                    <td>{code.codeDescription}</td>
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
                          onClick={handleLoadGenericCodes}
                          className={
                            genericCodesData.length >= totalRecords
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
                          Showing <span>{genericCodesData.length}</span> Generic
                          Code Entries
                        </p>
                        <select
                          type="number"
                          value={pageSize}
                          onChange={() => {
                            setPageSize(event.target.value);
                            setPageNumber(1);
                            setGenericCodesData([]);
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

      {/* Side tab for adding new generic code */}
      <SideTab
        open={openAddCodeSider || openEditCodeSider}
        setOpen={openAddCodeSider ? setOpenAddCodeSider : setOpenEditCodeSider}
        title={openAddCodeSider ? "Add New Generic Code" : "Edit Generic Code"}
        footer={
          <button
            className="primary-button"
            onClick={
              openAddCodeSider ? handleAddGenericCode : handleEditGenericCode
            }
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
        <GenericCodeForm
          code={openEditCodeSider ? selectedGenericCodes[0] : null}
          genericCodeData={genericCodeData}
          setGenericCodeData={setGenericCodeData}
        />
      </SideTab>

      {/* Side tab for editing user information*/}
      <SideTab
        open={openCodeInfoSider}
        setOpen={setOpenCodeInfoSider}
        title="View User Information"
      >
        <GenericCodeDetails
          code={
            openCodeInfoSider && selectedGenericCodes && selectedGenericCodes[0]
          }
          genericCodeData={genericCodeData}
          setGenericCodeData={setGenericCodeData}
        />
      </SideTab>

      {/* Confirm Modal to delete the selected generic code */}
      <ConfirmModal
        open={openConfirmModal}
        title={"Delete Generic Codes"}
        message={"Are you sure to delete the generic codes?"}
        onClose={() => setOpenConfirmModal(false)}
        onConfirm={handleDeleteGenericCodes}
        loading={buttonLoading}
      />
    </div>
  );
}
