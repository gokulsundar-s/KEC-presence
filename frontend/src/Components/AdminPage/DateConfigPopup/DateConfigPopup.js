import React, { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";
import "./DateConfigPopup.css";

export default function DateConfigPopup({handleAddDateConfig}) {
    const [date, setDate] = useState("");
    const [day, setDay] = useState("");
    const [value, setValue] = useState("");

    const handleDateChange = (event) => {
        setDate(event.target.value);
        const date = new Date(event.target.value);
        setDay(date.toLocaleDateString('en', {weekday: 'long'}));
    }
    const handleValueChange = (event) => setValue(event.target.value);
    
    const handleUpdateValues = async() => {
        try {
            const response = await axios.post("http://localhost:3003/date-config", {date, value });
    
            if(response.data.status === 200) {
                toast.success(response.data.message,{
                    position: "top-center",
                    style: {color: "#004aad", fontSize: "1rem"},
                    iconTheme: {primary: "#0093dd",}
                });
                setDate("");
                setValue("");
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
        <div className = "admin-date-config-popup-container">
            <div className = "admin-date-config-popup-box">
                <div className = "admin-date-config-popup-close">
                    <button onClick={handleAddDateConfig}><img src={require("../../../Sources/close.png")} alt="close"></img></button>
                </div>
                <p className = "admin-date-config-popup-header">Holiday Configurations</p>
                <div className = "admin-date-config-popup-form">
                    <div className = "admin-date-config-popup-inputs">
                        <p>Date</p>
                        <input type="date" value = {date} onChange={(event) => handleDateChange(event)}></input>
                    </div>
                    <div className = "admin-date-config-popup-inputs admin-date-config-popup-inputs-day">
                        <p>Day</p>
                        <input type="day" placeholder="Day" value = {day} onChange={(event) => handleDateChange(event)} disabled={true}></input>
                    </div>
                    <div className = "admin-date-config-popup-inputs">
                        <p>Day Type</p>
                        <select value = {value} onChange={(event) => handleValueChange(event)}>
                            <option>Day Type</option>
                            <option>Working Day</option>
                            <option>Public Holiday</option>
                            <option>Saturday Holiday</option>
                            <option>Sunday Holiday</option>
                        </select>
                    </div>
                    <div className = "admin-date-config-popup-button">
                        <button onClick={handleUpdateValues}>Add</button>
                    </div>
                </div>
            </div>
        </div>
        <Toaster toastOptions={{duration: 5000}}/> 
        </>
    )
}