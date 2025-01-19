import React from "react";
import "./UserInfoPopup.css";

export default function UserInfoPopup({handleCloseUserInfoPopup, userinfodata}) {
    return (
        <>
        <div className = "admin-userinfo-popup-container">
            <div className = "admin-userinfo-popup-box">
                <div className = "admin-userinfo-popup-close">
                    <button onClick={handleCloseUserInfoPopup}><img src={require("../../../Sources/close.png")} alt="close"></img></button>
                </div>
                <p className = "admin-userinfo-popup-header">User Data</p>
                <div className = "admin-userinfo-popup-form">
                    <div className = "admin-userinfo-popup-inputs">
                        <p className = "admin-userinfo-header-p">Name :</p>
                        <p>{userinfodata.name}</p>
                    </div>
                    <div className = "admin-userinfo-popup-inputs">
                        <p className = "admin-userinfo-header-p">Roll Number :</p>
                        <p>{userinfodata.roll === "" ? "-" : userinfodata.roll}</p>
                    </div>
                </div>
                <div className = "admin-userinfo-popup-form">
                    <div className = "admin-userinfo-popup-inputs">
                        <p className = "admin-userinfo-header-p">Year :</p>
                        <p>{userinfodata.year === "" ? "-" : userinfodata.year}</p>
                    </div>
                    <div className = "admin-userinfo-popup-inputs">
                        <p className = "admin-userinfo-header-p">Section :</p>
                        <p>{userinfodata.section === "" ? "-" : userinfodata.section}</p>
                    </div>
                </div>
                <div className = "admin-userinfo-popup-form">
                    <div className = "admin-userinfo-popup-inputs">
                        <p className = "admin-userinfo-header-p">Mail ID :</p>
                        <p>{userinfodata.mail}</p>
                    </div>
                </div>
                <div className = "admin-userinfo-popup-form">
                    <div className = "admin-userinfo-popup-inputs">
                        <p className = "admin-userinfo-header-p">Phone Number :</p>
                        <p>{userinfodata.phone}</p>
                    </div>
                </div>
                <div className = "admin-userinfo-popup-form">
                    <div className = "admin-userinfo-popup-inputs">
                        <p className = "admin-userinfo-header-p">Parent Mail ID :</p>
                        <p>{userinfodata.pmail === "" ? "-" : userinfodata.pmail}</p>
                    </div>
                </div>
                <div className = "admin-userinfo-popup-form">
                <div className = "admin-userinfo-popup-inputs">
                        <p className = "admin-userinfo-header-p">Parent Phone Number :</p>
                        <p>{userinfodata.pphone === "" ? "-" : userinfodata.pphone}</p>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}