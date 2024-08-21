import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from './Pages/LoginPage';
import AdminPage from './Pages/AdminPage';
import StudentPage from './Pages/StudentPage';
import AdvisorPage from './Pages/AdvisorPage';
import YearInchargePage from './Pages/YearInchargePage';
import './App.css';

export default function App() {  
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/student" element={<StudentPage />} />
          <Route path="/advoicer" element={<AdvisorPage />} />
          <Route path="/year-incharge" element={<YearInchargePage />} />
        </Routes>
      </BrowserRouter>
    )
}