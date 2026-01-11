import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "./Components/AdminDashboard/AdminDashboard";

export default function Dashboard() {
  const navigate = useNavigate();

  // State variables for data handling
  const [token, setToken] = useState("");
  const [name, setName] = useState("");
  const [userType, setUserType] = useState("");

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
      setUserType(decodedToken.userType);
    }
  }, [token]);

  return (
    <div className="page-container">
      <p className="page-header">Welcome {name}🎉</p>

      {userType === "ADMIN" && <AdminDashboard />}
    </div>
  );
}
