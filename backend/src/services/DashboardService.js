const jwt = require("jsonwebtoken");
const {
  UserDetails,
  UserDepartmentDetails,
  UserSessions,
} = require("../models/UsersModel");
const statusCodes = require("../utils/statusCodes");
const { verifyToken, getTokenData } = require("./TokenVerificationService");

// Function to get the Admin dashboard data
const getAdminData = async (req) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User change password attempt failed: Authorization token is missing.`,
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Authorization token is missing.",
      };
    }

    const tokenVerification = await verifyToken(token);
    if (!tokenVerification) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User change password attempt failed: Expired token.`,
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Your session has expired. Please log in again.",
      };
    }

    const { tokenUserID, tokenUserType } = await getTokenData(token);

    if (tokenUserType !== "ADMIN") {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Unauthorized dashboard data access attempt by user ID: ${tokenUserID}`,
      );
      return {
        status: statusCodes.FORBIDDEN,
        message: "You do not have permission to access this resource.",
      };
    }

    const userDetailsData = await UserDetails.find({});
    const sessionsData = await UserSessions.find()
      .sort({ loginTime: -1 })
      .limit(20);

    const countsData = userDetailsData.reduce((count, user) => {
      count[user.userType] = (count[user.userType] ?? 0) + 1;
      return count;
    }, {});

    console.log(
      `[INFO] - [${new Date().toISOString()}] - Admin dashboard data retrieved successfully by user ID: ${tokenUserID}`,
    );

    return {
      status: statusCodes.OK,
      message: "Dashboard data retrieved successfully.",
      data: {
        countsData: countsData,
        sessionData: sessionsData,
      },
    };
  } catch (error) {
    console.error(
      `[ERROR] - [${new Date().toISOString()}] - Error during getting dashboard data process:`,
      error,
    );
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
      message:
        "Internal server error. Please report this issue to the administrator.",
    };
  }
};

// Function to get the HoD dashboard data
const getHoDData = async (req) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User change password attempt failed: Authorization token is missing.`,
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Authorization token is missing.",
      };
    }

    const tokenVerification = await verifyToken(token);
    if (!tokenVerification) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User change password attempt failed: Expired token.`,
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Your session has expired. Please log in again.",
      };
    }

    const { tokenUserID, tokenUserType } = await getTokenData(token);

    if (tokenUserType !== "HOD") {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Unauthorized dashboard data access attempt by user ID: ${tokenUserID}`,
      );
      return {
        status: statusCodes.FORBIDDEN,
        message: "You do not have permission to access this resource.",
      };
    }

    const userDepartment = await UserDepartmentDetails.findOne({
      userID: tokenUserID,
    });

    const departmentData = await UserDepartmentDetails.find({
      department: userDepartment.department,
    });

    const userTypeCount = departmentData.reduce((count, user) => {
      count[user.userType] = (count[user.userType] ?? 0) + 1;
      return count;
    }, {});

    return {
      status: statusCodes.OK,
      message: "Dashboard data retrieved successfully.",
      data: {
        userCountData: userTypeCount,
      },
    };
  } catch (error) {
    console.error(
      `[ERROR] - [${new Date().toISOString()}] - Error during getting dashboard data process:`,
      error,
    );
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
      message:
        "Internal server error. Please report this issue to the administrator.",
    };
  }
};

// Function to get the Incharge dashboard data
const getInchargeData = async (req) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User change password attempt failed: Authorization token is missing.`,
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Authorization token is missing.",
      };
    }

    const tokenVerification = await verifyToken(token);
    if (!tokenVerification) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User change password attempt failed: Expired token.`,
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Your session has expired. Please log in again.",
      };
    }

    const { tokenUserID, tokenUserType } = await getTokenData(token);

    if (tokenUserType !== "INCHARGE") {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Unauthorized dashboard data access attempt by user ID: ${tokenUserID}`,
      );
      return {
        status: statusCodes.FORBIDDEN,
        message: "You do not have permission to access this resource.",
      };
    }
  } catch (error) {
    console.error(
      `[ERROR] - [${new Date().toISOString()}] - Error during getting dashboard data process:`,
      error,
    );
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
      message:
        "Internal server error. Please report this issue to the administrator.",
    };
  }
};

// Function to get the Advisor dashboard data
const getAdvisorData = async (req) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User change password attempt failed: Authorization token is missing.`,
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Authorization token is missing.",
      };
    }

    const tokenVerification = await verifyToken(token);
    if (!tokenVerification) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User change password attempt failed: Expired token.`,
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Your session has expired. Please log in again.",
      };
    }

    const { tokenUserID, tokenUserType } = await getTokenData(token);

    if (tokenUserType !== "ADVISOR") {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Unauthorized dashboard data access attempt by user ID: ${tokenUserID}`,
      );
      return {
        status: statusCodes.FORBIDDEN,
        message: "You do not have permission to access this resource.",
      };
    }
  } catch (error) {
    console.error(
      `[ERROR] - [${new Date().toISOString()}] - Error during getting dashboard data process:`,
      error,
    );
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
      message:
        "Internal server error. Please report this issue to the administrator.",
    };
  }
};

// Function to get the Student dashboard data
const getStudentData = async (req) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User change password attempt failed: Authorization token is missing.`,
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Authorization token is missing.",
      };
    }

    const tokenVerification = await verifyToken(token);
    if (!tokenVerification) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User change password attempt failed: Expired token.`,
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Your session has expired. Please log in again.",
      };
    }

    const { tokenUserID, tokenUserType } = await getTokenData(token);

    if (tokenUserType !== "STUDENT") {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Unauthorized dashboard data access attempt by user ID: ${tokenUserID}`,
      );
      return {
        status: statusCodes.FORBIDDEN,
        message: "You do not have permission to access this resource.",
      };
    }
  } catch (error) {
    console.error(
      `[ERROR] - [${new Date().toISOString()}] - Error during getting dashboard data process:`,
      error,
    );
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
      message:
        "Internal server error. Please report this issue to the administrator.",
    };
  }
};

module.exports = {
  getAdminData,
  getHoDData,
  getInchargeData,
  getAdvisorData,
  getStudentData,
};
