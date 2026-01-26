import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../../../Utils/Constants";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { HeaderProfileIcon, LogoutIcon } from "../../../../Assets/Icons";
import "./ProfileDropdown.css";

export default function ProfileDropdown({
  userName,
  mail,
  toggleProfileDropdown,
}) {
  const navigate = useNavigate();
  const [token, setToken] = useState("");

  // useEffect to check authentication token and logout user session
  useEffect(() => {
    const tokenValue = Cookies.get("token");
    if (!tokenValue) {
      navigate("/login");
      return;
    }
    setToken(tokenValue);
  }, [navigate]);

  // Function to handle user logout
  const handleLogout = async () => {
    try {
      if (token) {
        const response = await axios.put(
          `${baseUrl}/logout`,
          {
            token: token,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.status === 200) {
          Cookies.remove("token");
          navigate("/login");
        }
      } else {
        Cookies.remove("token");
        navigate("/login");
      }
    } catch {
      Cookies.remove("token");
      navigate("/login");
    }
  };

  return (
    <div className="profile-dropdown">
      <div className="profile-dropdown-user-info-container">
        <p className="profile-dropdown-user-icon">
          {userName.charAt(0).toUpperCase()}
        </p>
        <p className="profile-dropdown-user-name">{userName}</p>
        <p className="profile-dropdown-user-mail">{mail}</p>
      </div>

      <div className="profile-dropdown-buttons-container">
        <button
          onClick={() => {
            navigate("/profile");
            toggleProfileDropdown();
          }}
        >
          <HeaderProfileIcon />
          User Profile
        </button>
        <button className="red-button" onClick={handleLogout}>
          <LogoutIcon />
          Logout
        </button>
      </div>
    </div>
  );
}
