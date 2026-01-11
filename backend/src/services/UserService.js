const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const {
  Auth,
  UserDetails,
  UserDepartmentDetails,
  UserContacts,
  UserSessions,
} = require("../models/UsersModel");
const { verifyToken, getTokenData } = require("./TokenVerificationService");
const statusCodes = require("../utils/statusCodes");
const MailerService = require("./MailerService");

dotenv.config();
const saltRounds = 10;

// Helper function to validate email format
function isValidEmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

// Helper function to validate phone number format
function isValidPhone(phone) {
  const regex = /^[6-9]\d{9}$/;
  return regex.test(phone);
}

// Function to create an admin user if none exists
const createAdminUser = async () => {
  try {
    console.log(
      `[INFO] - [${new Date().toISOString()}] - Admin user setup process started.`
    );
    const userCount = await Auth.countDocuments();
    if (userCount === 0) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - No existing users found. Creating a new admin user.`
      );
      const charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
      let password = "";

      for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset.charAt(randomIndex);
      }

      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newAuth = new Auth({
        userID: "USR00001",
        password: hashedPassword,
        isActive: true,
        createdAt: new Date().toISOString(),
        createdBy: "SYSTEM",
        updatedAt: new Date().toISOString(),
        updatedBy: "SYSTEM",
      });

      const newUserDetails = new UserDetails({
        userID: "USR00001",
        userType: "ADMIN",
        name: "Admin",
        mail: process.env.MAIL,
        createdAt: new Date().toISOString(),
        caretedBy: "SYSTEM",
        updatedAt: new Date().toISOString(),
        updatedBy: "SYSTEM",
      });

      const newUserDepartmentDetails = new UserDepartmentDetails({
        userID: "USR00001",
        createdAt: new Date().toISOString(),
        createdBy: "SYSTEM",
        updatedAt: new Date().toISOString(),
        updatedBy: "SYSTEM",
      });

      const newUserContacts = new UserContacts({
        userID: "USR00001",
        phoneNumber: process.env.ADMIN_PHONE,
        createdAt: new Date().toISOString(),
        createdBy: "SYSTEM",
        updatedAt: new Date().toISOString(),
        updatedBy: "SYSTEM",
      });

      console.log(
        `[INFO] - [${new Date().toISOString()}] - Admin user created with email: ${
          process.env.MAIL
        }`
      );

      MailerService.mailerService(
        process.env.MAIL,
        "Admin Account Created",
        `Dear Admin,\n\nWe are pleased to inform you that your admin account for the KEC Presence portal has been successfully created. You can now access your account using the following login credentials:\n\nMail ID: ${process.env.MAIL}\nPassword: ${password}\n\nFor security purposes, we recommend that you change your password upon your first login.\n\nThanks & Regards,\nKEC Presence Team`
      );

      await newAuth.save();
      await newUserDetails.save();
      await newUserDepartmentDetails.save();
      await newUserContacts.save();
    } else {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Admin user setup process completed. User already exists.`
      );
    }
  } catch (error) {
    console.error(
      `[ERROR] - [${new Date().toISOString()}] - Error creating admin user:`,
      error
    );
  }
};

