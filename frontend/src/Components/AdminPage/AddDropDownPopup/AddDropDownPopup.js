import React, { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";
import "./AddDropDownPopup.css";

export default function AddDropDownPopup({handleAddDropDown}) {
    const [type, setType] = useState("");
    const [value, setValue] = useState("");
    const [description, setDescription] = useState("");

    const handleTypeChange = (event) => setType(event.target.value);
    const handleValueChange = (event) => setValue(event.target.value);
    const handleDescriptionChange = (event) => setDescription(event.target.value);

    const handleUpdateValues = async() => {
        try {
            const response = await axios.post("http://localhost:3003/add-dropdown", {type, value, description});
    
            if(response.data.status === 200) {
                toast.success(response.data.message,{
                    position: "top-center",
                    style: {color: "#004aad", fontSize: "1rem"},
                    iconTheme: {primary: "#0093dd",}
                });
                setType("");
                setValue("");
                setDescription("");
            } else {
                toast.error(response.data.message,{
                    position: "top-center",
                    style: {color: "#004aad", fontSize: "1rem"},
                    iconTheme: {primary: "#0093dd",}
                });
            }
        } catch (error) {
            toast.error("Server error. Try again later.",{
                position: "top-center",
                style: {color: "#004aad", fontSize: "1rem"},
                iconTheme: {primary: "#0093dd",}
            });
        }
    }

    return (
        <>
        <div className = "admin-adddropdown-popup-container">
            <div className = "admin-adddropdown-popup-box">
                <div className = "admin-adddropdown-popup-close">
                    <button onClick={handleAddDropDown}><img src={require("../../../Sources/close.png")} alt="close"></img></button>
                </div>
                <p className = "admin-adddropdown-popup-header">Add Dropdowns</p>
                <div className = "admin-adddropdown-popup-form">
                    <div className = "admin-adddropdown-popup-inputs">
                        <p>Dropdown Type</p>
                        <select value = {type} onChange={(event) => handleTypeChange(event)}>
                            <option>Dropdown Type</option>
                            <option>User Type</option>
                            <option>Department</option>
                            <option>Year</option>
                            <option>Sections</option>
                            <option>Session</option>
                            <option>Request Type</option>
                            <option>Holiday Type</option>
                        </select>
                    </div>
                    <div className = "admin-adddropdown-popup-inputs">
                        <p>Dropdown Value</p>
                        <input placeholder="Dropdown Value" value = {value} onChange={(event) => handleValueChange(event)}></input>
                    </div>
                    <div className = "admin-adddropdown-popup-inputs">
                        <p>Dropdown Description</p>
                        <input placeholder="Dropdown Description" value = {description} onChange={(event) => handleDescriptionChange(event)}></input>
                    </div>
                    <div className = "admin-adddropdown-popup-button">
                        <button onClick={handleUpdateValues}>Add</button>
                    </div>
                </div>
            </div>
        </div>
        <Toaster toastOptions={{duration: 5000}}/> 
        </>
    )
}