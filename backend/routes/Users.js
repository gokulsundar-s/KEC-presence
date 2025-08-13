const express = require("express");
const usersRoute = express.Router();
const {
  Auth,
  UserDetails,
  UserDepartmentDetails,
  UserContacts,
} = require("../schemas/Users");
const { sendMail } = require("../utiles/SendMail");

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
      return res.json({ status: 400, message: "User Type is required" });
    } else if (!department) {
      return res.json({ status: 400, message: "Department is required" });
    } else if (!name) {
      return res.json({ status: 400, message: "Name is required" });
    } else if (userType === "STU" && !rollNumber) {
      return res.json({ status: 400, message: "Roll Number is required" });
    } else if (userType !== "ADM" && userType !== "HOD" && !year) {
      return res.json({ status: 400, message: "Year is required" });
    } else if (userType === "CA" && userType === "STU" && !section) {
      return res.json({ status: 400, message: "Section is required" });
    } else if (!mail) {
      return res.json({ status: 400, message: "Kongu Mail ID is required" });
    } else if (!mail.includes("@kongu.")) {
      return res.json({ status: 400, message: "Give a valid Kongu Mail ID" });
    } else if (!phoneNumber) {
      return res.json({ status: 400, message: "Phone Number is required" });
    } else if (userType === "STU" && !parentMail) {
      return res.json({ status: 400, message: "Parent Mail ID is required" });
    } else if (userType === "STU" && !parentPhone) {
      return res.json({
        status: 400,
        message: "Parent Phone Number is required",
      });
    } else {
      const charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
      let password = "";

      for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset.charAt(randomIndex);
      }
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

      return res.json({ status: 200, message: "User added successfully" });
    }
  } catch (error) {
    return res.json({ status: 500, message: "Server Error" });
  }
});

module.exports = usersRoute;