// Function to create a new user
const createUser = async (req) => {
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
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Create User attempt failed: Authorization token is missing.`
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Authorization token is missing.",
      };
    }

    const tokenVerification = await verifyToken(token);
    if (!tokenVerification) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User change password attempt failed: Expired token.`
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Your session has expired. Please log in again.",
      };
    }

    const { tokenUserID, tokenUserType } = await getTokenData(token);

    if (tokenUserType !== "ADMIN" && tokenUserID !== userID) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User creation attempt failed: Insufficient permissions.`
      );
      return {
        status: statusCodes.FORBIDDEN,
        message: "You do not have permission to create users.",
      };
    }

    const userData = await UserDetails.findOne({ mail: mail });

    if (userData) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User creation attempt failed: User already exists with same Mail ID.`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: "User already exists with same Mail ID",
      };
    } else if (!userType) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User creation attempt failed: User Type is required.`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: "User Type is required",
      };
    } else if (userType !== "ADMIN" && !department) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User creation attempt failed: Department is required.`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: "Department is required",
      };
    } else if (!name) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User creation attempt failed: Name is required.`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: "Name is required",
      };
    } else if (userType === "STUDENT" && !rollNumber) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User creation attempt failed: Roll Number is required.`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: "Roll Number is required",
      };
    } else if (userType !== "ADMIN" && userType !== "HOD" && !year) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User creation attempt failed: Year is required.`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: "Year is required",
      };
    } else if ((userType === "CA" || userType === "STUDENT") && !section) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User creation attempt failed: Section is required.`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: "Section is required",
      };
    } else if (!mail) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User creation attempt failed: Mail ID is required.`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: "Mail ID is required",
      };
    } else if (!isValidEmail(mail)) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User creation attempt failed: Invalid Mail ID format.`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: "Give a valid Mail ID",
      };
    } else if (!phoneNumber) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User creation attempt failed: Phone Number is required.`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: "Phone Number is required",
      };
    } else if (!isValidPhone(phoneNumber)) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User creation attempt failed: Invalid Phone Number format.`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: "Give a valid Phone Number",
      };
    } else if (userType === "STUDENT" && !parentMail) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User creation attempt failed: Parent Mail ID is required.`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: "Parent Mail ID is required",
      };
    } else if (userType === "STUDENT" && !isValidEmail(parentMail)) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User creation attempt failed: Invalid Parent Mail ID format.`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: "Give a valid Parent Mail ID",
      };
    } else if (userType === "STUDENT" && !parentPhone) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User creation attempt failed: Parent Phone Number is required.`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: "Parent Phone Number is required",
      };
    } else if (userType === "STUDENT" && !isValidPhone(parentPhone)) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User creation attempt failed: Invalid Parent Phone Number format.`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: "Give a valid Parent Phone Number",
      };
    } else if (userType === "STUDENT" && mail === parentMail) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User creation attempt failed: Parent Mail ID cannot be same as Student Mail ID.`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: "Parent Mail ID cannot be same as Student Mail ID",
      };
    } else if (userType === "STUDENT" && phoneNumber === parentPhone) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User creation attempt failed: Parent Phone Number cannot be same as Student Phone Number.`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: "Parent Phone Number cannot be same as Student Phone Number",
      };
    }

    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let password = "";

    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset.charAt(randomIndex);
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userCount = await UserDetails.countDocuments();
    const newUserID = "USR" + (userCount + 1).toString().padStart(5, "0");

    const auth = new Auth({
      userID: newUserID,
      password: hashedPassword,
      isActive: true,
      createdBy: tokenUserID,
      createdAt: new Date().toISOString(),
      updatedBy: tokenUserID,
      updatedAt: new Date().toISOString(),
    });

    const userDetails = new UserDetails({
      userID: newUserID,
      userType: userType,
      name: name,
      mail: mail,
      createdBy: tokenUserID,
      createdAt: new Date().toISOString(),
      updatedBy: tokenUserID,
      updatedAt: new Date().toISOString(),
    });

    const userDepartmentDetails = new UserDepartmentDetails({
      userID: newUserID,
      rollNumber: rollNumber,
      year: year,
      section: section,
      department: department,
      createdBy: tokenUserID,
      createdAt: new Date().toISOString(),
      updatedBy: tokenUserID,
      updatedAt: new Date().toISOString(),
    });

    const userContacts = new UserContacts({
      userID: newUserID,
      phoneNumber: phoneNumber,
      parentMail: parentMail,
      parentPhone: parentPhone,
      createdBy: tokenUserID,
      createdAt: new Date().toISOString(),
      updatedBy: tokenUserID,
      updatedAt: new Date().toISOString(),
    });

    await auth.save();
    await userDetails.save();
    await userDepartmentDetails.save();
    await userContacts.save();

    MailerService.mailerService(
      mail,
      "KEC Presence Portal – Registration Successful",
      `Dear ${name},\n\nWe are pleased to inform you that your account for the KEC Presence portal has been successfully created. You can now access your account using the following login credentials:\n\nMail ID: ${mail}\nPassword: ${password}\n\nFor security purposes, we recommend that you change your password upon your first login.\n\nThanks & Regards,\nKEC Presence Team`
    );

    console.log(
      `[INFO] - [${new Date().toISOString()}] - New user created with email: ${mail} by admin: ${tokenUserID}`
    );

    return {
      status: statusCodes.CREATED,
      message: "User created successfully",
    };
  } catch (error) {
    console.error(
      `[ERROR] - [${new Date().toISOString()}] - Error creating user:`,
      error
    );
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
      message:
        "Internal server error. Please report this issue to the administrator.",
    };
  }
};

