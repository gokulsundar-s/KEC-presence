import { React, useEffect,useState, useCallback } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import "../Styles/AdvoicerPage.css";

export default function AdvoicerRequest() {
    
  const [datas, setDatas] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
              const data = jwtDecode(Cookies.get('data'));
              const department = data.department;
              const year = data.year;
              const section = data.section;
              const response = await axios.post('http://localhost:3003/advoicerrequests',{ department, year, section });
              setDatas(response.data);

            } catch (error) {
                toast.error("Some error occured! Try again!!");
            }
        };

        fetchData();
    }
    , []);

    const handleUpdate = useCallback(async (id,status) => {
      const objid = id;
      const advoicerstatus = status;

      const response = await axios.post('http://localhost:3003/advoicerupdate', { objid, advoicerstatus });
      if(response.data === "false"){
        toast.error("The update is not done!!");
      }
      else if(response.data === "true"){
        toast.success("Update done successfully!!");
      }
  }, []);

    return(
      <div className="advoicerrequest-container">
        <p className="components-header">Requests</p>
          
        <div className = "request-table-container">
              <table>
                  <tr>
                      <th>Name</th>
                      <th>Roll Number</th>
                      <th>Type of request</th>
                      <th>Reson</th>
                      <th>From date</th>
                      <th>To date</th>
                      <th>Session</th>
                      <th>Total days</th>
                      <th></th>
                      <th></th>
                      <th></th>
                  </tr>
                  
                  {datas.map(datas => (
                  <tr key={datas._id}>
                      <td>{datas.name}</td>
                      <td>{datas.roll}</td>
                      <td>{datas.reqtype}</td>
                      <td>{datas.reason}</td>
                      <td>{datas.fromdate}</td>
                      <td>{datas.todate}</td>
                      <td>{datas.session}</td>
                      <td>{datas.days}</td>
                      <td><button className = "request-edit-button"><img src={require("F:/Projects/kecpresence/frontend/src/Sources/comments.png")} alt = "icon"></img></button></td>
                      <td><button className = "request-accept-button" onClick={() => handleUpdate(datas._id,"accepted")}><img src={require("F:/Projects/kecpresence/frontend/src/Sources/accept.png")} alt = "icon"></img></button></td>
                      <td><button className = "request-reject-button" onClick={() => handleUpdate(datas._id,"rejected")}><img src={require("F:/Projects/kecpresence/frontend/src/Sources/reject.png")} alt = "icon"></img></button></td>
                  </tr>
                  ))}
              </table>
          </div>
      </div>
  )
}