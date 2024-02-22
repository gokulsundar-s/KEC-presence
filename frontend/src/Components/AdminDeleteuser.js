import { React,useState } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import "../Styles/AdminPage.css";

export default function Deleteuser() {
    const [mail, setMail] = useState('');

    const handleMailChange = (event) => {
        setMail(event.target.value);
    };
    const handleDeleteuser = async () => {
        if(!mail || (!mail.includes("@kongu.edu") && !mail.includes("@kongu.ac.in"))){
            toast.error("Enter a valid kongu mail ID!!");
        }
        else{
            try{
                const result = await axios.post('http://localhost:3003/admindeleteuser', { mail });

                if(result.data === "not-found"){
                    toast.error("Entered mail ID doesn't exists!!");
                }
                else if(result.data === "success"){
                    toast.success("User removed successfully!!");
                    setMail("");
                }
                else if(result.data === "error"){
                    toast.error("Error in removing user data!!");
                }
            }
            catch(error){
                toast.errore("Some error occured!!");
            }
        }
    }
    
    return(
        <div className = "admindelete-container">
            <p className = "components-header">Delete user</p>
            
            <form action = "submit" onSubmit={(event) => event.preventDefault()}>
                <div className = "form-input-container-block">
                    <div className = "form-input-container">
                        <p>Mail ID :</p>
                        <input placeholder = "Kongu Mail ID" type = "mail" value={mail} onChange={handleMailChange} require="true"></input>
                    </div>

                    <div className = "form-buttons-container delete-button">
                        <button type = "submit" value = "login" onClick={handleDeleteuser}>Delete</button>
                    </div>
                </div>
            </form>
        </div>
    )
}