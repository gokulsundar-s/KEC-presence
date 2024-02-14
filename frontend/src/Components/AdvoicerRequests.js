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
    }, []);

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
          
        <ul>
          {datas.map(datas => (
          <li key={datas._id} className = "advoicer-request-main-container">
            <div  className = "advoicer-request-container">
              
              <div className = "advoicer-request-lines">  
                <p><b>Name : </b>{datas.name}</p>
                <p><b>Type of request : </b>{datas.reqtype}</p>
                <p><b>From date : </b>{datas.fromdate}</p>
                <p><b>Session : </b>{datas.session}</p>
                <p><b>Leave taken already : </b></p><br/><br/>
      
                <button className = "advoicer-accept-button" onClick={() => handleUpdate(datas._id,"accepted")} refresh="true">&#10004; Accept</button>

              </div>
            
              <div className = "advoicer-request-lines">
                <p><b>Roll Number : </b>{datas.roll}</p>
                <p><b>Reson : </b>{datas.reason}</p>
                <p><b>To date : </b>{datas.todate}</p>
                <p><b>No. of days requested : </b>{datas.days}</p>
                <p><b>OD taken already : </b></p><br/><br/>

                <button className = "advoicer-reject-button" onClick={() => handleUpdate(datas._id,"rejected")}>&#10006; Reject</button>

              </div>
            </div>
          </li>
        ))}
        </ul>

      </div>
    );
}