// Function to get all users
const getAllUsers = async (req) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Get all users attempt failed: Authorization token is missing.`
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Authorization token is missing.",
      };
    }

    const tokenVerification = await verifyToken(token);
    if (!tokenVerification) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User change password attempt failed: Expired token.`
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Your session has expired. Please log in again.",
      };
    }

    const { tokenUserID, tokenUserType } = await getTokenData(token);
    const { pageNumber, pageSize } = req.query;

    let usersData = await UserDetails.find().sort({ createdAt: -1 });
    let authData = await Auth.find().sort({ createdAt: -1 });
    const userDeptData = await UserDepartmentDetails.find().sort({
      createdAt: -1,
    });

    usersData = usersData.map((user) => {
      const auth = authData.find((a) => a.userID === user.userID);
      return {
        ...user._doc,
        isActive: auth ? auth.isActive : null,
      };
    });

    if (tokenUserType === "ADMIN") {
      usersData = usersData.filter((user) => user.userType !== "ADMIN");
    } else if (tokenUserType === "HOD") {
      const hodDept = userDeptData.find(
        (dept) => dept.userID === tokenUserID
      ).department;
      const hodUsersIDs = userDeptData
        .filter((dept) => dept.department === hodDept)
        .map((dept) => dept.userID);
      usersData = usersData.filter((user) => hodUsersIDs.includes(user.userID));
    } else if (tokenUserType === "INCHARGE") {
      const inchargeData = userDeptData.find(
        (dept) => dept.userID === tokenUserID
      );
      const inchargeUsersIDs = userDeptData
        .filter(
          (dept) =>
            dept.department === inchargeData.department &&
            dept.year === inchargeData.year
        )
        .map((dept) => dept.userID);
      usersData = usersData.filter((user) =>
        inchargeUsersIDs.includes(user.userID)
      );
    } else if (tokenUserType === "ADVISOR") {
      const advisorDeptData = userDeptData.find(
        (dept) => dept.userID === tokenUserID
      );
      const advisorUsersIDs = userDeptData
        .filter(
          (dept) =>
            dept.department === advisorDeptData.department &&
            dept.year === advisorDeptData.year &&
            dept.section === advisorDeptData.section
        )
        .map((dept) => dept.userID);
      usersData = usersData.filter((user) =>
        advisorUsersIDs.includes(user.userID)
      );
    } else {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User data fetch attempt failed: Insufficient permissions.`
      );
      return {
        status: statusCodes.FORBIDDEN,
        message: "You do not have permission to view users.",
      };
    }

    const startIndex = (Number(pageNumber) - 1) * Number(pageSize);
    const endIndex = startIndex + Number(pageSize);
    const totalRecords = usersData.length;

    usersData = usersData.slice(startIndex, endIndex);

    console.log(
      `[INFO] - [${new Date().toISOString()}] - Users data fetched by user: ${tokenUserID}`
    );

    return {
      status: statusCodes.OK,
      message: "Users fetched successfully",
      data: { total: totalRecords, data: usersData },
    };
  } catch (error) {
    console.error(
      `[ERROR] - [${new Date().toISOString()}] - Error fetching users:`,
      error
    );
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
      message:
        "Internal server error. Please report this issue to the administrator.",
    };
  }
};

// Function to get user data by ID
const getUserDataByID = async (req) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User data fetch attempt failed: Authorization token is missing.`
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Authorization token is missing.",
      };
    }

    const tokenVerification = await verifyToken(token);
    if (!tokenVerification) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User data fetch attempt failed: Expired token.`
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Your session has expired. Please log in again.",
      };
    }

    const { tokenUserID, tokenUserType } = await getTokenData(token);
    const { userID } = req.params;

    if (tokenUserType !== "ADMIN" && tokenUserID !== userID) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User data fetch attempt failed: Insufficient permissions.`
      );
      return {
        status: statusCodes.FORBIDDEN,
        message: "You do not have permission to view this user's data.",
      };
    }

    const userData = await UserDetails.findOne({ userID: userID });
    const userDeptData = await UserDepartmentDetails.findOne({
      userID: userID,
    });
    const userContactData = await UserContacts.findOne({ userID: userID });
    const authData = await Auth.findOne({ userID: userID });

    if (!userData && !userDeptData && !userContactData && !authData) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User data fetch attempt failed: User not found.`
      );
      return {
        status: statusCodes.NOT_FOUND,
        message: "User data not found for the given user ID.",
      };
    }

    const userFullData = {
      userID: userData.userID,
      userType: userData.userType,
      name: userData.name,
      mail: userData.mail,
      rollNumber: userDeptData.rollNumber,
      year: userDeptData.year,
      section: userDeptData.section,
      department: userDeptData.department,
      phoneNumber: userContactData.phoneNumber,
      parentMail: userContactData.parentMail,
      parentPhone: userContactData.parentPhone,
      isActive: authData.isActive,
    };

    console.log(
      `[INFO] - [${new Date().toISOString()}] - User data fetched for userID: ${userID} by user: ${tokenUserID}`
    );

    return {
      status: statusCodes.OK,
      message: "User data fetched successfully",
      data: userFullData,
    };
  } catch (error) {
    console.error(
      `[ERROR] - [${new Date().toISOString()}] - Error fetching user by ID:`,
      error
    );
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
      message:
        "Internal server error. Please report this issue to the administrator.",
    };
  }
};

// Function to update user data
const updateUserData = async (req) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Update user data attempt failed: Authorization token is missing.`
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Authorization token is missing.",
      };
    }

    const tokenVerification = await verifyToken(token);
    if (!tokenVerification) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User change password attempt failed: Expired token.`
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Your session has expired. Please log in again.",
      };
    }

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
    const { userID } = req.params;
    const { tokenUserID, tokenUserType } = await getTokenData(token);

    if (tokenUserType !== "ADMIN" && userID !== tokenUserID) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User update attempt failed: Insufficient permissions.`
      );
      return {
        status: statusCodes.FORBIDDEN,
        message: "You do not have permission to update user data.",
      };
    }

    if (!userType) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User update attempt failed: User Type is required.`
      );
      return { status: 400, message: "User Type is required" };
    } else if (userType !== "ADMIN" && !department) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User update attempt failed: Department is required.`
      );
      return { status: 400, message: "Department is required" };
    } else if (!name) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User update attempt failed: Name is required.`
      );
      return { status: 400, message: "Name is required" };
    } else if (userType === "STUDENT" && !rollNumber) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User update attempt failed: Roll Number is required.`
      );
      return { status: 400, message: "Roll Number is required" };
    } else if (userType !== "ADMIN" && userType !== "HOD" && !year) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User update attempt failed: Year is required.`
      );
      return { status: 400, message: "Year is required" };
    } else if (userType === "CA" && userType === "STUDENT" && !section) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User update attempt failed: Section is required.`
      );
      return { status: 400, message: "Section is required" };
    } else if (!mail) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User update attempt failed: Mail ID is required.`
      );
      return { status: 400, message: "Mail ID is required" };
    } else if (!isValidEmail(mail)) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User update attempt failed: Invalid Mail ID format.`
      );
      return { status: 400, message: "Give a valid Mail ID" };
    } else if (!phoneNumber) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User update attempt failed: Phone Number is required.`
      );
      return { status: 400, message: "Phone Number is required" };
    } else if (!isValidPhone(phoneNumber)) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User update attempt failed: Invalid Phone Number format.`
      );
      return {
        status: 400,
        message: "Give a valid Phone Number",
      };
    } else if (userType === "STUDENT" && !parentMail) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User update attempt failed: Parent Mail ID is required.`
      );
      return { status: 400, message: "Parent Mail ID is required" };
    } else if (userType === "STUDENT" && !isValidEmail(parentMail)) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User update attempt failed: Invalid Parent Mail ID format.`
      );
      return { status: 400, message: "Give a valid Parent Mail ID" };
    } else if (userType === "STUDENT" && !parentPhone) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User update attempt failed: Parent Phone Number is required.`
      );
      return {
        status: 400,
        message: "Parent Phone Number is required",
      };
    } else if (userType === "STUDENT" && !isValidPhone(parentPhone)) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User update attempt failed: Invalid Parent Phone Number format.`
      );
      return {
        status: 400,
        message: "Give a valid Parent Phone Number",
      };
    } else if (userType === "STUDENT" && mail === parentMail) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User update attempt failed: Parent Mail ID cannot be same as Student Mail ID.`
      );
      return {
        status: 400,
        message: "Parent Mail ID cannot be same as Student Mail ID",
      };
    } else if (userType === "STUDENT" && phoneNumber === parentPhone) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User update attempt failed: Parent Phone Number cannot be same as Student Phone Number.`
      );
      return {
        status: 400,
        message: "Parent Phone Number cannot be same as Student Phone Number",
      };
    }

    await UserDetails.updateOne(
      { userID: userID },
      {
        userType: userType,
        name: name,
        mail: mail,
        updatedBy: tokenUserID,
        updatedAt: new Date().toISOString(),
      }
    );

    await UserDepartmentDetails.updateOne(
      { userID: userID },
      {
        rollNumber: rollNumber,
        year: year,
        section: section,
        department: department,
        updatedBy: tokenUserID,
        updatedAt: new Date().toISOString(),
      }
    );

    await UserContacts.updateOne(
      { userID: userID },
      {
        phoneNumber: phoneNumber,
        parentMail: parentMail,
        parentPhone: parentPhone,
        updatedBy: tokenUserID,
        updatedAt: new Date().toISOString(),
      }
    );

    console.log(
      `[INFO] - [${new Date().toISOString()}] - User updated with UserID: ${userID}`
    );

    return {
      status: statusCodes.OK,
      message: "User updated successfully",
    };
  } catch (error) {
    console.error(
      `[ERROR] - [${new Date().toISOString()}] - Error creating user:`,
      error
    );
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
      message:
        "Internal server error. Please report this issue to the administrator.",
    };
  }
};

