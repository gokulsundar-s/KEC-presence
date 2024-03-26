import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from './Pages/LoginPage';
import AdminPage from './Pages/AdminPage';
import ClassAdvisorPage from './Pages/AdvisorPage';
import YearInchargePage from './Pages/YearInchargePage';
import StudentPage from './Pages/StudentPage';
import './App.css';

export default function App() {  
  const [isLoading, setIsLoading] = useState(true);

  setTimeout(() => {
    setIsLoading(false);},2000);
  return (
    <>
    {isLoading ? (<div><p>Loading...</p></div>) : (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/student" element={<StudentPage />} />
          <Route path="/advoicer" element={<ClassAdvisorPage />} />
          <Route path="/year-incharge" element={<YearInchargePage />} />
        </Routes>
      </BrowserRouter>
    )}
    </>
    );
}