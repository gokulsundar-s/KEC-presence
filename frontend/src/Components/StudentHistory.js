import { React,useEffect, useState } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
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

            <ul>
                {datas.map(datas => (
                <li key={datas._id} className = "student-history-main-container">
                    <div  className = "student-history-container">
              
                        <div className = "student-history-lines">  
                            <p><b>Type of request : </b>{datas.reqtype}</p>
                            <p><b>From date : </b>{datas.fromdate}</p>
                            <p><b>Session : </b>{datas.session}</p>
                            <p><b>Advoicer status : </b>{datas.advoicerstatus}</p>
                        </div>
            
                        <div className = "student-history-lines">
                            <p><b>Reson : </b>{datas.reason}</p>
                            <p><b>To date : </b>{datas.todate}</p>
                            <p><b>Total days: </b></p>
                            <p><b>year Incharge status : </b>{datas.yearinchargestatus}</p>
                        </div>
                    </div>
                </li>
                ))}
            </ul>

        </div>
    )
}