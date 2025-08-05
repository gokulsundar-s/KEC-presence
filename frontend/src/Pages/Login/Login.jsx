import React, { useState } from "react";
import Logo from "../../Assets/kec-logo.png";
import LoginImage from "../../Assets/login-image.jpg";
import "./Login.css";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [loadButton, setLoadButton] = useState(false);

  const handleLogin = async () => {
    setLoadButton(true);
    setLoadButton(false);
  };

  return (
    <div className="login-bg-container">
      <div className="login-container">
        <img src={LoginImage} alt="login" className="login-image" />

        <div className="login-form-container">
          <div className="login-form">
            <div className="login-form-icon">
              <img src={Logo} alt="logo" />
            </div>

            <p>Welcome back. Please login to your account.</p>

            <div className="login-form-input">
              <input
                type="text"
                placeholder="Kongu Mail ID"
                onChange={(e) => setMail(e.target.value)}
              />
            </div>
            <div className="login-form-input">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="login-form-bottom-container">
              <div className="login-form-show-password">
                <input
                  type="checkbox"
                  id="show-password"
                  onChange={() => setShowPassword(!showPassword)}
                />
                <label>Show Password</label>
              </div>

              <div className="login-form-forgot-password">
                <a href="/">Forgot Password?</a>
              </div>
            </div>

            <button className="login-button" onClick={handleLogin}>
              {loadButton ? "Loading..." : "Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
