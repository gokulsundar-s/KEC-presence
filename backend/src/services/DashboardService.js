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
    const userDepartmentDetailsData = await UserDepartmentDetails.find({});
    const sessionsData = await UserSessions.find()
      .sort({ loginTime: -1 })
      .limit(20);
    const loginCountData = await UserSessions.find({});

    const countsData = userDetailsData.reduce((count, user) => {
      count[user.userType] = (count[user.userType] ?? 0) + 1;
      return count;
    }, {});

    const userTypeMap = userDetailsData.reduce((map, user) => {
      map[user.userID] = user.userType;
      return map;
    }, {});

    const departmentUserTypeCounts = userDepartmentDetailsData.reduce(
      (acc, user) => {
        const department = user.department;
        if (!department) return acc;
        const userType = userTypeMap[user.userID];

        acc[department] ??= {};
        acc[department][userType] = (acc[department][userType] ?? 0) + 1;

        return acc;
      },
      {},
    );

    const hourLoginCounts = {};
    for (let i = 0; i < 24; i++) {
      const label =
        i === 0
          ? "12 AM"
          : i < 12
            ? `${i.toString().padStart(2, "0")} AM`
            : i === 12
              ? "12 PM"
              : `${(i - 12).toString().padStart(2, "0")} PM`;

      hourLoginCounts[label] = 0;
    }

    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0,
    );

    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    loginCountData.forEach((session) => {
      if (!session.loginTime) return;

      const loginDate = new Date(session.loginTime);

      if (loginDate >= startOfDay && loginDate < endOfDay) {
        const hour = loginDate.getHours();

        const label =
          hour === 0
            ? "12 AM"
            : hour < 12
              ? `${hour.toString().padStart(2, "0")} AM`
              : hour === 12
                ? "12 PM"
                : `${(hour - 12).toString().padStart(2, "0")} PM`;

        hourLoginCounts[label]++;
      }
    });

    console.log(
      `[INFO] - [${new Date().toISOString()}] - Admin dashboard data retrieved successfully by user ID: ${tokenUserID}`,
    );

    return {
      status: statusCodes.OK,
      message: "Dashboard data retrieved successfully.",
      data: {
        countsData: countsData,
        sessionData: sessionsData,
        departmentUserTypeCounts: departmentUserTypeCounts,
        hourLoginCounts: hourLoginCounts,
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

    return {
      status: statusCodes.OK,
      message: "Dashboard data retrieved successfully.",
      data: {},
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

module.exports = {
  getAdminData,
  getHoDData,
  getInchargeData,
  getAdvisorData,
  getStudentData,
};
