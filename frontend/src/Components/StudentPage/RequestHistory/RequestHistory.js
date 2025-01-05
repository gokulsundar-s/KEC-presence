import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import toast, { Toaster } from 'react-hot-toast';
import DeletePopup from '../../DeletePopup/DeletePopup';
import "./RequestHistory.css";

export default function RequestHistory() {
    const [roll, setRoll] = useState("");
    const [requestTypeDD, setRequestTypeDD] = useState([]);
    const [sessionDD, setSessionDD] = useState([]);
    const [requestHistory, setRequestHistory] = useState([]);
    const [deletePopup, setDeletePopup] = useState(false);
    const [deleteID, setDeleteID] = useState("");

    const handleRequestTypeDropDown = async() => {
        const type = "Request Type";
        const response = await axios.post("http://localhost:3003/get-dropdown", {type});
        const ddArray = response.data.map((item, index) => ({
            value: response.data[index].value,
            description: response.data[index].description
        }));
        setRequestTypeDD(ddArray);
    }

    const handleSessionDropDown = async() => {
        const type = "Session";
        const response = await axios.post("http://localhost:3003/get-dropdown", {type});
        const ddArray = response.data.map((item, index) => ({
            value: response.data[index].value,
            description: response.data[index].description
        }));
        setSessionDD(ddArray);
    }
    
    const handleFetchUserData = async () => {
        const response = await axios.post('http://localhost:3003/student-history', { roll });
        setRequestHistory(response.data);
    };
    
    const handleDelete = async(value) => {
        if(!value){
            setDeletePopup(false);
        } else {
            try {
                const response = await axios.post('http://localhost:3003/delete-request', { _id: deleteID });
                if(response.data.status === 200) {
                    toast.success(response.data.message,{
                        position: "top-center",
                        style: {color: "#004aad", fontSize: "1rem"},
                        iconTheme: {primary: "#0093dd",}
                    });
                    handleFetchUserData();
                    setDeletePopup(false);
                } else {
                    toast.error(response.data.message,{
                        position: "top-center",
                        style: {color: "#004aad", fontSize: "1rem"},
                        iconTheme: {primary: "#0093dd",}
                    });
                }
            } catch (error) {
                toast.error("Server error. Try again after sometimes.",{
                    position: "top-center",
                    style: {color: "#004aad", fontSize: "1rem"},
                    iconTheme: {primary: "#0093dd",}
                });
            }
        }
    }

    const getRequesttypeDescription = (reqtype) => {
        const usertypeItem = requestTypeDD.find(item => item.value === reqtype);
        return usertypeItem ? usertypeItem.description : reqtype;
    };
    
    const getSessionDescription = (session) => {
        const usertypeItem = sessionDD.find(item => item.value === session);
        return usertypeItem ? usertypeItem.description : session;
    };

    const handleDeletePopup = async(id) => {
        setDeletePopup(true);
        setDeleteID(id);
    }
    
    useEffect(() => {
        setRoll(jwtDecode(Cookies.get("authToken")).roll);
        if (roll) {
            handleFetchUserData();
            handleRequestTypeDropDown();
            handleSessionDropDown();
        }
    },[roll]);
       
    return (
        <>
        <div className = "student-history-container">
            <p className = "student-history-welcome">Request History📜</p>
            
            <div className = "student-history-table-container">
                {requestHistory.length === 0 ? <p className = "student-history-table-container-no-data">No data found</p> : (
                <table className = "student-history-table">
                    <tbody>
                        <tr>
                            <th>Request Type</th>
                            <th>Reason</th>
                            <th>From Date</th>
                            <th>To Date</th>
                            <th>Session</th>
                            <th>No. of Day(s)</th>
                            <th>Advoicer Status</th>
                            <th>Year-incharge Status</th>
                            <th></th>
                        </tr>
                  
                        {requestHistory.map(datas => (
                        <tr key={datas._id}>
                            <td>{getRequesttypeDescription(datas.reqtype)}</td>
                            <td>{datas.reason}</td>
                            <td>{datas.fromdate}</td>
                            <td>{datas.todate}</td>
                            <td>{getSessionDescription(datas.session)}</td>
                            <td>{datas.days}</td>
                            <td>{datas.advoicerstatus}</td>
                            <td>{datas.inchargestatus}</td>
                            <td><button onClick={() => handleDeletePopup(datas._id)}><img src={require("../../../Sources/delete.png")} alt="icon"/></button></td>
                        </tr>
                        ))}
                    </tbody>
                </table>)}
            </div>
        </div>
        {deletePopup && <DeletePopup handleDelete={handleDelete} deleteType={"user"}/>}
        <Toaster toastOptions={{duration: 5000}}/> 
        </>
    )
}