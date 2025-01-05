import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import DeletePopup from '../../DeletePopup/DeletePopup';
import "./UserInfo.css";

export default function UserInfo() {
    const [usertypeDD, setUsertypeDD] = useState([]);
    const [searchby, setSearchby] = useState("Name");
    const [searchValue, setSearchValue] = useState("");
    const [userData, setUserData] = useState([]);
    const [deletePopup, setDeletePopup] = useState(false);
    const [deletemail, setDeleteMail] = useState("");

    const handleSearchBy = (event) => setSearchby(event.target.value);
    const handleSearchValue = async(event) => setSearchValue(event.target.value);

    const handleUserTypeDropDown = async() => {
        const type = "User Type";
        const response = await axios.post("http://localhost:3003/get-dropdown", {type});
        const ddArray = response.data.map((item, index) => ({
            value: response.data[index].value,
            description: response.data[index].description
        }));
        setUsertypeDD(ddArray);
    }

    const handleSearch = async() => {
        const response = await axios.post('http://localhost:3003/searchuserdata', {searchby, searchValue});
        setUserData(response.data);
    }

    const handleFetchUserData = async () => {
        const response = await axios.post('http://localhost:3003/userdata');
        setUserData(response.data);
    };
    
    const handleDelete = async(value) => {
        if(!value){
            setDeletePopup(false);
        } else {
            try {
                const response = await axios.post('http://localhost:3003/deleteuser', {mail: deletemail});
                if(response.data.status === 200) {
                    toast.success(response.data.message,{
                        position: "top-center",
                        style: {color: "#004aad", fontSize: "1rem"},
                        iconTheme: {primary: "#0093dd",}
                    });
                    handleFetchUserData();
                    setDeletePopup(false);
                } else {
                    toast.error(response.data.message,{
                        position: "top-center",
                        style: {color: "#004aad", fontSize: "1rem"},
                        iconTheme: {primary: "#0093dd",}
                    });
                }
            } catch (error) {
                toast.error("Server error. Try again after sometimes.",{
                    position: "top-center",
                    style: {color: "#004aad", fontSize: "1rem"},
                    iconTheme: {primary: "#0093dd",}
                });
            }
        }
    }
    
    const handleDeletePopup = async(mail) => {
        setDeletePopup(true);
        setDeleteMail(mail);
    }
    
    useEffect(() => {   
        handleUserTypeDropDown();
        handleFetchUserData();
    }, []);
    
    useEffect(() => {
        if (searchValue !== "") {
            handleSearch();
        }
    }, [searchValue]);
    
    const getUsertypeDescription = (usertype) => {
        const usertypeItem = usertypeDD.find(item => item.value === usertype);
        return usertypeItem ? usertypeItem.description : usertype;
    };
    
    return (
        <>
        <div className = "admin-userinfo-container">
            <p className = "admin-userinfo-welcome">User Informations💁‍♂️</p>
            <div className = "admin-userinfo-search-container">
                <div className = "admin-userinfo-search-input">
                    <select type = "text" placeholder = "Search By Name" onChange = {(event) => handleSearchBy(event)}>
                        <option>Name</option>
                        <option>Roll Number</option>
                        <option>Mail ID</option>
                    </select>
                </div>
                <div className = "admin-userinfo-search-input">
                    <input type = "text" placeholder = {`Search by ${searchby}`} onChange = {(event) => handleSearchValue(event)}/>
                </div>
            </div>
            
            <div className = "admin-userinfo-table-container">
                {userData.length === 0 ? <p className = "admin-userinfo-table-container-no-data">No data found</p> : (
                <table className = "admin-userinfo-table">
                    <tbody>
                        <tr>
                            <th>User type</th>
                            <th>Name</th>
                            <th>Roll Number</th>
                            <th>Year</th>
                            <th>Section</th>
                            <th>Mail ID</th>
                            <th>Phone Number</th>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>
                  
                        {userData.map(datas => (
                        <tr key={datas._id}>
                            <td>{getUsertypeDescription(datas.usertype)}</td>
                            <td>{datas.name}</td>
                            <td>{datas.roll.length === 0 ? "-" : datas.roll}</td>
                            <td>{datas.year.length === 0 ? "-" : datas.year}</td>
                            <td>{datas.section.length === 0 ? "-" : datas.section}</td>
                            <td>{datas.mail}</td>
                            <td>{datas.phone}</td>
                            <td><button><img src={require("../../../Sources/info.png")} alt="icon"/></button></td>
                            <td><button><img src={require("../../../Sources/edit.png")} alt="icon"/></button></td>
                            <td><button onClick={() => handleDeletePopup(datas.mail)}><img src={require("../../../Sources/delete.png")} alt="icon"/></button></td>
                        </tr>
                        ))}
                    </tbody>
                </table>)}
            </div>
        </div>

        {deletePopup && <DeletePopup handleDelete={handleDelete} deleteType={"user"}/>}
        <Toaster toastOptions={{duration: 5000}}/> 
        </>
    )
}