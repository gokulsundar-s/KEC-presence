import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { baseUrl } from "../Utils/Constants";

const useAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const tokenString = Cookies.get("token");

      console.log("tokenString", tokenString);

      if (!tokenString) {
        navigate("/login");
        return;
      }

      const token = jwtDecode(tokenString);
      const currentTime = Date.now() / 1000;

      if (!token.exp || token.exp < currentTime) {
        try {
          if (token.sessionID) {
            const response = await axios.post(`${baseUrl}/logout`, {
              sessionID: token.sessionID,
            });

            if (response.status === 200) {
              Cookies.remove("authToken");
              Cookies.remove("userDetailsToken");
              navigate("/login");
            }
          } else {
            Cookies.remove("authToken");
            Cookies.remove("userDetailsToken");
            navigate("/login");
          }
        } catch (error) {
          console.error("Logout error:", error);
          Cookies.remove("authToken");
          Cookies.remove("userDetailsToken");
          navigate("/login");
        }
      }
    };

    checkAuth();
  }, [navigate]);
};

export default useAuthRedirect;
