const express = require("express");
const usersRoute = express.Router();
const { UserDetails, Auth } = require("../schemas/Users");
const bcrypt = require("bcrypt");

usersRoute.post("/adduser", async (req, res) => {
  try {
    const {
      userType,
      department,
      name,
      rollNumber,
      year,
      section,
      konguMail,
      phoneNumber,
      parentMail,
      parentPhone,
    } = req.body;

    if (!konguMail) {
      return res.status(400).json({ message: "Kongu Mail ID is required" });
    } else if (!phoneNumber) {
      return res.status(400).json({ message: "Phone Number is required" });
    } else if (!parentMail) {
      return res.status(400).json({ message: "Parent Mail ID is required" });
    } else if (!parentPhone) {
      return res
        .status(400)
        .json({ message: "Parent Phone Number is required" });
    }

    console.log("Creating user:", {
      userType,
      department,
      name,
      rollNumber,
      year,
      section,
      konguMail,
      phoneNumber,
      parentMail,
      parentPhone,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
});
