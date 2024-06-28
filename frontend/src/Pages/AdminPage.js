import { React, useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import AdminDashboard from "../Components/AdminDashBoard";
import AdminAddUser from "../Components/AdminAddUser";
import AdminUserdata from "../Components/AdminUserdata";

export default function AdminPage() {
  const [activeTab, setactiveTab] = useState(1);

  const [isLoading, setIsLoading] = useState(true);

  setTimeout(() => {
    setIsLoading(false);},2000);

  const handleTabClick = (id) => {
    setactiveTab(id);
  };

  const navigate = useNavigate();

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


  return (
    <>
    {isLoading ? (<div className = "loading-component"><p>Loading...</p></div>) : (

    <div className = "pages-container">
      <ul  className = "drawer-container">
        <div className = "drawer-header">
          <img src={require("F:/Projects/kecpresence/frontend/src/Sources/KEC.png")} alt = "logo1"></img>
          <p>Admin</p>
        </div>
            
        <button className={activeTab === 1 ? 'active' : ''} onClick={() => handleTabClick(1)}><div><img src={require("F:/Projects/kecpresence/frontend/src/Sources/dashboard.png")} alt = "icon"></img><p>Dashboard</p></div></button>
        <button className={activeTab === 2 ? 'active' : ''} onClick={() => handleTabClick(2)}><div><img src={require("F:/Projects/kecpresence/frontend/src/Sources/add-user.png")} alt = "icon"></img><p>Add User</p></div></button>
        <button className={activeTab === 3 ? 'active' : ''} onClick={() => handleTabClick(3)}><div><img src={require("F:/Projects/kecpresence/frontend/src/Sources/user-data.png")} alt = "icon"></img><p>User Data</p></div></button>
        <button><div><img src={require("F:/Projects/kecpresence/frontend/src/Sources/settings.png")} alt = "icon"></img><p>Settings</p></div></button>
      </ul>
      
      <div className = "page-components-container">
        {activeTab === 1 && <AdminDashboard />}
        {activeTab === 2 && <AdminAddUser />}
        {activeTab === 3 && <AdminUserdata />}
      </div>
    </div>)}
    </>
  )
}