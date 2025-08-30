const express = require("express");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const { sendMail } = require("../utiles/SendMail");
const {
  Auth,
  UserDetails,
  UserDepartmentDetails,
  UserContacts,
} = require("../schemas/Users");
const usersRoute = express.Router();

dotenv.config();
const saltRounds = 10;

usersRoute.post("/", async (req, res) => {
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

    const userCheck = await UserDetails.findOne({ mail: mail });

    if (userCheck) {
      return res.json({ status: 400, message: "User already exists" });
    } else if (!userType) {
      return res.json({ status: 400, message: "User Type is required" });
    } else if (userType !== "ADM" && !department) {
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
    } else if (phoneNumber.length !== 10) {
      return res.json({
        status: 400,
        message: "Phone Number must be 10 digits",
      });
    } else if (userType === "STU" && !parentMail) {
      return res.json({ status: 400, message: "Parent Mail ID is required" });
    } else if (
      userType === "STU" &&
      !parentMail.includes("@") &&
      !parentMail.includes(".")
    ) {
      return res.json({ status: 400, message: "Give a valid Parent Mail ID" });
    } else if (userType === "STU" && !parentPhone) {
      return res.json({
        status: 400,
        message: "Parent Phone Number is required",
      });
    } else if (userType === "STU" && parentPhone.length !== 10) {
      return res.json({
        status: 400,
        message: "Parent Phone Number must be 10 digits",
      });
    } else if (userType === "STU" && mail === parentMail) {
      return res.json({
        status: 400,
        message: "Parent Mail ID cannot be same as Student Mail ID",
      });
    } else if (userType === "STU" && phoneNumber === parentPhone) {
      return res.json({
        status: 400,
        message: "Parent Phone Number cannot be same as Student Phone Number",
      });
    }

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

    // sendMail(
    //   mail,
    //   "KEC Presence Portal – Registration Successful",
    //   `Dear ${name},\nYour account for the KEC Presence Portal has been successfully created. Use the following credentials to log in:\n\nEmail: ${mail}\nPassword: ${password}\n\nNote: Please change your password after your first login.\n\nFor any queries, contact us at ${process.env.MAIL}\n\nThanks & regards,\nKEC Presence Team.`
    // );

    return res.json({ status: 200, message: "User added successfully" });
  } catch (error) {
    return res.json({ status: 500, message: "Server Error" });
  }
});

usersRoute.get("/", async (req, res) => {
  try {
    const userDetails = await UserDetails.find({ userType: { $ne: "ADM" } });
    const userDepartmentDetails = await UserDepartmentDetails.find({
      userType: { $ne: "ADM" },
    });

    const usersData = userDetails.map((userDtl) => {
      const userDeptDtl = userDepartmentDetails.find(
        (dept) => dept.userID === userDtl.userID
      );

      return {
        userID: userDtl.userID,
        userType: userDtl.userType || null,
        mail: userDtl.mail || null,
        name: userDtl.name || null,
        rollNumber: userDeptDtl?.rollNumber || null,
        year: userDeptDtl?.year || null,
        section: userDeptDtl?.section || null,
        department: userDeptDtl?.department || null,
      };
    });

    return res.json({
      status: 200,
      message: "User data retrieved successfully",
      data: usersData,
    });
  } catch (error) {
    return res.json({ status: 500, message: "Server Error" });
  }
});

