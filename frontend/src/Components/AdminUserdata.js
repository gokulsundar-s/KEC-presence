import { React, useEffect, useState } from "react";
import axios from 'axios';
import {toast} from "react-toastify";
import "../Styles/AdminPage.css";

export default function Userdata() {
    const [datas, setDatas] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
              const response = await axios.post('http://localhost:3003/userdata');
              setDatas(response.data);

            } catch (error) {
                toast.error("Some error occured! Try again!!");
            }
        };

        fetchData();
    }, []);
    
    return(
        <div className = "userdata-container">
            <p className = "components-header">User data</p>

            <div className = "user-table-container">
              <table>
                  <tr>
                      <th>User type</th>
                      <th>Department</th>
                      <th>Name</th>
                      <th>Roll Number</th>
                      <th>Year</th>
                      <th>Section</th>
                      <th>Mail ID</th>
                      <th>Phone Number</th>
                      <th>Parent's Phone Number</th>
                      <th>Parent's Mail ID</th>
                      <th></th>
                      <th></th>
                  </tr>
                  
                  {datas.map(datas => (
                  <tr key={datas._id}>
                      <td>{datas.usertype}</td>
                      <td>{datas.department}</td>
                      <td>{datas.name}</td>
                      <td>{datas.roll}</td>
                      <td>{datas.year}</td>
                      <td>{datas.section}</td>
                      <td>{datas.mail}</td>
                      <td>{datas.phone}</td>
                      <td>{datas.pphone}</td>
                      <td>{datas.pmail}</td>
                      <td><button className = "request-edit-button"><img src={require("F:/Projects/kecpresence/frontend/src/Sources/pencil.png")} alt = "icon"></img></button></td>
                      <td><button className = "request-delete-button"><img src={require("F:/Projects/kecpresence/frontend/src/Sources/trash.png")} alt = "icon"></img></button></td>
                      </tr>
                  ))}
              </table>
          </div>
      </div>
  )
}