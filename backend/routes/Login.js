const express = require("express");
const loginRoute = express.Router();
const {
  Auth,
  UserDetails,
  UserDepartmentDetails,
} = require("../schemas/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

loginRoute.post("/login", async (req, res) => {
  try {
    const { mail, password } = req.body;

    if (!mail) {
      return res.status(400).json({ message: "Mail is required" });
    } else if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const userInfo = await UserDetails.findOne({ mail: mail });

    if (!userInfo) {
      return res.status(404).json({ message: "User not found" });
    }

    const userPassword = await Auth.findOne({ userID: userInfo.userID });

    if (!userPassword) {
      return res.status(404).json({ message: "Wrong Password" });
    }

    if (userPassword.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    } else {
      const userDetails = await UserDetails.findOne({
        userID: userInfo.userID,
      });

      const userDepartmentDetails = await UserDepartmentDetails.findOne({
        userID: userInfo.userID,
      });

      console.log(userDetails);
      console.log(userDepartmentDetails);

      const authToken = jwt.sign(
        { userID: userInfo.userID },
        process.env.JWT_KEY,
        {
          expiresIn: "1h",
        }
      );

      return res
        .status(200)
        .json({ message: "Login successful", authToken: authToken });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
});

module.exports = loginRoute;
