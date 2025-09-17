const express = require("express");
const dotenv = require("dotenv");
const dashboardRoute = express.Router();
const { UserDetails, UserSessions } = require("../schemas/Users");

dotenv.config();

dashboardRoute.get("/admin", async (req, res) => {
  try {
    const hodCount = await UserDetails.find({
      userType: "HOD",
    }).countDocuments();
    const yiCount = await UserDetails.find({
      userType: "YI",
    }).countDocuments();
    const caCount = await UserDetails.find({
      userType: "CA",
    }).countDocuments();
    const studentCount = await UserDetails.find({
      userType: "STU",
    }).countDocuments();

    const mobileSessions = await UserSessions.find({
      device: "Mobile",
      isActive: true,
    }).countDocuments();
    const webSessions = await UserSessions.find({
      device: "Windows",
      isActive: true,
    }).countDocuments();
    const macSessions = await UserSessions.find({
      device: "Mac",
      isActive: true,
    }).countDocuments();
    const iphoneSessions = await UserSessions.find({
      device: "iPhone",
      isActive: true,
    }).countDocuments();

    const hodSessions = await UserSessions.find({
      userID: { $regex: /^H/ },
      isActive: true,
    }).countDocuments();
    const yiSessions = await UserSessions.find({
      userID: { $regex: /^Y/ },
      isActive: true,
    }).countDocuments();
    const caSessions = await UserSessions.find({
      userID: { $regex: /^C/ },
      isActive: true,
    }).countDocuments();
    const studentSessions = await UserSessions.find({
      userID: { $regex: /^S/ },
      isActive: true,
    }).countDocuments();

    const dashboardData = {
      usersCount: [
        { type: "Head of the Department", count: hodCount },
        { type: "Year Incharge", count: yiCount },
        { type: "Class Advisor", count: caCount },
        { type: "Student", count: studentCount },
      ],
      sessionsCount: [
        { type: "Mobile", count: mobileSessions },
        { type: "Windows", count: webSessions },
        { type: "Mac", count: macSessions },
        { type: "iPhone", count: iphoneSessions },
      ],
      usersSessionsCount: [
        { type: "Head of the Department", count: hodSessions },
        { type: "Year Incharge", count: yiSessions },
        { type: "Class Advisor", count: caSessions },
        { type: "Student", count: studentSessions },
      ],
    };

    res.json({ status: 200, data: dashboardData });
  } catch {
    res.json({ status: 500, message: "Server Error" });
  }
});

module.exports = dashboardRoute;
