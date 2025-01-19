import React, { useEffect, useState } from "react";
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import "./AddEntry.css";

export default function AddEntry() {
    const [userRoll, setUserRoll] = useState([]);
    const [year, setYear] = useState("");
    const [section, setSection] = useState("");

    const handleFetchData = async () => {
        const response = await axios.post('http://localhost:3003/get-roll', {year, section});
        setUserRoll(response.data);
        console.log(response.data);
    };

    useEffect(() => {
        setYear(jwtDecode(Cookies.get("authToken")).year);
        setSection(jwtDecode(Cookies.get("authToken")).section);
   
        if(year && section){
            handleFetchData();
        }
    },[year,section]);

    return (
        <>
        <div className = "advisor-add-entry-container">
            <p className = "advisor-add-entry-welcome">Add Attendance Entry🧑‍💻</p>
            <div className = "advisor-add-entry-date-input-container">
                <p>Entry Date</p>
                <input type="date"></input>
            </div>

            <div className = "advisor-add-entry-input-container">
            <table className = "advisor-add-entry-table">
                    <tbody>
                        <tr>
                            <th>Roll Number</th>
                            <th>1</th>
                            <th>2</th>
                            <th>3</th>
                            <th>4</th>
                            <th>5</th>
                            <th>6</th>
                            <th>7</th>
                            <th>8</th>
                        </tr>
                  
                        {userRoll.map(datas => (
                        <tr key={datas}>
                            <td>{datas}</td>
                            <td>
                                <select>
                                    <option></option>
                                    <option>PR</option>
                                    <option>AB</option>
                                    <option>LE</option>
                                    <option>OD</option>
                                </select>
                            </td>
                            <td>
                                <select>
                                    <option></option>
                                    <option>PR</option>
                                    <option>AB</option>
                                    <option>LE</option>
                                    <option>OD</option>
                                </select>
                            </td>
                            <td>
                                <select>
                                    <option></option>
                                    <option>PR</option>
                                    <option>AB</option>
                                    <option>LE</option>
                                    <option>OD</option>
                                </select>
                            </td>
                            <td>
                                <select>
                                    <option></option>
                                    <option>PR</option>
                                    <option>AB</option>
                                    <option>LE</option>
                                    <option>OD</option>
                                </select>
                            </td>
                            <td>
                                <select>
                                    <option></option>
                                    <option>PR</option>
                                    <option>AB</option>
                                    <option>LE</option>
                                    <option>OD</option>
                                </select>
                            </td>
                            <td>
                                <select>
                                    <option></option>
                                    <option>PR</option>
                                    <option>AB</option>
                                    <option>LE</option>
                                    <option>OD</option>
                                </select>
                            </td>
                            <td>
                                <select>
                                    <option></option>
                                    <option>PR</option>
                                    <option>AB</option>
                                    <option>LE</option>
                                    <option>OD</option>
                                </select>
                            </td>
                            <td>
                                <select>
                                    <option></option>
                                    <option>PR</option>
                                    <option>AB</option>
                                    <option>LE</option>
                                    <option>OD</option>
                                </select>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>

                <div className = "advisor-add-entry-button-container">
                    <button>Submit</button>
                </div>
            </div>
        </div>
        </>
    )
}