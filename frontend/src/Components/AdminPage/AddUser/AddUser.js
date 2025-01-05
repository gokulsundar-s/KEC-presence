import React, { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";
import "./AddUser.css";

export default function AddUser() {
    const [usertypeDD, setUsertypeDD] = useState([]);
    const [departmentDD, setDepartmentDD] = useState([]);
    const [yearDD, setYearDD] = useState([]);
    const [sectionDD, setSectionDD] = useState([]);

    const [usertype, setUsertype] = useState('');
    const [department, setDepartment] = useState('');
    const [name, setName] = useState('');
    const [roll, setRoll] = useState('');
    const [mail, setMail] = useState('');
    const [year, setYear] = useState('');
    const [section, setSection] = useState('');
    const [phone, setPhone] = useState('');
    const [pphone, setPphone] = useState('');
    const [pmail, setPmail] = useState('');

    const [disableroll, setDisableroll] = useState(false);
    const [disableyear, setDisableyear] = useState(false);
    const [disablesection, setDisablesection] = useState(false);
    const [disablepphone, setDisablepphone] = useState(false);
    const [disablepmail, setDisablepmail] = useState(false);

    const handleUsertypeChange = (event) => {        
        setUsertype(event.target.value);
        if(event.target.value === "STU"){
            setDisableroll(false);
            setDisableyear(false);
            setDisablesection(false);
            setDisablepphone(false);
            setDisablepmail(false);
        }
        else if(event.target.value === "CA"){
            setDisableroll(true);
            setDisableyear(false);
            setDisablesection(false);
            setDisablepphone(true);
            setDisablepmail(true);
        }
        else if(event.target.value === "YI"){
            setDisableroll(true);
            setDisableyear(false);
            setDisablesection(true);
            setDisablepphone(true);
            setDisablepmail(true);
        }
        else if(event.target.value === "HOD"){
            setDisableroll(true);
            setDisableyear(true);
            setDisablesection(true);
            setDisablepphone(true);
            setDisablepmail(true);
        }
    };
    const handleDepartmentChange = (event) => setDepartment(event.target.value);
    const handleNameChange = (event) => setName(event.target.value);
    const handleRollNumberChange = (event) => setRoll(event.target.value);
    const handleMailChange = (event) => setMail(event.target.value);
    const handleYearChange = (event) => setYear(event.target.value);
    const handleSectionChange = (event) => setSection(event.target.value);
    const handlePhoneChange = (event) => setPhone(event.target.value);
    const handlePphoneChange = (event) => setPphone(event.target.value);
    const handlePmailChange = (event) => setPmail(event.target.value);

    const handleAdduser = async () => {
        try{
            const response = await axios.post('http://localhost:3003/adminadduser', { usertype, department, name, roll, mail, year, section, phone, pphone, pmail });
            if(response.data.status === 400) {
                toast.error(response.data.message,{
                    position: "top-center",
                    style: {color: "#004aad", fontSize: "1rem"},
                    iconTheme: {primary: "#0093dd",}
                });
            } else {
                toast.success(response.data.message,{
                    position: "top-center",
                    style: {color: "#004aad", fontSize: "1rem"},
                    iconTheme: {primary: "#0093dd",}
                });

                setMail("");
                setUsertype("");
                setDepartment("");
                setName("");
                setRoll("");
                setYear("");
                setSection("");
                setPhone("");
                setPphone("");
                setPmail("");  
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
            const handleUserTypeDropDown = async() => {
                const type = "User Type";
                const response = await axios.post("http://localhost:3003/get-dropdown", {type});
                const ddArray = response.data.map((item, index) => ({
                    value: response.data[index].value,
                    description: response.data[index].description
                }));
                setUsertypeDD(ddArray);
            }
            const handleDepartmentDropDown = async() => {
                const type = "Department";
                const response = await axios.post("http://localhost:3003/get-dropdown", {type});
                const ddArray = response.data.map((item, index) => ({
                    value: response.data[index].value,
                    description: response.data[index].description
                }));
                setDepartmentDD(ddArray);
            }
            const handleYearDropDown = async() => {
                const type = "Year";
                const response = await axios.post("http://localhost:3003/get-dropdown", {type});
                const ddArray = response.data.map((item, index) => ({
                    value: response.data[index].value,
                    description: response.data[index].description
                }));
                setYearDD(ddArray);
            }
            const handleSectionDropDown = async() => {
                const type = "Sections";
                const response = await axios.post("http://localhost:3003/get-dropdown", {type});
                const ddArray = response.data.map((item, index) => ({
                    value: response.data[index].value,
                    description: response.data[index].description
                }));
                setSectionDD(ddArray);
            }

            handleUserTypeDropDown();
            handleDepartmentDropDown();
            handleYearDropDown();
            handleSectionDropDown();
        } catch (error) {
            toast.error("Server error. Try again after sometimes.",{
                position: "top-center",
                style: {color: "#004aad", fontSize: "1rem"},
                iconTheme: {primary: "#0093dd",}
            });
        }
    }, []);

    return(
        <>
        <div className = "admin-adduser-container">
            <p className = "admin-adduser-welcome">Add New User😎</p>
            <div className = "admin-adduser-form">
                <div className = "admin-adduser-form-inputs-container">
                    <div className = "admin-adduser-form-inputs">
                        <p>User Type</p>
                        <select value={usertype} onChange={(event) => handleUsertypeChange(event)} require="true">                                    
                            <option>User Type</option>
                            {usertypeDD.map((item, index) => (
                                <option key={index} value={item.value}>{item.description}</option>
                            ))}
                        </select>
                    </div>
                    <div className = "admin-adduser-form-inputs">
                        <p>Department</p>
                        <select value={department} onChange={(event) => handleDepartmentChange(event)} require="true">                              
                            <option>Department</option>
                            {departmentDD.map((item, index) => (
                                <option key={index} value={item.value}>{item.description}</option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <div className = "admin-adduser-form-inputs-container">
                    <div className = "admin-adduser-form-inputs">
                        <p>Name</p>
                        <input type="text" placeholder="Name" value={name} onChange={(event) => handleNameChange(event)} require="true"/>
                    </div>
                    <div className = "admin-adduser-form-inputs">
                        <p>Roll Number</p>
                        <input type="text" placeholder="Roll Number" value={roll} onChange={(event) => handleRollNumberChange(event)} disabled={disableroll} require="true"/>
                    </div>
                </div>
                
                <div className = "admin-adduser-form-inputs-container">
                    <div className = "admin-adduser-form-inputs">
                        <p>Year</p>
                        <select value={year} onChange={(event) => handleYearChange(event)} disabled={disableyear} require="true">                              
                            <option>Year</option>
                            {yearDD.map((item, index) => (
                                <option key={index} value={item.value}>{item.description}</option>
                            ))}
                        </select>
                    </div>
                    <div className = "admin-adduser-form-inputs">
                        <p>Section</p>
                        <select value={section} onChange={(event) => handleSectionChange(event)} disabled={disablesection} require="true">                              
                            <option>Section</option>
                            {sectionDD.map((item, index) => (
                                <option key={index} value={item.value}>{item.description}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className = "admin-adduser-form-inputs-container">
                    <div className = "admin-adduser-form-inputs">
                        <p>Mail ID</p>
                        <input type="email" placeholder="Mail ID" value={mail} onChange={(event) => handleMailChange(event)} require="true"/>
                    </div>
                    <div className = "admin-adduser-form-inputs">
                        <p>Phone Number</p>
                        <input type="tel" placeholder="Phone Number" value={phone} onChange={(event) => handlePhoneChange(event)} require="true"/>
                    </div>
                </div>
                
                <div className = "admin-adduser-form-inputs-container">
                    <div className = "admin-adduser-form-inputs">
                        <p>Parent Mail ID</p>
                        <input type="email" placeholder="Parent Mail ID" value={pmail} onChange={(event) => handlePmailChange(event)} disabled={disablepphone} require="true"/>
                    </div>
                    <div className = "admin-adduser-form-inputs">
                        <p>Parent Phone Number</p>
                        <input type="tel" placeholder="Parent Phone Number" value={pphone} onChange={(event) => handlePphoneChange(event)}  disabled={disablepmail} require="true"/>
                    </div>
                </div>
            </div>

            <div className = "admin-adduser-form-buttons">
                <button onClick={() => handleAdduser()}>Add User</button>
            </div>
        </div>
        <Toaster toastOptions={{duration: 5000}}/> 
        </>
    )
}