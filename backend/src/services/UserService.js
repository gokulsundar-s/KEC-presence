const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const {
  Auth,
  UserDetails,
  UserDepartmentDetails,
  UserContacts,
} = require("../models/UsersModel");
const { verifyToken, getTokenData } = require("./TokenVerificationService");
const statusCodes = require("../utils/statusCodes");
const MailerService = require("./MailerService");

dotenv.config();
const saltRounds = 10;

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
        `[INFO] - [${new Date().toISOString()}] - User change password attempt failed: Authorization token is missing.`
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

    if (tokenUserType !== "ADMIN") {
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

// Function to create multiple users in bulk
const createBulkUsers = async (req) => {
  try {
    const { userDataList } = req.body;
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Bulk user creation attempt failed: Authorization token is missing.`
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Authorization token is missing.",
      };
    }

    const tokenVerification = await verifyToken(token);
    if (!tokenVerification) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Bulk user creation attempt failed: Expired token.`
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Your session has expired. Please log in again.",
      };
    }

    const userCreateResults = [];

    for (const userData of userDataList) {
      req.body = userData;
      const result = await createUser(req);
      userCreateResults.push(result);
    }

    console.log(
      `[INFO] - [${new Date().toISOString()}] - Bulk user creation process completed by admin.`
    );

    return {
      status: statusCodes.OK,
      message: "Bulk user creation process completed.",
      results: userCreateResults,
    };
  } catch (error) {
    console.error(
      `[ERROR] - [${new Date().toISOString()}] - Error creating users in bulk:`,
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
        `[INFO] - [${new Date().toISOString()}] - User change password attempt failed: Authorization token is missing.`
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

    let usersData = await UserDetails.find();
    const userDeptData = await UserDepartmentDetails.find();

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

    console.log(
      `[INFO] - [${new Date().toISOString()}] - Users data fetched by user: ${tokenUserID}`
    );

    return {
      status: statusCodes.OK,
      message: "Users fetched successfully",
      data: usersData,
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
    const { userID } = req.params;
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

    if (tokenUserType === "STUDENT" || tokenUserID === userID) {
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
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User change password attempt failed: Authorization token is missing.`
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

    const { tokenUserID } = await getTokenData(token);

    if (userID !== tokenUserID) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User update attempt failed: Users cannot update other user's data.`
      );
      return {
        status: statusCodes.FORBIDDEN,
        message: "You do not have permission to update other user's data.",
      };
    }

    const userData = await UserDetails.find({ mail: mail });
    const duplicateUsers = userData.filter((user) => user.userID !== userID);

    if (duplicateUsers.length > 0) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User update attempt failed: Duplicate mail ID found.`
      );
      return { status: 400, message: "User already exists with same Mail ID" };
    } else if (!userType) {
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
    const { userID } = req.params;
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

    await Auth.updateOne(
      { userID: userID },
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
      message: "User inactivated successfully",
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

module.exports = {
  createAdminUser,
  createUser,
  createBulkUsers,
  getAllUsers,
  getUserDataByID,
  updateUserData,
  inactivateUser,
};
