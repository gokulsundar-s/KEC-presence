import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { NotificationIcon } from "../../../../Assets/Icons";
import ProfileDropdown from "../ProfileDropdown/ProfileDropdown";
import NotificationDropdown from "../NotificationDropdown/NotificationDropdown";
import "./Header.css";

export default function Header() {
  const navigate = useNavigate();

  // State variables for data handling
  const [token, setToken] = useState("");
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");

  // useEffect to check authentication token and fetch user data
  useEffect(() => {
    const tokenValue = Cookies.get("token");
    if (!tokenValue) {
      navigate("/login");
      return;
    }
    setToken(tokenValue);
  }, [navigate]);

  // useEffect to decode token and set user information
  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      setName(decodedToken.name);
      setMail(decodedToken.mail);
    }
  }, [token]);

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] =
    useState(false);
  const profileDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
    setNotificationDropdownOpen(false);
  };

  const toggleNotificationDropdown = () => {
    setNotificationDropdownOpen(!notificationDropdownOpen);
    setProfileDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setProfileDropdownOpen(false);
      }

      if (
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(event.target)
      ) {
        setNotificationDropdownOpen(false);
      }
    };

    if (profileDropdownOpen || notificationDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileDropdownOpen, notificationDropdownOpen]);

  return (
    <div className="header-container">
      <div></div>
      <div className="header-left-container">
        <div className="header-profile-wrapper" ref={notificationDropdownRef}>
          <button
            className="header-notification-button"
            onClick={toggleNotificationDropdown}
          >
            <NotificationIcon />
          </button>
          <div
            className={`header-dropdown-container ${
              notificationDropdownOpen ? "open" : ""
            }`}
          >
            {notificationDropdownOpen && (
              <NotificationDropdown notifications={{}} />
            )}
          </div>
        </div>

        <div className="header-dropdown-wrapper" ref={profileDropdownRef}>
          <button
            className="header-profile-container"
            onClick={toggleProfileDropdown}
          >
            {name.charAt(0).toUpperCase()}
            
          </button>
          <div
            className={`header-dropdown-container ${
              profileDropdownOpen ? "open" : ""
            }`}
          >
            {profileDropdownOpen && (
              <ProfileDropdown
                userName={name}
                mail={mail}
                toggleProfileDropdown={toggleProfileDropdown}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
