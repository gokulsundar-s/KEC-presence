import { React,useState } from "react";
import axios from 'axios';
import "../Styles/AdminDeleteuser.css";

export default function Deleteuser() {
    const [mail, setMail] = useState('');
    const [errormessage, setErrormessage] = useState('');
    const [successmessage, setSuccessmessage] = useState('');

    const handleMailChange = (event) => {
        setMail(event.target.value);
    };
    const handleDeleteuser = async () => {
        if(!mail || (!mail.includes("@kongu.edu") && !mail.includes("@kongu.ac.in"))){
            setErrormessage("Enter a valid kongu mail ID!!");
            setSuccessmessage("");
        }
        else{
            try{
                const result = await axios.post('http://localhost:3003/deleteuser', { mail });

                if(result.data === "not-found"){
                    setSuccessmessage("");
                    setErrormessage("Entered mail ID doesn't exists!!");
                }
                else if(result.data === "success"){
                    setErrormessage("");
                    setSuccessmessage("User mail ID removed successfully!!");
                    setMail("");
                }
                else if(result.data === "error"){
                    setSuccessmessage("");
                    setErrormessage("Error in removing user data!!");
                }
            }
            catch(error){
                setSuccessmessage("");
                setErrormessage("Some error occured!!");
            }
        }
    }
    
    return(
        <div className = "admindelete-container">
            <p className = "admindelete-container-header">Delete user</p>
            
            <form className = "admindelete-form-container" action = "submit" onSubmit={(event) => event.preventDefault()}>
                <div className = "admindelete-input-container">
                    <div className = "admindelete-input-subcontainer">
                        <p>Mail ID :</p>
                        <input placeholder = "Kongu Mail ID" type = "mail" value={mail} onChange={handleMailChange} require="true"></input>
                    </div>

                    <div className = "admindelete-delete-button">
                        <button type = "submit" value = "login" onClick={handleDeleteuser}>Delete</button>
                    </div>
                </div>

                <div className = "admindelete-message-container">
                    <p className = "admindelete-error-message">{errormessage}</p>
                    <p className = "admindelete-success-message">{successmessage}</p>
                </div>
            </form>
        </div>
    )
}