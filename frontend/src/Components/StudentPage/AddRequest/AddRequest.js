import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import toast, { Toaster } from 'react-hot-toast';
import "./AddRequest.css";

export default function AddRequest() {
    const [reqtypeDD, seReqtypeDD] = useState([]);
    const [sessionDD, setSessionDD] = useState([]);

    const [reqtype, setReqtype] = useState('');
    const [reason, setReason] = useState('');
    const [fromdate, setFromdate] = useState('');
    const [todate, setTodate] = useState('');
    const [session, setSession] = useState('');
    const [advoicerstatus] = useState('pending');
    const [inchargestatus] = useState('pending');
    const [prooflink, setProoflink] = useState('');
    const [mail, setMail] = useState('');
    const [name, setName] = useState('');
    const [roll, setRollno] = useState('');

    const handleRequestTypeChange = (event) => setReqtype(event.target.value);
    const handleReasonChange = (event) => setReason(event.target.value);
    const handleFromDateChange = (event) => setFromdate(event.target.value);
    const handleToDateChange = (event) => setTodate(event.target.value);
    const handleSessionChange = (event) => setSession(event.target.value);
    const handleDriveLink = (event) => setProoflink(event.target.value);

    useEffect(() => {
        const userData = jwtDecode(Cookies.get("authToken"));
        setName(userData.name);
        setRollno(userData.roll);
        setMail(userData.mail);
    },[])

    const handleAddRequest = async() => {
        try {
            const response = await axios.post('http://localhost:3003/add-request', { name, roll, mail, reqtype, reason, fromdate, todate, session, advoicerstatus, inchargestatus, prooflink });
            
            if(response.data.status === 200) {
                toast.success(response.data.message,{
                    position: "top-center",
                    style: {color: "#004aad", fontSize: "1rem"},
                    iconTheme: {primary: "#0093dd",}
                });
                setReqtype('');
                setReason('');
                setFromdate('');
                setTodate('');
                setSession('');
                setProoflink('');
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

    useEffect(() => {
        try{
            const handleRequestTypeDropDown = async() => {
                const type = "Request Type";
                const response = await axios.post("http://localhost:3003/get-dropdown", {type});
                const ddArray = response.data.map((item, index) => ({
                    value: response.data[index].value,
                    description: response.data[index].description
                }));
                seReqtypeDD(ddArray);
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

            handleRequestTypeDropDown();
            handleSessionDropDown();
        } catch (error) {
            toast.error("Server error. Try again after sometimes.",{
                position: "top-center",
                style: {color: "#004aad", fontSize: "1rem"},
                iconTheme: {primary: "#0093dd",}
            });
        }
    }, []);
    
    return (
        <>
        <div className = "student-add-request-container">
            <p className = "student-add-request-welcome">Add New Request🕘</p>
            <div className = "student-add-request-form-container">
                <div className = "student-add-request-form-inputs-container">
                    <div className = "student-add-request-form-inputs">
                        <p>Request Type</p>
                        <select value={reqtype} onChange={(event) => handleRequestTypeChange(event)}>
                            <option>Request Type</option>
                            {reqtypeDD.map((item, index) => (
                                <option key={index} value={item.value}>{item.description}</option>
                            ))}
                        </select>
                    </div>
                    <div className = "student-add-request-form-inputs">
                        <p>Reason</p>
                        <input type="text" placeholder="Reason" value={reason} onChange={(event) => handleReasonChange(event)}></input>
                    </div>
                </div>
                <div className = "student-add-request-form-inputs-container">
                    <div className = "student-add-request-form-inputs">
                        <p>From Date</p>
                        <input type="date" value={fromdate} onChange={(event) => handleFromDateChange(event)}></input>
                    </div>
                    <div className = "student-add-request-form-inputs">
                        <p>To Date</p>
                        <input type="date" value={todate} onChange={(event) => handleToDateChange(event)}></input>
                    </div>
                </div>
                <div className = "student-add-request-form-inputs-container">
                    <div className = "student-add-request-form-inputs">
                        <p>Session</p>
                        <select value={session} onChange={(event) => handleSessionChange(event)}>
                            <option>Session</option>
                            {sessionDD.map((item, index) => (
                                <option key={index} value={item.value}>{item.description}</option>
                            ))}
                        </select>
                    </div>
                    <div className = "student-add-request-form-inputs">
                        <p>Proof Drive Link [If any]</p>
                        <input type="url" placeholder="Proof Drive Link" value={prooflink} onChange={(event) => handleDriveLink(event)}></input>
                    </div>
                </div>
            </div>
            
            <div className = "admin-adduser-form-buttons">
                <button onClick={handleAddRequest}>Add Request</button>
            </div>
        </div>
        <Toaster toastOptions={{duration: 5000}}/> 
        </>
    )
}