import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const useAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const tokenString = Cookies.get("authToken");

    if (!tokenString) {
      navigate("/login");
      return;
    }

    const token = jwtDecode(tokenString);
    const currentTime = Date.now() / 1000;

    if (token.exp < currentTime) {
      Cookies.remove("authToken");
      Cookies.remove("userDetailsToken");
      navigate("/login");
    }
  }, [navigate]);
};

export default useAuthRedirect;
