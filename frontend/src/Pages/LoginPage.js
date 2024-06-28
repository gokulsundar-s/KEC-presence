import { React, useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
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

    useEffect(() => {
        if(Cookies.get('data') === undefined){
          navigate("/");
        }

        else{
          const jwt_data = jwtDecode(Cookies.get('data'));
          
          if(jwt_data.usertype === "Advoicer"){
            navigate("/advoicer");
          }
          else if(jwt_data.usertype === "Student"){
            navigate("/student");
          }
          else if(jwt_data.usertype === "Admin"){
            navigate("/admin");
          }
        }
    },[navigate]);

    const handleLogin = async () => {
        try{
            if(mail === ""){
                toast.error("Please enter your mail ID");
            }
            else if(password === ""){
                toast.error("Please enter your password");

            }
            else{
                const result = await axios.post('http://localhost:3003/login', { mail,password });
            
                if(result.data !== "failed"){
                    Cookies.set('data',result.data,{ expires: 1 });
                    const jwt_data = jwtDecode(result.data);
                
                    if(jwt_data.usertype === "Admin" ){
                        navigate("/admin");
                    }
                    else if(jwt_data.usertype === "Student"){
                        navigate("/student");
                    }
                    else if(jwt_data.usertype === "Class advoicer"){
                        navigate("/advoicer");
                    }
                    else if(jwt_data.usertype === "Year incharge"){
                        navigate("/year-incharge");
                    }
                }
                else if(result.data === "wrongpass"){
                    toast.error("Invalid password!!");
                }
                else if(result.data === "nouser"){
                    toast.error("No user found!!");
                }
            }
        }
        catch(error){
            toast.error("Error in user authentication");
        }
    };


    return (
        <>
            <div className = "login-box-container">
                <img src={require("../../src/Sources/Login-page.png")} alt = "Login Page"></img>
             
                <div className = "login-form-container">
                    <img src={require("../../src/Sources/KEC 2.png")} alt = "KEC Logo"></img>
                    
                    <div className = "login-form-container">
                        <p><b>Please login to your account</b></p>
                        
                        <form action = "login" onSubmit={(event) => event.preventDefault()}>
                            <div className = "login-form-input-container">
                                <p>Kongu Mail ID</p>
                                <input type = "mail" placeholder = "Kongu Mail ID" className = "login-form-input" value={mail} onChange={(event) => handleMailChange(event)} required></input>
                            </div>
                            
                            <div className = "login-form-input-container">
                                <p>Password</p>
                                <input type={showpassword ? 'text' : 'password'} placeholder = "Password" className = "login-form-input"  value={password} onChange={handlePasswordChange} required></input>
                            </div>
                            
                            <div className = "login-form-forgot-password-container">
                                <div className = "login-show-password">
                                    <input type = "checkbox" checked={showpassword} onChange={handleCheckboxChange}></input>
                                    <label/>Show password
                                </div>

                                <div className = "login-forget-password">
                                    <a href = "/forgot-password">Forgot password?</a>
                                </div>
                            </div>
                            
                            <div className = "login-form-button-container">
                                <button type = "submit" value = "login" className = "login-form-button" onClick={handleLogin}>Login</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        <Toaster toastOptions={{duration: 5000}}/>
        </>
    )
}