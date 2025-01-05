import React, { useState } from "react";
import AddDropDownPopup from "../AddDropDownPopup/AddDropDownPopup";
import DateConfigPopup from "../DateConfigPopup/DateConfigPopup";
import "./Configurations.css";

export default function Configurations() {
    const [addDropDown, setAddDropDown] = useState(false);
    const [addDateConfig, setAddDateConfig] = useState(false);

    const handleAddDropDown = () => setAddDropDown(!addDropDown);
    const handleAddDateConfig = () => setAddDateConfig(!addDateConfig);

    return (
        <>
        <div className = "admin-configurations-container">
            <p className = "admin-configurations-welcome">Admin Configurations⌛</p>
            <div className = "admin-configurations-buttons-container">
                <div className = "admin-configurations-buttons">
                    <button onClick={handleAddDropDown}>
                        <img src={require("../../../Sources/dropdown.png")} alt="logo1"></img>
                        <p>Add Dropdowns Configurations</p>
                    </button>
                    <button onClick={handleAddDateConfig}>
                        <img src={require("../../../Sources/date-config.png")} alt="logo1"></img>
                        <p>Holiday Configurations</p>
                    </button>
                </div>
            </div>
        </div>
        {addDropDown && <AddDropDownPopup handleAddDropDown={handleAddDropDown}/>}
        {addDateConfig && <DateConfigPopup handleAddDateConfig={handleAddDateConfig}/>}
        </>
    )
}