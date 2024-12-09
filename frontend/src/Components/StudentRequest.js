import { React, useState } from "react";
import axios from 'axios';
import {toast} from "react-toastify";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import "../Styles/StudentPage.css";

export default function Request() {
    const [reqtype, setReqtype] = useState('');
    const [reason, setReason] = useState('');
    const [fromdate, setFromdate] = useState('');
    const [todate, setTodate] = useState('');
    const [session, setSession] = useState('');
    const [advoicerstatus] = useState('pending');
    const [inchargestatus] = useState('pending');
    
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

    const handleAddrequest = async () => {
        if(reqtype === "" || reqtype === "Request Type"){
            toast.error("Enter a valid request type!!");
        }
        else if(reason === ""){
            toast.error("Enter a valid reason!!");
        }
        else if(fromdate === ""){
            toast.error("Enter a valid from date!!");
        }
        else if(todate === ""){
            toast.error("Enter a valid to date!!");
        }
        else if(session === "" || session === "Session"){
            toast.error("Enter a valid session!!");
        }
        else{
            setReason(reason.toUpperCase());
            const data = jwtDecode(Cookies.get('data'));
            const name = data.name.toUpperCase();
            const roll = data.roll.toUpperCase();
            const department = data.department;
            const year = data.year;
            const section = data.section;

            try{
                const result = await axios.post('http://localhost:3003/studentrequest', { name, roll, department, year, section, reqtype, reason, fromdate, todate, session, advoicerstatus, inchargestatus });
                
                if(result.data === "success"){
                    toast.success("Request posted successfully!!");
                    setReqtype('');
                    setReason('');
                    setFromdate('');
                    setTodate('');
                    setSession('');
                }
                else if(result.data === "exists"){
                    toast.error("Duplicate request is detected!!");
                }
                else if(result.data === "failure"){
                    toast.error("Error in posting the request!!");
                }
            }
            catch(error){
                toast.error("Some error occured! Try again!!");
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

                            {/* <div className = "form-input-container">
                                <p>Upload the Proof in PDF (if available) :</p>
                                <div className = "upload-container"> 
                                    <input className = "proof-button" type = "file" placeholder="Upload the Proof in PDF" require="true"></input>
                                </div>
                            </div> */}
                        </div>
                        
                        <div className = "form-buttons-container">
                            <button onClick={() => handleAddrequest()}>Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

