import React, {useEffect, useState} from "react";
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Loader from "../../Components/Loader/Loader";
import "./LoginPage.css";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const [loadButton, setLoadButton] = useState(false);

    const handleMailIDChange = (event) => setMail(event.target.value);
    const handleShowPassword = () => setShowPassword(!showPassword);
    const handlePasswordChange = (event) => setPassword(event.target.value);

    const navigate = useNavigate();
    useEffect(() => {
        if(Cookies.get("authToken")){
            const user = jwtDecode(Cookies.get("authToken")).usertype;
            if(user === "ADMIN"){
                navigate("/admin");
            } else if(user === "STU"){
                navigate("/student");
            } else if(user === "CA"){
                navigate("/advisor");
            }
        } else {
            navigate("/");
        }
    },[Cookies.get("authToken")]);

    useEffect(() => {
        setTimeout(()=> {
            setIsLoading(false);
        }, [3000]);
    })

    const handleLogin = async() => {
        try{
            setLoadButton(true);
            const response = await axios.post("http://localhost:3003/login", {mail, password});

            if(response){
                setLoadButton(false);
            }
            
            if(response.data.status === 200) {
                Cookies.set("authToken", response.data.token);  
                const user = jwtDecode(response.data.token).usertype;
                
                if(user === "ADMIN"){
                    navigate("/admin");
                } else if(user === "STU"){
                    navigate("/student");
                } else if(user === "CA"){
                    navigate("/advisor");
                }
            } else {
                toast.error(response.data.message,{
                    position: "top-center",
                    style: {color: "#004aad", fontSize: "1rem"},
                    iconTheme: {primary: "#0093dd",}
                });
            }
        } catch(error) {
            setLoadButton(false);
            toast.error("Server error. Try again after sometimes.",{
                position: "top-center",
                style: {color: "#004aad", fontSize: "1rem"},
                iconTheme: {primary: "#0093dd",}
            });
        }
    }

    return (
        <>
        {isLoading &&<Loader/>}
        <div className = "loginpage-container">
            <div className = "login-form-container">
                <div className = "login-form-icon">
                    <img src={require("../../Sources/kec-logo-bg.png")} alt="login-image"/>
                </div>
                <p className = "login-welcome-header">Welcome back. Please login to your account.</p>
                <div className = "login-inputs-container">
                    <div className = "login-inputs">
                        <p>Kongu Mail ID</p>
                        <input type="email" placeholder="Kongu Mail ID" onChange={(event) => handleMailIDChange(event)} />
                    </div>
                    <div className = "login-inputs">
                        <p>Password</p>
                        <input type={showPassword ? "text" : "password"} placeholder="Password" onChange={(event) => handlePasswordChange(event)} />
                    </div>
                    <div className = "login-bottom-container">
                        <div className = "show-password-container">
                            <input type="checkbox" onChange={handleShowPassword}/>
                            <p>Show Password</p>
                        </div>
                        <a href="/">Forget Password?</a>
                    </div>
                    <div className = "login-botton-container">
                        {loadButton ? 
                            <div className = "login-load-button">
                                <span class="loader"></span>
                            </div> : 
                            <div className = "login-button">
                                <button onClick={handleLogin}>Login</button>
                            </div>
                        }
                    </div>
                    
                </div>
            </div>
        </div>
        <Toaster toastOptions={{duration: 5000}}/> 
        </>
    )
}