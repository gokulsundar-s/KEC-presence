const express = require("express");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../utiles/SendMail");
const {
  Auth,
  UserDetails,
  UserDepartmentDetails,
  UserContacts,
} = require("../schemas/Users");
const authRoute = express.Router();

dotenv.config();
const saltRounds = 10;

authRoute.post("/login", async (req, res) => {
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

authRoute.put("/reset-password", async (req, res) => {
  try {
    const userID = req.body.userID;

    const userCheck = await Auth.findOne({ userID: userID });
    if (!userCheck) {
      return res.status(404).send("User not found");
    }

    const userInfo = await UserDetails.findOne({ userID: userID });

    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let password = "";

    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset.charAt(randomIndex);
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await Auth.updateOne({ userID: userID }, { password: hashedPassword });

    // sendMail(
    //   userInfo.mail,
    //   "KEC Presence Portal – Password Reset Successful",
    //   `Dear ${userInfo.name},\nYour password for the KEC Presence Portal has been successfully reset. Use the following credentials to log in:\n\nEmail: ${userInfo.mail}\nPassword: ${password}\n\nNote: Please change your password after your first login.\n\nFor any queries, contact us at ${process.env.MAIL}\n\nThanks & regards,\nKEC Presence Team.`
    // );

    res.send({ status: 200, message: "Password reset successfully" });
  } catch (error) {
    console.log(error);

    res.send({ status: 500, message: "Server Error" });
  }
});

module.exports = authRoute;
