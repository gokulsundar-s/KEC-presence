import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import toast, { Toaster } from 'react-hot-toast';
import NotesPopup from '../NotesPopup/NotePopup';
import "./Requests.css";

export default function Requests() {
    const [requests, setRequests] = useState([]);
    const [requestTypeDD, setRequestTypeDD] = useState([]);
    const [sessionDD, setSessionDD] = useState([]);
    const [year, setYear] = useState("");
    const [section, setSection] = useState("");
    const [notesID, setNotesID] = useState("");
    const acceptedStatus = "accepted";
    const rejectedStatus = "rejected";

    const [openNotesPopup, setNotesPopup] = useState(false);

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
    
    const handleFetchData = async () => {
        const response = await axios.post('http://localhost:3003/advisor-requests', {year, section});
        setRequests(response.data);
    };

    const handleUpdateRequest = async (id, status) => {
        console.log(id, status);
        const response = await axios.post('http://localhost:3003/advisor-req-update', {id, status});
        
        if(response.data.status === 200){
            toast.success(response.data.message);
            handleFetchData();
        } else {
            toast.error(response.data.message);
        }
    }

    const handleOpenNotesPopup = (id) => {
        setNotesID(id);
        setNotesPopup(true);
    }
    
    useEffect(() => {
        setYear(jwtDecode(Cookies.get("authToken")).year);
        setSection(jwtDecode(Cookies.get("authToken")).section);

        if(year && section){
            handleFetchData();
            handleRequestTypeDropDown();
            handleSessionDropDown();
        }
    },[year,section]);

    const getRequesttypeDescription = (reqtype) => {
        const usertypeItem = requestTypeDD.find(item => item.value === reqtype);
        return usertypeItem ? usertypeItem.description : reqtype;
    };
    
    const getSessionDescription = (session) => {
        const usertypeItem = sessionDD.find(item => item.value === session);
        return usertypeItem ? usertypeItem.description : session;
    };
       
    return (
        <>
        <div className = "advisor-requests-container">
            <p className = "advisor-requests-welcome">New Requests🗓️</p>
            
            <div className = "advisor-requests-table-container">
                {requests.length === 0 ? <p className = "advisor-requests-table-container-no-data">No new requests found</p> : (
                <table className = "advisor-requests-table">
                    <tbody>
                        <tr>
                            <th>Name</th>
                            <th>Roll Number</th>
                            <th>Request Type</th>
                            <th>Reason</th>
                            <th>From Date</th>
                            <th>To Date</th>
                            <th>Session</th>
                            <th>No. of Day(s)</th>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>
                  
                        {requests.map(datas => (
                        <tr key={datas._id}>
                            <td>{datas.name}</td>
                            <td>{datas.roll}</td>
                            <td>{getRequesttypeDescription(datas.reqtype)}</td>
                            <td>{datas.reason}</td>
                            <td>{datas.fromdate}</td>
                            <td>{datas.todate}</td>
                            <td>{getSessionDescription(datas.session)}</td>
                            <td>{datas.days}</td>
                            <td><button onClick={() => handleOpenNotesPopup(datas._id)}><img src={require("../../../Sources/notes.png")} alt="notes-image"/></button></td>
                            <td><button onClick={() => handleUpdateRequest(datas._id, acceptedStatus)}><img src={require("../../../Sources/accept.png")} alt="accept-image"/></button></td>
                            <td><button onClick={() => handleUpdateRequest(datas._id, rejectedStatus)}><img src={require("../../../Sources/reject.png")} alt="reject-image"/></button></td>
                        </tr>
                        ))}
                    </tbody>
                </table>)}
            </div>
        </div>
        <Toaster toastOptions={{duration: 5000}}/>
        {openNotesPopup && <NotesPopup/>}
        </>
    )
}