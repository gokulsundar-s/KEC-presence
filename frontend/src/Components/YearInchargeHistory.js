import { React, useEffect, useState, useCallback } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import "../Styles/YearInchargePage.css";

export default function YearInchargeHistory() {
    const [datas, setDatas] = useState([]);
    const [newstatus, setNewstatus] = useState('');

    const handleNewstatus = (event) => {
      setNewstatus(event.target.value);
    };

  const handleUpdate = useCallback(async (id,status) => {
    const objid = id;
    const inchargestatus = status;
    
    if(inchargestatus === "accepted" || inchargestatus === "rejected"){
      const response = await axios.post('http://localhost:3003/inchargeupdate', { objid, inchargestatus });
      if(response.data === "false"){
        toast.error("The update is not done!!");
      }
      else if(response.data === "true"){
        toast.success("Update done successfully!!");
      }
    }

    else{
      toast.error("Choose the correct status!!");
    }
}, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
              const data = jwtDecode(Cookies.get('data'));
              const department = data.department;
              const year = data.year;
              const response = await axios.post('http://localhost:3003/inchargehistory',{ department, year });
              setDatas(response.data);

            } catch (error) {
                toast.error("Some error occured! Try again!!");
            }
        };

        fetchData();
    }, []);
    
    return(
      <div className="yearinchargehistory-container">
        <p className="components-header">History</p>
          
        <ul>
          {datas.map(datas => (
          <li key={datas._id} className = "yearincharge-request-main-container">
            <div  className = "yearincharge-edit-button-container">
            
            <Popup trigger={<button className = "yearincharge-edit-button"><img src={require("F:/Projects/kecpresence/frontend/src/Sources/pencil.png")} alt = "icon"></img></button>} modal nested>
                  {close => {
                    return (
                      <div className='yearincharge-edit-container'>
                        <button className = "yearincharge-close-button" onClick={() => close()}><img src={require("F:/Projects/kecpresence/frontend/src/Sources/close.png")} alt = "icon"></img></button>
                        
                        <div  className = "yearincharge-request-container">              
                          <div className = "yearincharge-request-lines">  
                            <p><b>Name : </b>{datas.name}</p>
                            <p><b>Type of request : </b>{datas.reqtype}</p>
                            <p><b>From date : </b>{datas.fromdate}</p>
                            <p><b>Session : </b>{datas.session}</p>
                            <p><b>Advoicer status : </b>{datas.inchargestatus}</p>
                          </div>
            
                        <div className = "yearincharge-request-lines">
                          <p><b>Roll Number : </b>{datas.roll}</p>
                          <p><b>Reson : </b>{datas.reason}</p>
                          <p><b>To date : </b>{datas.todate}</p>
                          <p><b>Total days: </b>{datas.days}</p>
                          <p><b>year Incharge status : </b>{
                              <select className = "yearincharge-request-edit-select" value={newstatus} onChange={(event) => handleNewstatus(event)}>
                                <option>Change the option</option>
                                <option>accepted</option>
                                <option>rejected</option>
                              </select>
                            }</p>
                        </div>
                       </div>

                        <div className = "yearincharge-request-edit-save-container">
                          <button onClick={() => handleUpdate(datas._id,newstatus)}>Save</button>
                        </div>
                      </div>
                    );
                  }
                }
            </Popup>
            </div>
            <div  className = "yearincharge-request-container">  
              <div className = "yearincharge-request-lines">  
                <p><b>Name : </b>{datas.name}</p>
                <p><b>Year : </b>{datas.year}</p>
                <p><b>Type of request : </b>{datas.reqtype}</p>
                <p><b>From date : </b>{datas.fromdate}</p>
                <p><b>Session : </b>{datas.session}</p>
                <p><b>Advoicer status : </b>{datas.advoicerstatus}</p>
               </div>
            
              <div className = "yearincharge-request-lines">
                <p><b>Roll Number : </b>{datas.roll}</p>
                <p><b>Section : </b>{datas.section}</p>
                <p><b>Reson : </b>{datas.reason}</p>
                <p><b>To date : </b>{datas.todate}</p>
                <p><b>Total days : </b>{datas.days}</p>
                <p><b>year Incharge status : </b>{datas.inchargestatus}</p>
              </div>
          </div>
          </li>
        ))}
        
        </ul>

      </div>
    );
}