// Function to inactivate a user
const inactivateUser = async (req) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User inactivation attempt failed: Authorization token is missing.`
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Authorization token is missing.",
      };
    }

    const tokenVerification = await verifyToken(token);
    if (!tokenVerification) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User inactivation attempt failed: Expired token.`
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Your session has expired. Please log in again.",
      };
    }

    const { tokenUserID, tokenUserType } = await getTokenData(token);
    const { userID } = req.body;

    if (tokenUserType !== "ADMIN") {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User inactivation attempt failed: Insufficient permissions.`
      );
      return {
        status: statusCodes.FORBIDDEN,
        message: "You do not have permission to inactivate users.",
      };
    }

    if (userID.includes(tokenUserID)) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User inactivation attempt failed: Admin cannot inactivate themselves.`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: "Admin cannot inactivate themselves.",
      };
    }

    await Auth.updateMany(
      { userID: { $in: userID } },
      {
        isActive: false,
        updatedBy: tokenUserID,
        updatedAt: new Date().toISOString(),
      }
    );

    console.log(
      `[INFO] - [${new Date().toISOString()}] - User inactivated with UserID: ${userID} by admin: ${tokenUserID}`
    );

    return {
      status: statusCodes.OK,
      message: "Users inactivated successfully",
    };
  } catch (error) {
    console.error(
      `[ERROR] - [${new Date().toISOString()}] - Error inactivating user:`,
      error
    );
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
      message:
        "Internal server error. Please report this issue to the administrator.",
    };
  }
};

