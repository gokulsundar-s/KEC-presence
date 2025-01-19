import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import toast, { Toaster } from 'react-hot-toast';
import NotesPopup from '../NotesPopup/NotePopup';
import EditStatusPopup from '../EditStatus/EditStatusPopup';
import "./History.css";

export default function History() {
    const [requests, setRequests] = useState([]);
    const [requestTypeDD, setRequestTypeDD] = useState([]);
    const [sessionDD, setSessionDD] = useState([]);
    const [year, setYear] = useState("");
    const [section, setSection] = useState("");
    const [notesID, setNotesID] = useState("");
    const [editStatusID, setEditStatusID] = useState("");
    const [editStatusValue, setEditStatusValue] = useState("");
   
    const [openNotesPopup, setNotesPopup] = useState(false);
    const [openEditStatusPopup, setEditStatusPopup] = useState(false);

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
        const response = await axios.post('http://localhost:3003/advisor-history', {year, section});
        setRequests(response.data);
    };

    const handleOpenNotesPopup = async(id) => {
        setNotesID(id);
        if(notesID){
            setNotesPopup(true);
        }
    }

    const handleCloseNotesPopup = (value) => {
        setNotesPopup(value);
    }
    const handleOpenStatusPopup = async(id, status) => {
        setEditStatusID(id);
        setEditStatusValue(status === "accepted" ? "Accept" : "Reject")
        if(editStatusID && editStatusValue){
            setEditStatusPopup(true);
        }
    }
    const handleCloseStatusPopup = (value) => {
        setEditStatusPopup(value);
        handleFetchData();
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
            <p className = "advisor-requests-welcome">Requests History🕕</p>
            
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
                            <th>Status</th>
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
                            <td className = {datas.advoicerstatus === "accepted" ? "green-string" : "red-string"}>{datas.advoicerstatus.charAt(0).toUpperCase() + datas.advoicerstatus.slice(1)}</td>
                            <td><button onClick={() => handleOpenNotesPopup(datas._id)}><img src={require("../../../Sources/notes.png")} alt="notes-image"/></button></td>
                            <td><button onClick={() => datas.prooflink && window.open(datas.prooflink, "_blank")}><img src={require("../../../Sources/proof.png")} alt="notes-image" className={!datas.prooflink ? "disable-image" : ""} /></button></td>
                            <td><button onClick={() => handleOpenStatusPopup(datas._id, datas.advoicerstatus)}><img src={require("../../../Sources/edit.png")} alt="edit-image"/></button></td>
                        </tr>
                        ))}
                    </tbody>
                </table>)}
            </div>
        </div>
        <Toaster toastOptions={{duration: 5000}}/>
        {openNotesPopup && <NotesPopup handleCloseNotesPopup={handleCloseNotesPopup} notesID={notesID}/>}
        {openEditStatusPopup && <EditStatusPopup handleCloseStatusPopup={handleCloseStatusPopup} editStatusID={editStatusID} editStatusValue={editStatusValue}/>}
        </>
    )
}