usersRoute.get("/:userID", async (req, res) => {
  try {
    const userID = req.params.userID;
    const userDetails = await UserDetails.findOne({ userID: userID });
    const userDepartmentDetails = await UserDepartmentDetails.findOne({
      userID: userID,
    });
    const userContactDetails = await UserContacts.findOne({ userID: userID });

    if (!userDetails || !userDepartmentDetails || !userContactDetails) {
      return res.status(404).send("User not found");
    }

    const usersData = {
      userID: userDetails.userID,
      userType: userDetails.userType || null,
      mail: userDetails.mail || null,
      name: userDetails.name || null,
      rollNumber: userDepartmentDetails?.rollNumber || null,
      year: userDepartmentDetails?.year || null,
      section: userDepartmentDetails?.section || null,
      department: userDepartmentDetails?.department || null,
      phoneNumber: userContactDetails?.phoneNumber || null,
      parentMail: userContactDetails?.parentMail || null,
      parentPhone: userContactDetails?.parentPhone || null,
    };

    res.send({ status: 200, data: usersData });
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

usersRoute.put("/:userID", async (req, res) => {
  try {
    const userID = req.params.userID;
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

    const userDetails = await UserDetails.findOne({ userID: userID });
    const userDepartmentDetails = await UserDepartmentDetails.find({
      userID: userID,
    });
    const userContactDetails = await UserContacts.findOne({ userID: userID });

    if (!userDetails || !userDepartmentDetails || !userContactDetails) {
      return res.status(404).send("User not found");
    } else if (userType !== "ADM" && !department) {
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
    } else if (phoneNumber.length !== 10) {
      return res.json({
        status: 400,
        message: "Phone Number must be 10 digits",
      });
    } else if (userType === "STU" && !parentMail) {
      return res.json({ status: 400, message: "Parent Mail ID is required" });
    } else if (
      userType === "STU" &&
      !parentMail.includes("@") &&
      !parentMail.includes(".")
    ) {
      return res.json({ status: 400, message: "Give a valid Parent Mail ID" });
    } else if (userType === "STU" && !parentPhone) {
      return res.json({
        status: 400,
        message: "Parent Phone Number is required",
      });
    } else if (userType === "STU" && parentPhone.length !== 10) {
      return res.json({
        status: 400,
        message: "Parent Phone Number must be 10 digits",
      });
    } else if (userType === "STU" && mail === parentMail) {
      return res.json({
        status: 400,
        message: "Parent Mail ID cannot be same as Student Mail ID",
      });
    } else if (userType === "STU" && phoneNumber === parentPhone) {
      return res.json({
        status: 400,
        message: "Parent Phone Number cannot be same as Student Phone Number",
      });
    }

    await UserDetails.updateOne({ userID: userID }, { name, mail });
    await UserDepartmentDetails.updateOne(
      { userID: userID },
      { department, rollNumber, year, section }
    );
    await UserContacts.updateOne(
      { userID: userID },
      { phoneNumber, parentMail, parentPhone }
    );

    res.send({ status: 200, message: "User updated successfully" });
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

usersRoute.delete("/:userID", async (req, res) => {
  try {
    const userID = req.params.userID;

    const authUser = await Auth.findOne({ userID: userID });
    const userDetails = await UserDetails.findOne({ userID: userID });
    const userDepartmentDetails = await UserDepartmentDetails.findOne({
      userID: userID,
    });
    const userContactDetails = await UserContacts.findOne({ userID: userID });

    if (
      !authUser ||
      !userDetails ||
      !userDepartmentDetails ||
      !userContactDetails
    ) {
      return res.status(404).send("User not found");
    }

    // sendMail(
    //   userDetails[0].mail,
    //   "KEC Presence Portal – User account deletion Successful",
    //   `Dear ${userDetails[0].name},\nThis is to confirm that your KEC Presence Portal account associated with this email (${userDetails[0].mail}) has been successfully deleted from the KEC Presence Portal. All associated data has been securely removed from our systems as per our data retention policies.\n\nIf this action was performed in error or you have any questions, please contact us at ${process.env.MAIL}.\n\nThank you for being a part of the KEC Presence Portal.\n\nBest regards,\nKEC Presence Team`
    // );

    await Auth.deleteOne({ userID: userID });
    await UserDetails.deleteOne({ userID: userID });
    await UserDepartmentDetails.deleteOne({ userID: userID });
    await UserContacts.deleteOne({ userID: userID });

    res.send({ status: 200, message: "User deleted successfully" });
  } catch {
    res.status(500).send("Server Error");
  }
});

usersRoute.post("/bulk-users", async (req, res) => {
  try {
    const usersList = req.body;
    const resultData = [];

    for (const userData of usersList) {
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
      } = userData;

      const result = { mail };

      const userCheck = await UserDetails.findOne({ mail });

      if (userCheck) {
        result.status = 400;
        result.message = "User already exists";
        resultData.push(result);
        continue;
      } else if (!userType) {
        result.status = 400;
        result.message = "User Type is required";
        resultData.push(result);
        continue;
      } else if (userType !== "ADM" && !department) {
        result.status = 400;
        result.message = "Department is required";
        resultData.push(result);
        continue;
      } else if (!name) {
        result.status = 400;
        result.message = "Name is required";
        resultData.push(result);
        continue;
      } else if (userType === "STU" && !rollNumber) {
        result.status = 400;
        result.message = "Roll Number is required";
        resultData.push(result);
        continue;
      } else if (userType !== "ADM" && userType !== "HOD" && !year) {
        result.status = 400;
        result.message = "Year is required";
        resultData.push(result);
        continue;
      } else if ((userType === "CA" || userType === "STU") && !section) {
        result.status = 400;
        result.message = "Section is required";
        resultData.push(result);
        continue;
      } else if (!mail) {
        result.status = 400;
        result.message = "Kongu Mail ID is required";
        resultData.push(result);
        continue;
      } else if (!mail.includes("@kongu.")) {
        result.status = 400;
        result.message = "Give a valid Kongu Mail ID";
        resultData.push(result);
        continue;
      } else if (!phoneNumber.toString()) {
        result.status = 400;
        result.message = "Phone Number is required";
        resultData.push(result);
        continue;
      } else if (phoneNumber.toString().length !== 10) {
        result.status = 400;
        result.message = "Phone Number must be 10 digits";
        resultData.push(result);
        continue;
      } else if (userType === "STU" && !parentMail) {
        result.status = 400;
        result.message = "Parent Mail ID is required";
        resultData.push(result);
        continue;
      } else if (
        userType === "STU" &&
        (!parentMail.includes("@") || !parentMail.includes("."))
      ) {
        result.status = 400;
        result.message = "Give a valid Parent Mail ID";
        resultData.push(result);
        continue;
      } else if (userType === "STU" && !parentPhone.toString()) {
        result.status = 400;
        result.message = "Parent Phone Number is required";
        resultData.push(result);
        continue;
      } else if (userType === "STU" && parentPhone.toString().length !== 10) {
        result.status = 400;
        result.message = "Parent Phone Number must be 10 digits";
        resultData.push(result);
        continue;
      } else if (userType === "STU" && mail === parentMail) {
        result.status = 400;
        result.message = "Parent Mail ID cannot be same as Student Mail ID";
        resultData.push(result);
        continue;
      } else if (userType === "STU" && phoneNumber === parentPhone) {
        result.status = 400;
        result.message =
          "Parent Phone Number cannot be same as Student Phone Number";
        resultData.push(result);
        continue;
      }

      const charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
      let password = "";

      for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset.charAt(randomIndex);
      }

      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const userCount = await UserDetails.find({ userType });
      const userID =
        userType.charAt(0) + (userCount.length + 1).toString().padStart(5, "0");

      const auth = new Auth({
        userID,
        password: hashedPassword,
      });

      const userDetails = new UserDetails({
        userID,
        userType,
        name,
        mail,
      });

      const userDepartmentDetails = new UserDepartmentDetails({
        userID,
        department,
        rollNumber,
        year,
        section,
      });

      const userContacts = new UserContacts({
        userID,
        phoneNumber,
        parentMail,
        parentPhone,
      });

      await auth.save();
      await userDetails.save();
      await userDepartmentDetails.save();
      await userContacts.save();

      // sendMail(
      //   mail,
      //   "KEC Presence Portal – Registration Successful",
      //   `Dear ${name},\nYour account for the KEC Presence Portal has been successfully created. Use the following credentials to log in:\n\nEmail: ${mail}\nPassword: ${password}\n\nNote: Please change your password after your first login.\n\nFor any queries, contact us at ${process.env.MAIL}\n\nThanks & regards,\nKEC Presence Team.`
      // );

      result.status = 200;
      result.message = "User added successfully";
      resultData.push(result);
    }

    return res.json({ status: 200, data: resultData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "Server error. Please contact administrator.",
    });
  }
});

module.exports = usersRoute;
