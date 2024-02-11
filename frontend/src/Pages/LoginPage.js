import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "../Styles/LoginPage.css";

export default function LoginPage() {
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [showpassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    
    const handleMailChange = (event) => {
        setMail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleCheckboxChange = () => {
        setShowPassword(prevState => !prevState);
    };

    const handleLogin = async () => {
        try{
            const result = await axios.post('http://localhost:3003/login', { mail,password });
            
            if(result.data !== "failed"){
                Cookies.set('data',result.data,{ expires: 1 });
                const jwt_data = jwtDecode(result.data);
                
                toast.success("You have logged in successfully!!")
                
                if(jwt_data.usertype === "Admin" ){
                    navigate("/admin");
                }
                else if(jwt_data.usertype === "Student"){
                    navigate("/student");
                }
                else if(jwt_data.usertype === "Class advoicer"){
                    navigate("/advoicer");
                }
            }

            else if(result.data === "failed"){
                toast.error("Invalid mail ID or password!!");
            }
        }
        catch(error){
            toast.error("Some error occured! Try again!!");
        }
    };

    return (
        <div className = "loginpage-container">
            
            <div className = "loginpage-left-container">
                <img src={require("../../src/Sources/clock-image.png")} alt = "clock_image"></img>
            </div>
            
            <div className = "loginpage-right-container">
                <div className = "loginpage-right-container-header">
                    <img src={require("../../src/Sources/KEC 2.png")} alt = "KEC_logo"></img>
                    <h4>Sign In</h4>
                    <p>Welcome back. Please login to your account.</p>
                </div>
                
                <form action = "login" onSubmit={(event) => event.preventDefault()}>
                    <div className = "loginpage-input-container">
                        <p>Email</p>
                        <input placeholder = "kongu mail ID" type = "mail" value={mail} onChange={(event) => handleMailChange(event)} required></input>
                    </div>

                    <div className = "loginpage-input-container">
                        <p>Password</p>
                        <input placeholder = "Password" type={showpassword ? 'text' : 'password'} value={password} onChange={handlePasswordChange} required></input>
                    </div>

                    <div className = "loginpage-forgetpassword-container">
                        <div className = "show-password">
                            <input type = "checkbox" checked={showpassword} onChange={handleCheckboxChange}></input>
                            <label/>Show password
                        </div>

                        <div className = "forget-password">
                            <a href = "/">Forgot password?</a>
                        </div>
                    </div>

                    <div className = "buttons-container">
                        <button type = "submit" value = "login" onClick={handleLogin}>Login</button>
                    </div>
                </form>
            </div>
        </div>
    )
}