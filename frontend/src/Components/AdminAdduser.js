import { React, useState } from "react";
import axios from 'axios';
import "../Styles/AdminPage.css";

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
    const [errormessage, setErrormessage] = useState('');
    const [successmessage, setSuccessmessage] = useState('');

    const handleUsertypeChange = (event) => {
        setUsertype(event.target.value);
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
            setErrormessage("Enter a valid user type!!");
            setSuccessmessage("");
        }
        
        else if(department === "" || department === "Department"){
            setErrormessage("Enter a valid department!!");
            setSuccessmessage("");
        }
        else if(name === ""){
            setErrormessage("Enter a valid name!!");
            setSuccessmessage("");
            
        }
        else if(roll === "" && roll.length !== 8){
            setErrormessage("Enter a valid roll number!!");
            setSuccessmessage("");
        }
        else if(year === "" || year === "Year"){
            setErrormessage("Enter a valid year!!");
            setSuccessmessage("");
        }
        else if(section === "" || section === "Section"){
            setErrormessage("Enter a valid section!!");
            setSuccessmessage("");
        }
        else if(!mail || (!mail.includes("@kongu.edu") && !mail.includes("@kongu.ac.in"))){
            setErrormessage("Enter a valid kongu mail ID!!");
            setSuccessmessage("");
        }
        else if(phone === "" || phone.length !== 10){
            setErrormessage("Enter a valid phone number!!");
            setSuccessmessage("");
        }
        else if(pphone === "" || pphone.length !== 10){
            setErrormessage("Enter a valid parent's phone number!!");
            setSuccessmessage("");
        }
        else if(!pmail || !pmail.includes("@")){
            setErrormessage("Enter a valid parent's mail ID!!");
            setSuccessmessage("");
        }
        else{
            try{
                const result = await axios.post('http://localhost:3003/adduser', { usertype, department, name, roll, mail, year,section, phone, pphone, pmail })

                if(result.data === "success"){
                    setErrormessage("");
                    setSuccessmessage("New user added successfully!!");
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
                    setSuccessmessage("");
                    setErrormessage("User mail already exists!!");
                }
                else if(result.data === "error"){
                    setSuccessmessage("");
                    setErrormessage("Error in adding a new user!!")
                }
            }

            catch(error){
                setSuccessmessage("");
                setErrormessage("Some error occured! Try again!!");
            }
        }
    }
    
    return(
        <div className = "adminadd-container">
            <p className = "components-header">Add new user</p>
            
            <div className = "adminadd-form-container">
                <form action = "submit" onSubmit={(event) => event.preventDefault()}>
                    
                    <div className = "form-input-container-block">
                        <div className = "form-input-container">
                            <p>User Type</p>
                            <select value={usertype} onChange={(event) => handleUsertypeChange(event)} require="true">                                    
                                <option>User Type</option>
                                <option>Student</option>
                                <option>Class advoicer</option>
                                <option>Year incharge</option>
                                <option>Head of the department</option>
                            </select>
                        </div>
         
                        <div className = "form-input-container">
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
                                <option>Science and Humanity</option>
                            </select>
                        </div>
                    </div>

                    <div className = "form-input-container-block">
                        <div className = "form-input-container">
                            <p>Name</p>
                            <input placeholder = "Name" type = "text" value={name} onChange={(event) => handleNameChange(event)} require="true"></input>
                        </div>
                            
                        <div className = "form-input-container">
                            <p>Roll Number</p>
                            <input placeholder = "Roll Number" type = "text" value={roll} onChange={(event) => handleRollNumberChange(event)} require="true"></input>
                        </div>
                    </div>

                    <div className = "form-input-container-block">
                        <div className = "form-input-container">
                            <p>Year</p>
                            <select value={year} onChange={(event) => handleYearChange(event)} require="true">
                                <option>Year</option>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </select>
                        </div>
                        
                        <div className = "form-input-container">
                            <p>Section</p>
                            <select value={section} onChange={(event) => handleSectionChange(event)} require="true">
                                <option>Section</option>
                                <option>A</option>
                                <option>B</option>
                                <option>C</option>
                                <option>D</option>
                            </select>
                        </div>
                    </div>

                    <div className = "form-input-container-block">
                        <div className = "form-input-container">
                            <p>Mail ID</p>
                            <input placeholder = "Kongu Mail ID" type = "mail" value={mail} onChange={(event) => handleMailChange(event)} require="true"></input>
                        </div>
                        
                        <div className = "form-input-container">
                            <p>Phone Number</p>
                            <input placeholder = "Phone number" type = "tel" value={phone} onChange={(event) => handlePhoneChange(event)} require="true"></input>
                        </div>
                    </div>
                    
                    <div className = "form-input-container-block">
                        <div className = "form-input-container">
                            <p>Parent's Phone Number</p>
                            <input placeholder = "Parent's Phone Number" type = "tel" value={pphone} onChange={(event) => handlePphoneChange(event)} require="true"></input>
                        </div>

                        <div className = "form-input-container">
                            <p>Parent's Mail ID</p>
                            <input placeholder = "Parent's Mail ID" type = "mail" value={pmail} onChange={(event) => handlePmailChange(event)} require="true"></input>
                        </div>
                    </div>
                        
                    <div className = "form-buttons-container">
                        <button onClick={() => handleAdduser()}>Submit</button>
                    </div>
                    
                    <p className = "error-container">{errormessage}</p>
                    <p className = "success-container">{successmessage}</p>
                </form>
            </div>
        </div>
    )
}