import { React,useEffect, useState } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import "../Styles/StudentPage.css";

export default function History() {
    const [datas, setDatas] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
              const data = jwtDecode(Cookies.get('data'));
              const roll = data.roll;
              const response = await axios.post('http://localhost:3003/studentshistory',{ roll });
              setDatas(response.data);

            } catch (error) {
                toast.error("Some error occured! Try again!!");
            }
        };

        fetchData();
    }, []);

    return(
        <div className = "studenthistory-container">
            <p className = "components-header">History</p>

            <div className = "request-history-table-container">
                <table>
                    <tr>
                        <th>Type of request</th>
                        <th>Reson</th>
                        <th>From date</th>
                        <th>To date</th>
                        <th>Session</th>
                        <th>Total days</th>
                        <th>Advoicer status</th>
                        <th>year Incharge status</th>
                        <th></th>
                    </tr>
                    
                    {datas.map(datas => (
                    <tr key={datas._id}>
                        <td>{datas.reqtype}</td>
                        <td>{datas.reason}</td>
                        <td>{datas.fromdate}</td>
                        <td>{datas.todate}</td>
                        <td>{datas.session}</td>
                        <td>{datas.days}</td>
                        <td>{datas.advoicerstatus}</td>
                        <td>{datas.inchargestatus}</td>
                        
                        <div className = "advoicer-edit-button-container">
                        <Popup trigger={<button className = "advoicer-edit-button"><img src={require("F:/Projects/kecpresence/frontend/src/Sources/pencil.png")} alt = "icon"></img></button>} modal nested>
                    {close => {
                      return (
                        <div className='advoicer-edit-container'>
                          <button className = "advoicer-close-button" onClick={() => close()}><img src={require("F:/Projects/kecpresence/frontend/src/Sources/close.png")} alt = "icon"></img></button>
                        
                          <div  className = "advoicer-request-container">              
                            <div className = "advoicer-request-lines">  
                              <p><b>Type of request : </b>{datas.reqtype}</p>
                              <p><b>From date : </b>{datas.fromdate}</p>
                              <p><b>Session : </b>{datas.session}</p>
                            </div>
            
                          <div className = "advoicer-request-lines">
                            <p><b>Reson : </b>{datas.reason}</p>
                            <p><b>To date : </b>{datas.todate}</p>
                            <p><b>Total days: </b>{datas.days}</p>
                          </div>
                        </div>

                        <div className = "advoicer-request-edit-save-container">
                          <button>Save</button>
                        </div>
                      </div>
                    );
                  }
                }
            </Popup>
                        </div>
                    </tr>
                    ))}
                </table>
            </div>
        </div>
    )
}