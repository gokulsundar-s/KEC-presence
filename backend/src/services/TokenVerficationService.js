const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const { UserSessions } = require("../models/UsersModel");

dotenv.config();

const verifyToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    const sessionData = await UserSessions.findOne({
      userID: decoded.userID,
      token: token,
      isActive: true,
    });

    if (!sessionData) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Token verification failed: Invalid or inactive session.`
      );
      return false;
    }

    console.log(
      `[INFO] - [${new Date().toISOString()}] - Token verification successful.`
    );

    return true;
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Token verification failed: Token expired.`
      );
      return false;
    }

    if (err.name === "JsonWebTokenError") {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Token verification failed: Invalid token.`
      );
      return false;
    }

    console.log(
      `[ERROR] - [${new Date().toISOString()}] - Token verification error: ${
        err.message
      }`
    );
    return false;
  }
};

const getTokenData = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    return { tokenUserID: decoded.userID, tokenUserType: decoded.userType };
  } catch (err) {
    console.log(
      `[ERROR] - [${new Date().toISOString()}] - Get token data error: ${
        err.message
      }`
    );
    return null;
  }
};

module.exports = { verifyToken, getTokenData };
