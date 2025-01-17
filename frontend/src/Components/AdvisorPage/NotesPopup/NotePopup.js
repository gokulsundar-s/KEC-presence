import React, { useState } from "react";
import "./NotesPopup.css";

export default function NotesPopup() {
    return (
        <div className = "notes-popup-container">
            <div className = "notes-popup-box">
                <p className = "notes-popup-header"><b>Give your notes here</b></p>

                <div className = "notes-popup-close">
                    <button><img src={require("../../../Sources/close.png")} alt="close"></img></button>
                </div>

                <div className = "notes-popup-input-container">
                    <textarea className = "notes-popup-input-container-inputs"></textarea>
                </div>

                <div className = "notes-popup-buttons-container">
                    <button className = "notes-popup-blue-button">Update</button>
                </div>
            </div>
        </div>
    )
}