// Function to export user data
const exportUserData = async (req) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Export user data failed: Authorization token is missing.`
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Authorization token is missing.",
      };
    }

    const tokenVerification = await verifyToken(token);
    if (!tokenVerification) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Export user data failed: Expired token.`
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Your session has expired. Please log in again.",
      };
    }

    const { tokenUserID, tokenUserType } = await getTokenData(token);
    const { userType, department, year, section, status } = req.query;

    const authQuery = {
      ...(status && { isActive: status === "ACTIVE" }),
    };

    const usersQuery = {
      ...(userType && { userType }),
    };

    const userDeptQuery = {
      ...(department && { department }),
      ...(year && { year }),
      ...(section && { section }),
    };

    const authData = await Auth.find(authQuery);
    const usersData = await UserDetails.find(usersQuery);
    const userDeptData = await UserDepartmentDetails.find(userDeptQuery);
    const userContactData = await UserContacts.find();

    let filteredUsers = [];

    if (tokenUserType === "ADMIN") {
      filteredUsers = authData
        .map((auth) => {
          const user = usersData.find((user) => user.userID === auth.userID);

          const dept = userDeptData.find((dept) => dept.userID === auth.userID);

          const contact = userContactData.find(
            (contact) => contact.userID === auth.userID
          );

          if (!user || !dept || !contact) return null;

          return {
            userID: user.userID,
            userType: user.userType,
            name: user.name,
            mail: user.mail,
            rollNumber: dept.rollNumber,
            year: dept.year,
            section: dept.section,
            department: dept.department,
            phoneNumber: contact.phoneNumber,
            parentMail: contact.parentMail,
            parentPhone: contact.parentPhone,
            isActive: auth.isActive,
          };
        })
        .filter(Boolean);
    } else {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Export user data failed: Insufficient permissions.`
      );
      return {
        status: statusCodes.FORBIDDEN,
        message: "You do not have permission to export users.",
      };
    }
    if (filteredUsers.length === 0) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - No users found matching the given criteria.`
      );

      return {
        status: statusCodes.BAD_REQUEST,
        message: "No users found matching the given criteria",
      };
    }

    console.log(
      `[INFO] - [${new Date().toISOString()}] - Users data exported by user: ${tokenUserID}`
    );

    return {
      status: statusCodes.OK,
      message: "Users data exported successfully",
      data: filteredUsers,
    };
  } catch (error) {
    console.error(
      `[ERROR] - [${new Date().toISOString()}] - Error fetching users:`,
      error
    );
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
      message:
        "Internal server error. Please report this issue to the administrator.",
    };
  }
};

