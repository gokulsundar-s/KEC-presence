import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import "../Styles/LoginPage.css";

export default function LoginPage() {
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [showpassword, setShowPassword] = useState(false);
    const [error, setError] = useState(false);

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
                const jwt_data = jwtDecode(result.data);
                if(jwt_data.usertype === "Admin" ){
                    navigate("/admin");
                }
                else if(jwt_data.usertype === "Student"){
                    navigate("/student");
                }
            }

            else if(result.data === "failed"){
                setError("Invalid mail ID or password!!");
            }
        }
        catch(error){
            setError("Some error occured!! Try again!!");
        }
    };

    return (
         <div className = "loginpage-container">
            
            <div className = "loginpage-left-container">
                <img src={require("../../src/Sources/clock-image.png")} alt = "clock"></img>
            </div>

            <div className = "loginpage-right-container">
                <div className = "loginpage-right-header">
                    <img src={require("F:/Projects/kecpresence/frontend/src/Sources/KEC 2.png")} alt = "clock"></img>
                    <h4>Sign In</h4>
                    <p>Welcome back. Please login to your account.</p>
                </div>
                    
                <form action = "login" onSubmit={(event) => event.preventDefault()}>
                    <div className = "loginpage-right-input">
                        <p>Email</p>
                        <input placeholder = "kongu mail ID" type = "mail" value={mail} onChange={(event) => handleMailChange(event)} required></input>
                    </div>

                    <div className = "loginpage-right-input">
                        <p>Password</p>
                        <input placeholder = "Password" type={showpassword ? 'text' : 'password'} value={password} onChange={handlePasswordChange} required></input>
                    </div>

                    <div className = "loginpage-forgetpassword-container">
                        <div className = "show-password">
                            <input type = "checkbox" checked={showpassword} onChange={handleCheckboxChange}></input>
                            <label/>Show password
                        </div>

                        <div className = "forget-password">
                            <a href = "loginpage.html">Forgot password?</a>
                        </div>
                    </div>

                    <div className = "loginpage-right-button">
                        <button type = "submit" value = "login" onClick={handleLogin}>Login</button>
                    </div>
                    
                    <div className = "loginpage-error-container">
                        <p>{error}</p>
                    </div>

                </form>
            </div>
        </div>
    )
}