import { React, useState } from "react";
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import "../Styles/StudentsRequest.css";

export default function StudentRequest() {
    const [reqtype, setReqtype] = useState('');
    const [reason, setReason] = useState('');
    const [fromdate, setFromdate] = useState('');
    const [todate, setTodate] = useState('');
    const [session, setSession] = useState('');
    const [advoicerstatus] = useState('pending');
    const [inchargestatus] = useState('pending');

    const handleReqTypeChange = (event) => setReqtype(event.target.value);
    const handleReasonChange = (event) => setReason(event.target.value.toUpperCase());
    const handleFromDateChange = (event) => setFromdate(event.target.value);
    const handleToDateChange = (event) => setTodate(event.target.value);
    const handleSessionChange = (event) => setSession(event.target.value);

    const handleAddRequest = async () => {
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
        else {
            const data = jwtDecode(Cookies.get('data'));
            const name = data.name.toUpperCase();
            const roll = data.roll.toUpperCase();
            const department = data.department;
            const year = data.year;
            const section = data.section;

            try {
                const result = await axios.post('http://localhost:3003/studentrequest', { 
                    name, roll, department, year, section, 
                    reqtype, reason, fromdate, todate, session, 
                    advoicerstatus, inchargestatus 
                });

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
            } catch(error) {
                toast.error("Some error occurred! Try again!!");
            }
        }
    };

    return (
        <>
            <p className="page-header">Add request</p>
            
            <form className="students-request-form-container" onSubmit={(event) => event.preventDefault()}>
                <div className="students-request-form-input-container">
                    <div className="students-request-form-inputs">
                        <p>Request Type :</p>
                        <select value={reqtype} onChange={handleReqTypeChange} required>
                            <option>Request Type</option>
                            <option>Leave</option>
                            <option>On-Duty</option>
                        </select>
                    </div>
                        
                    <div className="students-request-form-inputs">
                        <p>Reason :</p>
                        <input placeholder="Reason" type="text" value={reason} onChange={handleReasonChange} required />
                    </div>
                </div>

                <div className="students-request-form-input-container">
                    <div className="students-request-form-inputs">
                        <p>From Date :</p>
                        <input placeholder="From Date" type="date" value={fromdate} onChange={handleFromDateChange} required />
                    </div>
                    <div className="students-request-form-inputs">
                        <p>To Date :</p>
                        <input placeholder="To Date" type="date" value={todate} onChange={handleToDateChange} required />
                    </div>
                </div>

                <div className="students-request-form-input-container">
                    <div className="students-request-form-inputs">
                        <p>Session :</p>
                        <select value={session} onChange={handleSessionChange} required>
                            <option>Session</option>
                            <option>Full Day</option>
                            <option>Fore Noon</option>
                            <option>After Noon</option>
                        </select>
                    </div>

                    {/* <div className="students-request-form-inputs">
                        <p>Upload the Proof in PDF (if available) :</p>
                        <div className="students-request-form-upload-container"> 
                            <input className="proof-button" type="file" accept=".pdf" required />
                        </div>
                    </div> */}
                </div>
                    
                <div className="students-request-form-buttons-container">
                    <button onClick={handleAddRequest}>Submit</button>
                </div>
            </form>
        
            <Toaster toastOptions={{ duration: 5000 }} />
        </>
    );
}
