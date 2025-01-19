import React, { useState, useEffect } from "react";
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import "./EditStatusPopup.css";

export default function EditStatusPopup({handleCloseStatusPopup, editStatusID, editStatusValue}) {
    const [statusValue, setStatusValue] = useState(editStatusValue);
    
    const handleStatusChange = (event) => setStatusValue(event.target.value);

    const handleUpdateStatus = async () => {
        try {
            const id = editStatusID;
            const status = statusValue === 'Accept' ? 'accepted' : 'rejected';

            const response = await axios.post("http://localhost:3003/advisor-req-update", {id, status});
            if (response.data.status === 200) {
                toast.success(response.data.message);
                handleCloseStatusPopup(false);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Server error. Try again after some time.");
        }
    };

    return (
        <div className = "edit-status-popup-container">
            <div className = "edit-status-popup-box">
                <p className = "edit-status-popup-header"><b>Edit your status here</b></p>

                <div className = "edit-status-popup-close">
                    <button onClick={() => handleCloseStatusPopup(false)}><img src={require("../../../Sources/close.png")} alt="close"></img></button>
                </div>

                <div className = "edit-status-popup-input-container">
                    <select className = "edit-status-popup-input-container-inputs" onChange={(event) => handleStatusChange(event)} value={statusValue}>
                        <option>Accept</option>
                        <option>Reject</option>
                    </select>
                </div>

                <div className = "edit-status-popup-buttons-container">
                    <button className = "edit-status-popup-blue-button" onClick={handleUpdateStatus}>Update</button>
                </div>
            </div>
        </div>
    )
}