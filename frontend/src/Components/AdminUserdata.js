import { React, useEffect, useState } from "react";
import axios from 'axios';
import AdminUserDataPopup from "./AdminUserDataPopup";
import "../Styles/AdminUserdata.css";

export default function Userdata() {
    const [searchby, setSearchBy] = useState('Name');
    const [searchvalue, setSearchValue] = useState('');
    const [datas, setDatas] = useState([]);
    
    const handlesetSearchBy = (event) => {
        setSearchBy(event.target.value);
    };
    const handlesetSearchValue = async (event) => {
        setSearchValue(event.target.value);
        await fetchData(searchby, searchvalue);
    };
    
    const fetchData = async (searchby, searchvalue) => {
        try {
            const response = await axios.post('http://localhost:3003/searchuserdata', { searchby, searchvalue });
            setDatas(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.post('http://localhost:3003/userdata');
            setDatas(response.data);
        };
        fetchData();
    }, []);

    return(
        <>
            <p className = "page-header">User data</p>

            <div className = "adminuser-page-container">
                <div className = "adminuser-search-container">
                    <select className = "adminuser-search-select" value = {searchby} onChange = {(event => handlesetSearchBy(event))}>
                        <option>Name</option>
                        <option>Roll Number</option>
                        <option>Mail ID</option>
                        <option>Phone Number</option>
                    </select>
                    <input type = "text" placeholder = {`Search by ${searchby}`} value={searchvalue} onChange={(event) => handlesetSearchValue(event)} className = "adminuser-search-input"></input>
                </div>
                
                {datas.length === 0 ? <p className = "adminuser-no-data">No data found</p> : (
                <table>
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
                        <td>{datas.roll}</td>
                        <td>{datas.year}</td>
                        <td>{datas.section}</td>
                        <td>{datas.mail}</td>
                        <td>{datas.phone}</td>
                        <td>{datas.pphone}</td>
                        <td><button className = "adminuser-table-button" onClick = {<AdminUserDataPopup/>}><img src={require("F:/Projects/kecpresence/frontend/src/Sources/info.png")} alt = "icon"></img></button></td>
                        <td><button className = "adminuser-table-button adminuser-table-logout-button"><img src={require("F:/Projects/kecpresence/frontend/src/Sources/delete.png")} alt = "icon"></img></button></td>
                    </tr>
                    ))}
                    </tbody>
              </table>)}
          </div>
      </>
  )
}