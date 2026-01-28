import { Routes, Route } from "react-router-dom";
import useAuthRedirect from "./Hooks/useAuthRedirect";
import { ToastContainer } from "react-toastify";
import Login from "./Pages/Login/Login";
import Home from "./Pages/Home/Home";
import "./App.css";

function App() {
  useAuthRedirect();

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
      />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
