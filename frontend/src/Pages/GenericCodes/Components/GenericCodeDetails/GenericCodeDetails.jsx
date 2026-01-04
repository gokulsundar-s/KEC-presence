import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../../../Utils/Constants";
import { SidebarLoader } from "../../../../Components/Loaders/Loaders";
import { showErrorToast } from "../../../../Components/Alerts/Alert";

export default function GenericCodeDetails({
  code,
  genericCodeData,
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
            setGenericCodeData(response.data.data);
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

    if (code) {
      getGenericCodeData();
    }
  }, [code]);

  return (
    <div className="sidebar-info-container">
      {loading ? (
        <SidebarLoader />
      ) : (
        <div className="sidebar-info-table-container">
          <table>
            <tbody>
              <tr>
                <th>Code Type</th>
                <td>{genericCodeData.codeType}</td>
              </tr>
              <tr>
                <th>Code</th>
                <td>{genericCodeData.code ?? "-"}</td>
              </tr>
              <tr>
                <th>Description</th>
                <td>{genericCodeData.codeDescription ?? "-"}</td>
              </tr>
              <tr>
                <th>Created By</th>
                <td>{genericCodeData.createdBy ?? "-"}</td>
              </tr>
              <tr>
                <th>Created At</th>
                <td>{genericCodeData.createdAt ?? "-"}</td>
              </tr>
              <tr>
                <th>Updated By</th>
                <td>{genericCodeData.updatedBy ?? "-"}</td>
              </tr>
              <tr>
                <th>Updated At</th>
                <td>{genericCodeData.updatedAt ?? "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
