const express = require("express");
const loginRoute = express.Router();
const {
  Auth,
  UserDetails,
  UserDepartmentDetails,
  UserContacts,
} = require("../schemas/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

loginRoute.post("/login", async (req, res) => {
  try {
    const { mail, password } = req.body;

    if (!mail) {
      return res.json({ status: 400, message: "Mail is required" });
    } else if (!mail.includes("@kongu.")) {
      return res.json({ status: 400, message: "Invalid Kongu Mail ID" });
    } else if (!password) {
      return res.json({ status: 400, message: "Password is required" });
    }

    const userInfo = await UserDetails.findOne({ mail: mail });
    if (!userInfo) {
      return res.json({ status: 404, message: "User not found" });
    }

    const userPassword = await Auth.findOne({ userID: userInfo.userID });
    const isAuthUser = await bcrypt.compare(password, userPassword.password);
    if (!isAuthUser) {
      return res.json({ status: 400, message: "Wrong Password" });
    } else {
      const userDetails = await UserDetails.findOne({
        userID: userInfo.userID,
      });
      const userDepartmentDetails = await UserDepartmentDetails.findOne({
        userID: userInfo.userID,
      });
      const userContacts = await UserContacts.findOne({
        userID: userInfo.userID,
      });

      const userDetailsObject = {
        ...userDetails.toObject(),
        ...userDepartmentDetails.toObject(),
        ...userContacts.toObject(),
      };

      const authToken = jwt.sign(
        { userID: userInfo.userID },
        process.env.JWT_KEY,
        {
          expiresIn: "24h",
        }
      );

      const userDetailsToken = jwt.sign(
        userDetailsObject,
        process.env.JWT_KEY,
        {
          expiresIn: "24h",
        }
      );

      return res.json({
        status: 200,
        message: "Login successful",
        authToken: authToken,
        userDetailsToken: userDetailsToken,
      });
    }
  } catch (error) {
    return res.json({ status: 500, message: "Server Error" });
  }
});

module.exports = loginRoute;
