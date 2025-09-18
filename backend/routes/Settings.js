const express = require("express");
const dotenv = require("dotenv");
const settingsRoute = express.Router();
const {
  UserDetails,
  UserContacts,
  UserDepartmentDetails,
  UserSessions,
} = require("../schemas/Users");

dotenv.config();

settingsRoute.get("/admin/:userID", async (req, res) => {
  const { userID } = req.params;

  if (!userID) {
    return res.json({ status: 400, message: "UserID is required" });
  }
  const userDetails = await UserDetails.findOne({ userID: userID });
  const userContacts = await UserContacts.findOne({ userID: userID });
  const userDepartmentDetails = await UserDepartmentDetails.findOne({
    userID: userID,
  });

  const userType = userDetails.userType;
  let userInfoData = {};

  if (userType === "ADM") {
    userInfoData = {
      name: userDetails.name,
      mail: userDetails.mail,
      phoneNumber: userContacts.phoneNumber,
    };
  } else if (userType === "HOD") {
    userInfoData = {
      name: userDetails.name,
      mail: userDetails.mail,
      phoneNumber: userContacts.phoneNumber,
      department: userDepartmentDetails.department,
    };
  } else if (userType === "YI") {
    userInfoData = {
      name: userDetails.name,
      mail: userDetails.mail,
      phoneNumber: userContacts.phoneNumber,
      department: userDepartmentDetails.department,
      year: userDepartmentDetails.year,
    };
  } else if (userType === "CA") {
    userInfoData = {
      name: userDetails.name,
      mail: userDetails.mail,
      phoneNumber: userContacts.phoneNumber,
      department: userDepartmentDetails.department,
      year: userDepartmentDetails.year,
      section: userDepartmentDetails.section,
    };
  } else if (userType === "STU") {
    userInfoData = {
      name: userDetails.name,
      mail: userDetails.mail,
      phoneNumber: userContacts.phoneNumber,
      department: userDepartmentDetails.department,
      year: userDepartmentDetails.year,
      section: userDepartmentDetails.section,
      rollNumber: userDepartmentDetails.rollNumber,
    };
  }

  const loginCounts = await UserSessions.find({
    userID: userID,
    isActive: true,
  });
  const lastLogin = await UserSessions.findOne({ userID: userID })
    .sort({ loginTime: -1 })
    .limit(1);
  const loginData = {
    loginCounts: loginCounts.length,
    lastLogin: lastLogin.loginTime,
  };

  const userData = { userInfoData: userInfoData, loginData: loginData };

  res.json({ status: 200, data: userData });
});

module.exports = settingsRoute;
