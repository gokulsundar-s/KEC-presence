import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from './Pages/LoginPage/LoginPage';
import AdminPage from "./Pages/AdminPage/AdminPage";
import StudentPage from "./Pages/StudentPage/StudentPage";
import './App.css';

export default function App() {  
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/student" element={<StudentPage />} />
        </Routes>
      </BrowserRouter>
    )
}