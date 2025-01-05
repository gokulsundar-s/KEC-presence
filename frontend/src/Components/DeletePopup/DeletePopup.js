import React from "react";
import "./DeletePopup.css";

export default function DeletePopup({handleDelete, deleteType}) {
    return (
        <>
        <div className = "delete-popup-container">
          <div className = "delete-popup-box">
            <p className = "delete-popup-header">Are you sure to delete the {deleteType}?</p>

                    <div className = "delete-popup-buttons-container">
                        <button className = "delete-popup-button delete-popup-red-button" onClick={() => handleDelete(true)}>Yes</button>
                        <button className = "delete-popup-button delete-popup-white-button" onClick={() => handleDelete(false)}>No</button>
                    </div>
                </div>
            </div>
        </>
    )
}