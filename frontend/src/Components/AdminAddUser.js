import { React, useState } from "react";
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import "../Styles/AdminAddUser.css";

export default function Adduser() {
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
    const [error, setError] = useState(true);

    const handleUsertypeChange = (event) => {
        setUsertype(event.target.value);
        if(event.target.value === "Student"){
            setDisableroll(false);
            setDisableyear(false);
            setDisablesection(false);
            setDisablepphone(false);
            setDisablepmail(false);
        }
        else if(event.target.value === "Class advoicer"){
            setDisableroll(true);
            setDisableyear(false);
            setDisablesection(false);
            setDisablepphone(true);
            setDisablepmail(true);
        }
        else if(event.target.value === "Year incharge"){
            setDisableroll(true);
            setDisableyear(false);
            setDisablesection(true);
            setDisablepphone(true);
            setDisablepmail(true);
        }
        else if(event.target.value === "Head of the department"){
            setDisableroll(true);
            setDisableyear(true);
            setDisablesection(true);
            setDisablepphone(true);
            setDisablepmail(true);
        }
    };
    const handleDepartmentChange = (event) => {
        setDepartment(event.target.value);
    };
    const handleNameChange = (event) => {
        setName(event.target.value);
    };
    const handleRollNumberChange = (event) => {
        setRoll(event.target.value);
    };
    const handleMailChange = (event) => {
        setMail(event.target.value);
    };
    const handleYearChange = (event) => {
        setYear(event.target.value);
    };
    const handleSectionChange = (event) => {
        setSection(event.target.value);
    };
    const handlePhoneChange = (event) => {
        setPhone(event.target.value);
    };
    const handlePphoneChange = (event) => {
        setPphone(event.target.value);
    };
    const handlePmailChange = (event) => {
        setPmail(event.target.value);
    };

    const handleAdduser = async () => {
        setName(name.toUpperCase());
        setRoll(roll.toUpperCase());
        
        if(usertype === "" || usertype === "User Type"){
            toast.error("Enter a valid user type");
        }

        else if(usertype === "Student"){
            if(department === "" || department === "Department"){
                toast.error("Enter a valid department");
            }
            else if(name === ""){
                toast.error("Enter a valid name");
            }
            else if(roll === "" && roll.length !== 8){
                toast.error("Enter a valid roll number");
            }
            else if(year === "" || year === "Year"){
                toast.error("Enter a valid year");
            }
            else if(section === "" || section === "Section"){
                toast.error("Enter a valid section");
            }
            else if(!mail || (!mail.includes("@kongu.edu") && !mail.includes("@kongu.ac.in"))){
                toast.error("Enter a valid kongu mail ID");
            }
            else if(phone === "" || phone.length !== 10){
                toast.error("Enter a valid phone number");
            }
            else if(pphone === "" || pphone.length !== 10){
                toast.error("Enter a valid parent's phone number");
            }
            else if(!pmail || !pmail.includes("@")){
                toast.error("Enter a valid parent's mail ID");
            }
            else{
                setError(false);
            }
        }
        
        else if(usertype === "Class advoicer"){
            if(department === "" || department === "Department"){
                toast.error("Enter a valid department");
            }
            else if(name === ""){
                toast.error("Enter a valid name");
            }
            else if(year === "" || year === "Year"){
                toast.error("Enter a valid year");
            }
            else if(section === "" || section === "Section"){
                toast.error("Enter a valid section");
            }
            else if(!mail || (!mail.includes("@kongu.edu") && !mail.includes("@kongu.ac.in"))){
                toast.error("Enter a valid kongu mail ID");
            }
            else if(phone === "" || phone.length !== 10){
                toast.error("Enter a valid phone number");
            }
            else{
                setError(false);
            }
        }
        
        else if(usertype === "Year incharge"){
            if(department === "" || department === "Department"){
                toast.error("Enter a valid department");
            }
            else if(name === ""){
                toast.error("Enter a valid name");
            }
            else if(year === "" || year === "Year"){
                toast.error("Enter a valid year");
            }
            else if(!mail || (!mail.includes("@kongu.edu") && !mail.includes("@kongu.ac.in"))){
                toast.error("Enter a valid kongu mail ID");
            }
            else if(phone === "" || phone.length !== 10){
                toast.error("Enter a valid phone number");
            }
            else{
                setError(false);
            }
        }
        
        else if(usertype === "Head of the department"){
            if(department === "" || department === "Department"){
                toast.error("Enter a valid department");
            }
            else if(name === ""){
                toast.error("Enter a valid name");
            }
            else if(!mail || (!mail.includes("@kongu.edu") && !mail.includes("@kongu.ac.in"))){
                toast.error("Enter a valid kongu mail ID");
            }
            else if(phone === "" || phone.length !== 10){
                toast.error("Enter a valid phone number");
            }
            else{
                setError(false);
            }
        }
        
        if(!error){
            try{
                const result = await axios.post('http://localhost:3003/adminadduser', { usertype, department, name, roll, mail, year,section, phone, pphone, pmail })

                if(result.data === "success"){
                    toast.success("New user added successfully!!");
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
                else if(result.data === "exists"){
                    toast.error("User already exists");
                }
                else if(result.data === "error"){
                    toast("Error in adding a new user",)
                }
            }
            catch(error){
                toast.error("Error in adding a new user");
            }
        }
    }
    
    return(
        <>
        <p className = "page-header">Add new user</p>
            
        <form className = "admin-adduser-form-container" action = "submit" onSubmit={(event) => event.preventDefault()}>
            <div className = "admin-adduser-input-main-container">
                <div className = "admin-adduser-input-container">
                    <p>User Type</p>
                    <select value={usertype} onChange={(event) => handleUsertypeChange(event)} require="true">                                    
                        <option>User Type</option>
                        <option>Student</option>
                        <option>Class advoicer</option>
                        <option>Year incharge</option>
                        <option>Head of the department</option>
                    </select>
                </div>
                <div className = "admin-adduser-input-container">
                    <p>Department</p>
                    <select value={department} onChange={(event) => handleDepartmentChange(event)} require="true">
                        <option>Department</option>
                        <option>Artificial Intelligence and Data Science</option>
                        <option>Artificial Intelligence and Machine Learning</option>
                        <option>Automobile Engineering</option>
                        <option>Chemical Engineering</option>
                        <option>Civil Engineering</option>
                        <option>Computer Application</option>
                        <option>Computer Science and Engineering</option>
                        <option>Computer Science and Design</option>
                        <option>Computer Technology - PG</option>
                        <option>Computer Technology - UG</option>
                        <option>Electrical and Electronics Engineering</option>
                        <option>Electronics and Communication Engineering</option>
                        <option>Electronics and Instrumentation Engineering</option>
                        <option>Food technology</option>
                        <option>Information Technology</option>
                        <option>Mechanical Engineering</option>
                        <option>Mechatronics Engineering</option>
                    </select>
                </div>
            </div>

            <div className = "admin-adduser-input-main-container">
                <div className = "admin-adduser-input-container">
                    <p>Name</p>
                    <input placeholder = "Name" type = "text" value={name} onChange={(event) => handleNameChange(event)} require="true"></input>
                </div> 
                <div className = "admin-adduser-input-container">
                    <p>Roll Number</p>
                    <input placeholder = "Roll Number" type = "text" value={roll} onChange={(event) => handleRollNumberChange(event)} require="true" disabled={disableroll} className={disableroll === true ? 'disable' : ''}></input>
                </div>
            </div>

            <div className = "admin-adduser-input-main-container">
                <div className = "admin-adduser-input-container">
                    <p>Year</p>
                    <select value={year} onChange={(event) => handleYearChange(event)} require="true" disabled={disableyear} className={disableyear === true ? 'disable' : ''}>
                        <option>Year</option>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                    </select>
                </div>
                <div className = "admin-adduser-input-container">
                    <p>Section</p>
                    <select value={section} onChange={(event) => handleSectionChange(event)} require="true" disabled={disablesection} className={disablesection === true ? 'disable' : ''}>
                        <option>Section</option>
                        <option>A</option>
                        <option>B</option>
                        <option>C</option>
                        <option>D</option>
                    </select>
                </div>
            </div>

            <div className = "admin-adduser-input-main-container">
                <div className = "admin-adduser-input-container">
                    <p>Mail ID</p>
                    <input placeholder = "Kongu Mail ID" type = "mail" value={mail} onChange={(event) => handleMailChange(event)} require="true"></input>
                </div>
                        
                <div className = "admin-adduser-input-container">
                    <p>Phone Number</p>
                    <input placeholder = "Phone number" type = "tel" value={phone} onChange={(event) => handlePhoneChange(event)} require="true"></input>
                </div>
            </div>
                    
            <div className = "admin-adduser-input-main-container">
                <div className = "admin-adduser-input-container">
                    <p>Parent's Mail ID</p>
                    <input placeholder = "Parent's Mail ID" type = "mail" value={pmail} onChange={(event) => handlePmailChange(event)} require="true" disabled={disablepmail} className={disablepmail === true ? 'disable' : ''}></input>
                </div>
                <div className = "admin-adduser-input-container">
                    <p>Parent's Phone Number</p>
                    <input placeholder = "Parent's Phone Number" type = "tel" value={pphone} onChange={(event) => handlePphoneChange(event)} require="true" disabled={disablepphone} className={disablepphone === true ? 'disable' : ''}></input>
                </div>
            </div>
            <div className = "admin-adduser-button-container">
                <button onClick={() => handleAdduser()}>Submit</button>
            </div>
        </form>
      <Toaster toastOptions={{duration: 5000}}/>
        </>
    )
}