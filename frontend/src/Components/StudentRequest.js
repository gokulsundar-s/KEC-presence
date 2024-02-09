import { React, useState } from "react";
import axios from 'axios';
import "../Styles/StudentRequest.css";

export default function Request() {
    const [reqtype, setReqtype] = useState('');
    const [reason, setReason] = useState('');
    const [fromdate, setFromdate] = useState('');
    const [todate, setTodate] = useState('');
    const [session, setSession] = useState('');
    const [days, setDays] = useState('');
    const [status] = useState('pending');
    const [errormessage,setErrormessage] = useState('');
    const [successmessage,setSuccessmessage] = useState('');
    
    const handleReqTypeChange = (event) => {
        setReqtype(event.target.value);
    };
    const handleReasonChange = (event) => {
        setReason(event.target.value);
    };
    const handleFromDateChange = (event) => {
        setFromdate(event.target.value);
    };
    const handleToDateChange = (event) => {
        setTodate(event.target.value);
    };
    const handleSessionChange = (event) => {
        setSession(event.target.value);
    };
    const handleDaysChange = (event) => {
        setDays(event.target.value);
    };

    const handleAddrequest = async () => {
        if(reqtype === "" || reqtype === "Request Type"){
            setErrormessage("Enter a valid request type!!");
            setSuccessmessage("");
        }
        else if(reason === ""){
            setErrormessage("Enter a valid reason!!");
            setSuccessmessage("");
        }
        else if(fromdate === ""){
            setErrormessage("Enter a valid from date!!");
            setSuccessmessage("");
        }
        else if(todate === ""){
            setErrormessage("Enter a valid to date!!");
            setSuccessmessage("");
        }
        else if(session === "" || session === "Session"){
            setErrormessage("Enter a valid session!!");
            setSuccessmessage("");
        }
        else if(days === ""){
            setErrormessage("Enter a valid days count!!");
            setSuccessmessage("");
        }
        else{
            setReason(reason.toUpperCase());
            const result = await axios.post('http://localhost:3003/addrequest', { reqtype, reason, fromdate, todate, session, days, status });
            if(result){}
        }
    }
        return(
            <div className = "studentrequest-container">
                <p className = "studentrequest-container-header">Add request</p>
                <div className = "studentrequest-form-container">
                    <form action = "submit" onSubmit={(event) => event.preventDefault()}>
                        <div className = "studentrequest-input-container">
                            <div className = "studentrequest-input-subcontainer">
                                <p>Request Type :</p>
                                <select value={reqtype} onChange={(event) => handleReqTypeChange(event)} require>
                                    <option>Request Type</option>
                                    <option>Leave</option>
                                    <option>On-Duty</option>
                                </select>
                            </div>
                            <div className = "studentrequest-input-subcontainer">
                                <p>Reason :</p>
                                <input placeholder = "Reason" type = "text" value={reason} onChange={(event) => handleReasonChange(event)} require></input>
                            </div>
                        </div>

                        <div className = "studentrequest-input-container">
                            <div className = "studentrequest-input-subcontainer">
                                <p>From Date :</p>
                                <input placeholder = "From Date" type = "date" value={fromdate} onChange={(event) => handleFromDateChange(event)}require></input>
                            </div>
                            <div className = "studentrequest-input-subcontainer">
                                <p>To Date  :</p>
                                <input placeholder = "Roll Number" type = "date" value={todate} onChange={(event) => handleToDateChange(event)}require></input>
                            </div>
                        </div>

                        <div className = "studentrequest-input-container">
                            <div className = "studentrequest-input-subcontainer">
                                <p>Session :</p>
                                <select value={session} onChange={(event) => handleSessionChange(event)} require>
                                    <option>Session</option>
                                    <option>Full Day</option>
                                    <option>Fore Noon</option>
                                    <option>After Noon</option>
                                </select>
                            </div>
                            <div className = "studentrequest-input-subcontainer">
                                <p>Total Days :</p>
                                <input placeholder = "Total Days" type="number" min="1" max="20" value={days} onChange={(event) => handleDaysChange(event)} require></input>
                            </div>
                        </div>

                        <div className = "studentrequest-input-container">
                            <div className = "studentrequest-input-subcontainer">
                                <p>Upload the Proof in PDF (if available) :</p>
                                <div className = "studentrequest-upload-input"> 
                                    <input className = "proof-button" type = "file" placeholder="Upload the Proof in PDF"></input>
                                </div>
                            </div>
                        </div>
                        
                        <div className = "studentrequest-form-button">
                            <button onClick={() => handleAddrequest()}>Submit</button>
                        </div>

                        <div className = "admindelete-message-container">
                            <p className = "admindelete-error-message">{errormessage}</p>
                            <p className = "admindelete-success-message">{successmessage}</p>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

