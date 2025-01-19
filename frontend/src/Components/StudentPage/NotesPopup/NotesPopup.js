import React, { useState, useEffect } from "react";
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import "./NotesPopup.css";

export default function NotesPopup({handleCloseNotesPopup, notesID}) {
    const [advisorNotes, setAdvisorNotes] = useState("");
    const [inchargeNotes, setInchargeNotes] = useState("");

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const response = await axios.post("http://localhost:3003/get-notes", { notesID });
                   
                if (response.data.status === 200) {
                    setAdvisorNotes(response.data.advisorNotes);
                    setInchargeNotes(response.data.inchargeNotes);
                }
            } catch (error) {
                console.error("Error fetching notes:", error);
            }
        };
    
        fetchNotes();
    }, [notesID]);

    return (
        <div className = "student-notes-popup-container">
            <div className = "student-notes-popup-box">
                <p className = "student-notes-popup-header"><b>Check your messages here</b></p>

                <div className = "student-notes-popup-close">
                    <button onClick={() => handleCloseNotesPopup(false)}><img src={require("../../../Sources/close.png")} alt="close"></img></button>
                </div>

                <div className = "student-notes-popup-input-container">
                    <p>Class Advisor Message</p>
                    <textarea className = "student-notes-popup-input-container-inputs" value={advisorNotes} disabled={true}></textarea>
                </div>
                <div className = "student-notes-popup-input-container">
                    <p>Year Incharge Message</p>
                    <textarea className = "student-notes-popup-input-container-inputs" value={inchargeNotes} disabled={true}></textarea>
                </div>
            </div>
        </div>
    )
}