// Function to get all the user sessions
const getUserSessionData = async (req) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User inactivation attempt failed: Authorization token is missing.`
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Authorization token is missing.",
      };
    }

    const tokenVerification = await verifyToken(token);
    if (!tokenVerification) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User inactivation attempt failed: Expired token.`
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Your session has expired. Please log in again.",
      };
    }

    const { tokenUserID, tokenUserType } = await getTokenData(token);
    const { pageNumber, pageSize } = req.query;

    if (tokenUserType !== "ADMIN") {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User inactivation attempt failed: Insufficient permissions.`
      );
      return {
        status: statusCodes.FORBIDDEN,
        message: "You do not have permission to inactivate users.",
      };
    }

    let sessionsData = await UserSessions.find()
      .select("-token")
      .sort({ createdAt: -1 });

    console.log(
      `[INFO] - [${new Date().toISOString()}] - User sessions fetched by admin: ${tokenUserID}`
    );

    const startIndex = (Number(pageNumber) - 1) * Number(pageSize);
    const endIndex = startIndex + Number(pageSize);
    const totalRecords = sessionsData.length;

    sessionsData = sessionsData.slice(startIndex, endIndex);

    return {
      status: statusCodes.OK,
      message: "User sessions fetched successfully",
      data: { total: totalRecords, data: sessionsData },
    };
  } catch (error) {
    console.error(
      `[ERROR] - [${new Date().toISOString()}] - Error fetching user sessions:`,
      error
    );
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
      message:
        "Internal server error. Please report this issue to the administrator.",
    };
  }
};

// Function to inactive the user session
const inactivateUserSession = async (req) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User inactivation attempt failed: Authorization token is missing.`
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Authorization token is missing.",
      };
    }

    const tokenVerification = await verifyToken(token);
    if (!tokenVerification) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User inactivation attempt failed: Expired token.`
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Your session has expired. Please log in again.",
      };
    }

    const { tokenUserID, tokenUserType } = await getTokenData(token);
    const { sessionID } = req.body;

    if (tokenUserType !== "ADMIN") {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User inactivation attempt failed: Insufficient permissions.`
      );
      return {
        status: statusCodes.FORBIDDEN,
        message: "You do not have permission to inactivate users.",
      };
    }
    await UserSessions.updateMany(
      { _id: { $in: sessionID } },
      {
        isActive: false,
        token: null,
        logoutTime: new Date().toISOString(),
        updatedBy: tokenUserID,
        updatedAt: new Date().toISOString(),
      }
    );
    return {
      status: statusCodes.OK,
      message: "User sessions inactivated successfully",
    };
  } catch (error) {
    console.error(
      `[ERROR] - [${new Date().toISOString()}] - Error inactivating user session:`,
      error
    );
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
      message:
        "Internal server error. Please report this issue to the administrator.",
    };
  }
};

