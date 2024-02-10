import { React, useState } from "react";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import "../Styles/StudentPage.css";

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
            const data = jwtDecode(Cookies.get('data'));
            const name = data.name.toUpperCase();
            const roll = data.roll.toUpperCase();
            const dept = data.department;
            const department = dept;
            const year = data.year;
            const section = data.section;

            try{
                const result = await axios.post('http://localhost:3003/addrequest', { name, roll, department, year, section, reqtype, reason, fromdate, todate, session, days, status });
                
                if(result.data === "success"){
                    setErrormessage("");
                    setSuccessmessage("Request posted successfully!!");
                    // setReqtype('');
                    // setReason('');
                    // setFromdate('');
                    // setTodate('');
                    // setSession('');
                    // setDays('');
                }
                else if(result.data === "exists"){
                    setErrormessage("Duplicate request with the same dates!!");
                    setSuccessmessage("");
                }
                else if(result.data === "failure"){
                    setErrormessage("Error in posting the request!!");
                    setSuccessmessage("");
                }
            }
            catch(error){
                setErrormessage("Some error occured! Try again!!");
                setSuccessmessage("");
            }
        }
    }
        return(
            <div className = "studentrequest-container">
                <p className = "components-header">Add request</p>
                <div className = "studentrequest-form-container">
                    <form action = "submit" onSubmit={(event) => event.preventDefault()}>
                        <div className = "form-input-container-block">
                            <div className = "form-input-container">
                                <p>Request Type :</p>
                                <select value={reqtype} onChange={(event) => handleReqTypeChange(event)} require="true">
                                    <option>Request Type</option>
                                    <option>Leave</option>
                                    <option>On-Duty</option>
                                </select>
                            </div>
                            <div className = "form-input-container">
                                <p>Reason :</p>
                                <input placeholder = "Reason" type = "text" value={reason} onChange={(event) => handleReasonChange(event)} require="true"></input>
                            </div>
                        </div>

                        <div className = "form-input-container-block">
                            <div className = "form-input-container">
                                <p>From Date :</p>
                                <input placeholder = "From Date" type = "date" value={fromdate} onChange={(event) => handleFromDateChange(event)} require="true"></input>
                            </div>

                            <div className = "form-input-container">
                                <p>To Date  :</p>
                                <input placeholder = "Roll Number" type = "date" value={todate} onChange={(event) => handleToDateChange(event)} require="true"></input>
                            </div>
                        </div>

                        <div className = "form-input-container-block">
                            <div className = "form-input-container">
                                <p>Session :</p>
                                <select value={session} onChange={(event) => handleSessionChange(event)} require="true">
                                    <option>Session</option>
                                    <option>Full Day</option>
                                    <option>Fore Noon</option>
                                    <option>After Noon</option>
                                </select>
                            </div>

                            <div className = "form-input-container">
                                <p>Total Days :</p>
                                <input placeholder = "Total Days" type="number" min="1" max="20" value={days} onChange={(event) => handleDaysChange(event)} require="true"></input>
                            </div>
                        </div>

                        <div className = "form-input-container-block">
                            <div className = "form-input-container">
                                <p>Upload the Proof in PDF (if available) :</p>
                                <div className = "upload-container"> 
                                    <input className = "proof-button" type = "file" placeholder="Upload the Proof in PDF" require="true"></input>
                                </div>
                            </div>
                        </div>
                        
                        <div className = "form-buttons-container">
                            <button onClick={() => handleAddrequest()}>Submit</button>
                        </div>

                        <p className = "error-container">{errormessage}</p>
                        <p className = "success-container">{successmessage}</p>
                    </form>
                </div>
            </div>
        )
    }

