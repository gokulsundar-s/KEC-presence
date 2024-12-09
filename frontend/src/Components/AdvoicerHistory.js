import { React, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import "../Styles/AdvoicerPage.css";

export default function AdvoicerHistory() {
  const [datas, setDatas] = useState([]);
  const [newstatus, setNewstatus] = useState("");

  const handleNewstatus = (event) => {
    setNewstatus(event.target.value);
  };

  const handleUpdate = useCallback(async (id, status) => {
    const objid = id;
    const advoicerstatus = status;

    if (advoicerstatus === "accepted" || advoicerstatus === "rejected") {
      const response = await axios.post(
        "http://localhost:3003/advoicerupdate",
        { objid, advoicerstatus }
      );
      if (response.data === "false") {
        toast.error("The update is not done!!");
      } else if (response.data === "true") {
        toast.success("Update done successfully!!");
      }
    } else {
      toast.error("Choose the correct status!!");
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = jwtDecode(Cookies.get("data"));
        const department = data.department;
        const year = data.year;
        const section = data.section;
        const response = await axios.post(
          "http://localhost:3003/advoicerhistory",
          { department, year, section }
        );
        setDatas(response.data);
      } catch (error) {
        toast.error("Some error occured! Try again!!");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="advoicerrequest-container">
      <p className="components-header">History</p>
      {datas.length === 0 ? (
        <p className="no-records">No Records found</p>
      ) : (
        <ul>
          {datas.map((datas) => (
            <li key={datas._id} className="advoicer-request-boxes">
              <div className="advoicer-request-main-container">
                <div className="advoicer-edit-button-container">
                  <Popup
                    trigger={
                      <button className="advoicer-edit-button">
                        <img
                          src={require("..//Sources/pencil.png")}
                          alt="icon"
                        ></img>
                      </button>
                    }
                    modal
                    nested
                  >
                    {(close) => {
                      return (
                        <div className="advoicer-edit-container">
                          <button
                            className="advoicer-close-button"
                            onClick={() => close()}
                          >
                            <img
                              src={require("..//Sources/close.png")}
                              alt="icon"
                            ></img>
                          </button>

                          <div className="advoicer-request-container">
                            <div className="advoicer-request-lines">
                              <p>
                                <b>Name : </b>
                                {datas.name}
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
                              <p>
                                <b>Advoicer status : </b>
                                {
                                  <select
                                    className="advoicer-request-edit-select"
                                    value={newstatus}
                                    onChange={(event) => handleNewstatus(event)}
                                  >
                                    <option>Change the option</option>
                                    <option>accepted</option>
                                    <option>rejected</option>
                                  </select>
                                }
                              </p>
                            </div>

                            <div className="advoicer-request-lines">
                              <p>
                                <b>Roll Number : </b>
                                {datas.roll}
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
                              <p>
                                <b>year Incharge status : </b>
                                {datas.inchargestatus}
                              </p>
                            </div>
                          </div>

                          <div className="advoicer-request-edit-save-container">
                            <button
                              onClick={() => handleUpdate(datas._id, newstatus)}
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      );
                    }}
                  </Popup>
                </div>

                <div className="advoicer-request-container">
                  <div className="advoicer-request-lines">
                    <p>
                      <b>Name : </b>
                      {datas.name}
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
                    <p>
                      <b>Advoicer status : </b>
                      {datas.advoicerstatus}
                    </p>
                  </div>

                  <div className="advoicer-request-lines">
                    <p>
                      <b>Roll Number : </b>
                      {datas.roll}
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
                    <p>
                      <b>year Incharge status : </b>
                      {datas.inchargestatus}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
