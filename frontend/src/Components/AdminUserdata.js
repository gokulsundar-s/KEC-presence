import { React, useEffect, useState } from "react";
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import "../Styles/AdminUserdata.css";

export default function Userdata() {
    const [searchby, setSearchBy] = useState('Name');
    const [searchvalue, setSearchValue] = useState('');
    const [datas, setDatas] = useState([]);
    const [deletedata, setDeleteData] = useState();
    const [showConfirmDeletePopup, setConfirmDeletePopup] = useState(false);
    
    const handlesetSearchBy = (event) => {
        setSearchBy(event.target.value);
    };

    const handlesetSearchValue = async (event) => {
        setSearchValue(event.target.value);
        await fetchData(searchby, searchvalue);
    };
    
    const handleConfirmDeletePopup = (mailid) => {
        setConfirmDeletePopup(true);
        setDeleteData(mailid);
    };
    const handleConfirmDelete = async() => {
        const response = await axios.post('http://localhost:3003/admindeleteuser', { deletedata });
        
        if(response.data === "202"){
            toast.success("User deleted successfully")
        }
        setConfirmDeletePopup(false);
    };
    const handleCloseDelete = () => {
        setConfirmDeletePopup(false);
    };
    
    const fetchData = async (searchby, searchvalue) => {
        try {
            const response = await axios.post('http://localhost:3003/adminsearchuser', { searchby, searchvalue });
            setDatas(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.post('http://localhost:3003/userdata');
            setDatas(response.data);
            // setDatas("");
        };
        fetchData();
    }, []);


    useEffect(() => {
        if (showConfirmDeletePopup) {
            document.body.classList.add('disable-background');
        } else {
            document.body.classList.remove('disable-background');
          }
          return () => {
            document.body.classList.remove('disable-background');
          };
    }, [showConfirmDeletePopup]);
    
    return(
        <>
            <p className = "page-header">User data</p>

            <div className = "admin-Userpage-container">
                <div className = "search-container">
                    <div className = "search-input">
                    <select value = {searchby} onChange = {(event => handlesetSearchBy(event))}>
                        <option>Name</option>
                        <option>Roll Number</option>
                        <option>Mail ID</option>
                        <option>Phone Number</option>
                    </select>
                    </div>

                    <div className = "search-input">
                    <input type = "text" placeholder = {`Search by ${searchby}`} value={searchvalue} onChange={(event) => handlesetSearchValue(event)} className = "adminuser-search-input"></input>
                    </div>
                </div>
                
                {datas.length === 0 ? <p className = "data-tables-no-data">No data found</p> : (
                <table className = "data-tables">
                    <tbody>
                    <tr>
                        <th>User type</th>
                        <th>Name</th>
                        <th>Roll Number</th>
                        <th>Year</th>
                        <th>Section</th>
                        <th>Mail ID</th>
                        <th>Student Mobile</th>
                        <th>Parent Mobile</th>
                        <th></th>
                        <th></th>
                    </tr>
                  
                    {datas.map(datas => (
                    <tr key={datas._id}>
                        <td>{datas.usertype}</td>
                        <td>{datas.name}</td>
                        <td>{datas.roll.length === 0 ? "-" : datas.roll}</td>
                        <td>{datas.year.length === 0 ? "-" : datas.year}</td>
                        <td>{datas.section.length === 0 ? "-" : datas.section}</td>
                        <td>{datas.mail}</td>
                        <td>{datas.phone}</td>
                        <td>{datas.pphone.length === 0 ? "-" : datas.pphone}</td>
                        <td><button className = "data-tables-button"><img src={require("../Sources/info.png")} alt = "icon"></img></button></td>
                        <td><button className = "data-tables-button data-tables-red-button" onClick = {() => handleConfirmDeletePopup(datas.mail)}><img src={require("../Sources/delete.png")} alt = "icon"></img></button></td>
                    </tr>
                    ))}
                </tbody>
            </table>)}
        </div>

        <Toaster toastOptions={{duration: 5000}}/>
        
        {showConfirmDeletePopup && (
            <div className = "popups-container">
                <div className = "popups-box">
                    <p className = "popups-header">Are you sure to delete the user?</p>

                    <div className = "popups-buttons-container">
                        <button className = "popups-button popups-red-button" onClick = {handleConfirmDelete}>Yes</button>
                        <button className = "popups-button popups-white-button" onClick = {handleCloseDelete}>No</button>
                    </div>
                </div>
            </div>
        )}
    </>
    )
}