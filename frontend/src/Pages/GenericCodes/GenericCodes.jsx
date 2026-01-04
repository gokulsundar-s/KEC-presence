import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../Utils/Constants";
import {
  showErrorToast,
  showSuccessToast,
} from "../../Components/Alerts/Alert";
import { ConfirmModal, SuccessModal } from "../../Components/Modals/Modals";
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
  const [genericCodeData, setGenericCodeData] = useState({
    codeType: "",
    code: "",
    description: "",
  });

  // State variable for controlling drawer visibility
  const [openAddCodeSider, setOpenAddCodeSider] = useState(false);
  const [openCodeInfoSider, setOpenCodeInfoSider] = useState(false);

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

  // Fetch generic code data when token is set
  useEffect(() => {
    if (token) {
      getGenericCodesData();
    }
  }, [token]);

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

  // Function to fetch all the generic codes info
  const getGenericCodesData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/generic-codes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status === 200) {
        setGenericCodesData(response.data.data);
      } else {
        showErrorToast(response.data.message);
      }
      setLoading(false);
    } catch {
      showErrorToast("An error occurred. Please contact administrator.");
      setLoading(false);
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
            <button className="view-info-input-icon-button">
              <FilterIcon />
            </button>
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
                className={`primary-button view-info-buttons-list-middle-button${
                  selectedGenericCodes.length !== 1 ? " disabled-button" : ""
                }`}
              >
                <EditIcon />
              </button>
              <button
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
                        Showing <span>{genericCodesData.length}</span> User
                        Entries
                      </p>
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
        open={openAddCodeSider}
        setOpen={setOpenAddCodeSider}
        title={"Add New Generic Code"}
        footer={
          <button className="primary-button" onClick={{}} disabled={addLoading}>
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
        <GenericCodeForm
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
    </div>
  );
}
