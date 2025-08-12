const express = require("express");
const usersRoute = express.Router();
const {
  Auth,
  UserDetails,
  UserDepartmentDetails,
  UserContacts,
} = require("../schemas/Users");
const bcrypt = require("bcrypt");

const saltRounds = 10;

usersRoute.post("/adduser", async (req, res) => {
  try {
    const {
      userType,
      department,
      name,
      rollNumber,
      year,
      section,
      mail,
      phoneNumber,
      parentMail,
      parentPhone,
    } = req.body;

    if (!userType) {
      return res.status(400).json({ message: "User Type is required" });
    } else if (!department) {
      return res.status(400).json({ message: "Department is required" });
    } else if (!name) {
      return res.status(400).json({ message: "Name is required" });
    } else if (userType === "STU" && !rollNumber) {
      return res.status(400).json({ message: "Roll Number is required" });
    } else if (userType !== "ADM" && userType !== "HOD" && !year) {
      return res.status(400).json({ message: "Year is required" });
    } else if (userType === "CA" && userType === "STU" && !section) {
      return res.status(400).json({ message: "Section is required" });
    } else if (!mail) {
      return res.status(400).json({ message: "Kongu Mail ID is required" });
    } else if (!mail.includes("@kongu.")) {
      return res.status(400).json({ message: "Give a valid Kongu Mail ID" });
    } else if (!phoneNumber) {
      return res.status(400).json({ message: "Phone Number is required" });
    } else if (userType === "STU" && !parentMail) {
      return res.status(400).json({ message: "Parent Mail ID is required" });
    } else if (userType === "STU" && !parentPhone) {
      return res
        .status(400)
        .json({ message: "Parent Phone Number is required" });
    } else {
      const charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
      let password = "";

      for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset.charAt(randomIndex);
      }
      password = "presence@123";
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const userCount = await UserDetails.find({ userType: userType });
      const userID =
        userType.charAt(0) + (userCount.length + 1).toString().padStart(5, "0");

      const auth = new Auth({
        userID: userID,
        password: hashedPassword,
      });

      const userDetails = new UserDetails({
        userID: userID,
        userType: userType,
        name: name,
        mail: mail,
      });

      const userDepartmentDetails = new UserDepartmentDetails({
        userID: userID,
        department: department,
        rollNumber: rollNumber,
        year: year,
        section: section,
      });

      const userContacts = new UserContacts({
        userID: userID,
        phoneNumber: phoneNumber,
        parentMail: parentMail,
        parentPhone: parentPhone,
      });

      await auth.save();
      await userDetails.save();
      await userDepartmentDetails.save();
      await userContacts.save();

      return res.status(201).json({ message: "User added successfully" });
    }
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Server Error" });
  }
});

module.exports = usersRoute;
