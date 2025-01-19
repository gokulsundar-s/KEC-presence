import React, { useState, useEffect } from "react";
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import "./NotesPopup.css";

export default function NotesPopup({handleCloseNotesPopup, notesID}) {
    const [notes, setNotes] = useState("");
    
    const handleNotesChange = (event) => setNotes(event.target.value);

    const handleUpdateNotes = async () => {
        try {
            const response = await axios.post("http://localhost:3003/advisor-add-notes", { notesID, notes });
            if (response.data.status === 200) {
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Server error. Try again after some time.");
        }
    };

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const response = await axios.post("http://localhost:3003/advisor-old-notes", { notesID });
                    
                if (response.data.status === 200) {
                    setNotes(response.data.message);
                }
            } catch (error) {
                console.error("Error fetching notes:", error);
            }
        };
    
        fetchNotes();
    }, [notesID]);

    return (
        <div className = "notes-popup-container">
            <div className = "notes-popup-box">
                <p className = "notes-popup-header"><b>Give your notes here</b></p>

                <div className = "notes-popup-close">
                    <button onClick={() => handleCloseNotesPopup(false)}><img src={require("../../../Sources/close.png")} alt="close"></img></button>
                </div>

                <div className = "notes-popup-input-container">
                    <textarea className = "notes-popup-input-container-inputs" onChange={(event) => handleNotesChange(event)} value={notes}></textarea>
                </div>

                <div className = "notes-popup-buttons-container">
                    <button className = "notes-popup-blue-button" onClick={handleUpdateNotes}>Update</button>
                </div>
            </div>
        </div>
    )
}