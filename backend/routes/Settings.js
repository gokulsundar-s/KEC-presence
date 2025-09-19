const express = require("express");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const settingsRoute = express.Router();
const {
  Auth,
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

settingsRoute.post("/admin/migrate-year", async (req, res) => {
  try {
    const { userID, password } = req.body;

    if (!password) {
      return res.json({ status: 400, message: "Password is required" });
    }

    const userInfo = await UserDetails.findOne({ userID: userID });
    if (!userInfo) {
      return res.json({ status: 404, message: "User not found" });
    }

    const userPassword = await Auth.findOne({ userID: userInfo.userID });
    const isAuthUser = await bcrypt.compare(password, userPassword.password);

    if (!isAuthUser) {
      return res.json({ status: 401, message: "Your password is incorrect" });
    }

    await UserDepartmentDetails.updateMany(
      { userID: { $regex: "^S" }, year: { $lt: 4 } },
      [
        {
          $set: {
            year: { $add: ["$year", 1] },
          },
        },
      ]
    );

    const students = await UserDepartmentDetails.find(
      {
        userID: { $regex: "^S" },
        year: { $gte: 4 },
      },
      { userID: 1 }
    );
    const studentIDs = students.map((student) => student.userID);

    if (studentIDs.length > 0) {
      await Auth.updateMany(
        { userID: { $in: studentIDs } },
        { $set: { isActive: false } }
      );
    }
    res.json({ status: 200, message: "Year migrated successfully" });
  } catch (error) {
    res.json({ status: 500, message: "Server Error", error: error.message });
  }
});

module.exports = settingsRoute;