// Function to inactivate all sessions of a user
const inActiveAllUserSessions = async (req) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User inactivation attempt failed: Authorization token is missing.`
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Authorization token is missing.",
      };
    }

    const tokenVerification = await verifyToken(token);
    if (!tokenVerification) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User inactivation attempt failed: Expired token.`
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Your session has expired. Please log in again.",
      };
    }

    const { tokenUserID, tokenUserType } = await getTokenData(token);

    if (tokenUserType !== "ADMIN") {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User inactivation attempt failed: Insufficient permissions.`
      );
      return {
        status: statusCodes.FORBIDDEN,
        message: "You do not have permission to inactivate users.",
      };
    }

    await UserSessions.updateMany(
      { isActive: true, token: { $ne: token } },
      {
        isActive: false,
        token: null,
        logoutTime: new Date().toISOString(),
        updatedBy: tokenUserID,
        updatedAt: new Date().toISOString(),
      }
    );

    console.log(
      `[INFO] - [${new Date().toISOString()}] - All user sessions inactivated by admin: ${tokenUserID}`
    );

    return {
      status: statusCodes.OK,
      message: "All user sessions inactivated successfully",
    };
  } catch (error) {
    console.error(
      `[ERROR] - [${new Date().toISOString()}] - Error inactivating all user sessions:`,
      error
    );
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
      message:
        "Internal server error. Please report this issue to the administrator.",
    };
  }
};

module.exports = {
  createAdminUser,
  createUser,
  getAllUsers,
  getUserDataByID,
  updateUserData,
  inactivateUser,
  exportUserData,
  getUserSessionData,
  inactivateUserSession,
  inActiveAllUserSessions,
};
