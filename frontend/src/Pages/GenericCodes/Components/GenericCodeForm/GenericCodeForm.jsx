import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../../../Utils/Constants";
import { SidebarLoader } from "../../../../Components/Loaders/Loaders";
import { showErrorToast } from "../../../../Components/Alerts/Alert";
import { getGenericCodeByType } from "../../../../Utils/GenericCodeServices";

export default function GenericCodeForm({
  code,
  genericCodeData = {},
  setGenericCodeData,
}) {
  const navigate = useNavigate();

  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  // useEffect to check authentication token and fetch user data
  useEffect(() => {
    const tokenValue = Cookies.get("token");
    if (!tokenValue) {
      navigate("/login");
      return;
    }
    setToken(tokenValue);
  }, [navigate]);

  // useEffect to fetch user data when userID changes
  useEffect(() => {
    const getGenericCodeData = async () => {
      try {
        if (code) {
          setLoading(true);
          const response = await axios.get(`${baseUrl}/generic-codes/${code}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.data.status === 200) {
            setGenericCodeData({
              code: response.data.data.code,
              codeType: response.data.data.codeType,
              codeDescription: response.data.data.codeDescription,
            });
          } else {
            showErrorToast(response.data.message);
          }
          setLoading(false);
        }
      } catch (error) {
        showErrorToast("An error occurred. Please contact administrator.");
        setLoading(false);
      }
    };

    if (code && token) {
      getGenericCodeData();
    }
  }, [code, token]);

  return (
    <div className="sidebar-form-container">
      {loading ? (
        <SidebarLoader />
      ) : (
        <div className="sidebar-form-form">
          <div className="form-input">
            <p>Code Type</p>
            <select
              className={code ? "disabled-form-input" : ""}
              value={genericCodeData.codeType}
              onChange={(e) => {
                if (code) return;
                setGenericCodeData({
                  ...genericCodeData,
                  codeType: e.target.value,
                });
              }}
            >
              <option value="">Select Code Type</option>
              {getGenericCodeByType("GENERICCODETYPE").map((codeTypeItem) => (
                <option key={codeTypeItem.code} value={codeTypeItem.code}>
                  {codeTypeItem.codeDescription}
                </option>
              ))}
            </select>
          </div>

          <div className="form-input">
            <p>Code</p>
            <input
              className={code ? "disabled-form-input" : ""}
              value={genericCodeData.code}
              type="text"
              placeholder="Enter Code"
              onChange={(e) => {
                if (code) return;
                setGenericCodeData({
                  ...genericCodeData,
                  code: e.target.value,
                });
              }}
            />
          </div>

          <div className="form-input">
            <p>Description</p>
            <input
              value={genericCodeData.codeDescription}
              type="text"
              placeholder="Enter Description"
              onChange={(e) =>
                setGenericCodeData({
                  ...genericCodeData,
                  codeDescription: e.target.value,
                })
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
