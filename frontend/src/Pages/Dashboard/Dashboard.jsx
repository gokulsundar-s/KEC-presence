import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "./Components/AdminDashboard/AdminDashboard";

export default function Dashboard() {
  const navigate = useNavigate();

  let name = "";
  let userType = "";

  try {
    const userDetailsToken = Cookies.get("token");
    if (!userDetailsToken) {
      navigate("/login");
    } else {
      name = jwtDecode(userDetailsToken).name;
      userType = jwtDecode(userDetailsToken).userType;
    }
  } catch (error) {
    navigate("/login");
  }

  console.log(userType);
  
  return (
    <div className="page-container">
      <p className="page-header">Welcome {name}🎉</p>

      {userType === "ADMIN" && <AdminDashboard />}
    </div>
  );
}
