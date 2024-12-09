import { React, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import "../Styles/YearInchargePage.css";

export default function YearInchargeRequest() {
  const [datas, setDatas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = jwtDecode(Cookies.get("data"));
        const department = data.department;
        const year = data.year;
        const response = await axios.post(
          "http://localhost:3003/inchargerequests",
          { department, year }
        );
        setDatas(response.data);
      } catch (error) {
        toast.error("Some error occured! Try again!!");
      }
    };

    fetchData();
  }, []);

  const handleUpdate = useCallback(async (id, status) => {
    const objid = id;
    const inchargestatus = status;

    const response = await axios.post("http://localhost:3003/inchargeupdate", {
      objid,
      inchargestatus,
    });

    if (response.data === "false") {
      toast.error("The update is not done!!");
    } else if (response.data === "true") {
      toast.success("Update done successfully!!");
    }

    window.location.reload();
  }, []);

  return (
    <div className="yearinchargerequest-container">
      <p className="components-header">Requests</p>

      {datas.length === 0 ? (
        <p className="no-records">No Records found</p>
      ) : (
        <ul>
          {datas.map((datas) => (
            <li key={datas._id} className="yearincharge-request-main-container">
              <div className="yearincharge-request-container">
                <div className="yearincharge-request-lines">
                  <p>
                    <b>Name : </b>
                    {datas.name}
                  </p>
                  <p>
                    <b>Year : </b>
                    {datas.year}
                  </p>
                  <p>
                    <b>Type of request : </b>
                    {datas.reqtype}
                  </p>
                  <p>
                    <b>From date : </b>
                    {datas.fromdate}
                  </p>
                  <p>
                    <b>Session : </b>
                    {datas.session}
                  </p>
                  <br />
                  <br />

                  <button
                    className="yearincharge-accept-button"
                    onClick={() => handleUpdate(datas._id, "accepted")}
                  >
                    &#10004; Accept
                  </button>
                </div>

                <div className="yearincharge-request-lines">
                  <p>
                    <b>Roll Number : </b>
                    {datas.roll}
                  </p>
                  <p>
                    <b>Section : </b>
                    {datas.section}
                  </p>
                  <p>
                    <b>Reson : </b>
                    {datas.reason}
                  </p>
                  <p>
                    <b>To date : </b>
                    {datas.todate}
                  </p>
                  <p>
                    <b>Total days: </b>
                    {datas.days}
                  </p>
                  <br />
                  <br />
                  <button
                    className="yearincharge-reject-button"
                    onClick={() => handleUpdate(datas._id, "rejected")}
                  >
                    &#10006; Reject
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
