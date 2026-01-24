import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import useAuthRedirect from "./Hooks/useAuthRedirect";
import { ToastContainer } from "react-toastify";
import Login from "./Pages/Login/Login";
import Home from "./Pages/Home/Home";
import Cookies from "js-cookie";
import { getGenericCodesData } from "./Utils/GenericCodeServices";
import "./App.css";

function App() {
  useAuthRedirect();

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      getGenericCodesData(token);
    }
  }, []);

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
