const {
  Auth,
  UserDetails,
  UserDepartmentDetails,
  UserSessions,
} = require("../models/UsersModel");
const { verifyToken, getTokenData } = require("./TokenVerificationService");
const statusCodes = require("../utils/statusCodes");

// Function to migrate user years
const migrateUserYears = async (req) => {
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

    if (tokenUserType !== "ADMIN") {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Unauthorized year migration attempt by user ID: ${tokenUserID}`
      );
      return {
        status: statusCodes.FORBIDDEN,
        message: "You do not have permission to perform this action.",
      };
    }

    console.log(
      `[INFO] - [${new Date().toISOString()}] - Year migration initiated by admin user ID: ${tokenUserID}`
    );

    const userData = await Auth.find({ isActive: true });

    for (const user of userData) {
      const userDeptDetails = await UserDepartmentDetails.findOne({
        userID: user.userID,
      });
      const userDetails = await UserDetails.findOne({ userID: user.userID });

      if (userDetails.userType === "STUDENT" && userDeptDetails.year < 4) {
        userDeptDetails.year += 1;
        userDeptDetails.updatedAt = new Date();
        userDeptDetails.updatedBy = tokenUserID;
        await userDeptDetails.save();

        console.log(
          `[INFO] - [${new Date().toISOString()}] - Migrated user ID: ${
            user.userID
          } to year ${userDeptDetails.year}`
        );
      } else if (
        userDetails.userType === "STUDENT" &&
        userDeptDetails.year >= 4
      ) {
        await Auth.updateOne(
          { userID: user.userID },
          { isActive: false, updatedAt: new Date(), updatedBy: tokenUserID }
        );

        console.log(
          `[INFO] - [${new Date().toISOString()}] - Deactivated user ID: ${
            user.userID
          } as the year exceeded 4.`
        );
      }
    }

    console.log(
      `[INFO] - [${new Date().toISOString()}] - Year migration completed successfully by admin user ID: ${tokenUserID}`
    );

    return {
      status: statusCodes.OK,
      message: "User years migrated successfully.",
    };
  } catch (error) {
    console.error(
      `[ERROR] - [${new Date().toISOString()}] - Error migrating user years:`,
      error
    );
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
      message:
        "Internal server error. Please report this issue to the administrator.",
    };
  }
};

const inactivateUserSessions = async (req) => {
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

    if (tokenUserType !== "ADMIN") {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Unauthorized year migration attempt by user ID: ${tokenUserID}`
      );
      return {
        status: statusCodes.FORBIDDEN,
        message: "You do not have permission to perform this action.",
      };
    }

    console.log(
      `[INFO] - [${new Date().toISOString()}] - Inactivate user sessions initiated by admin user ID: ${tokenUserID}`
    );

    await UserSessions.updateMany(
      { isActive: true, userID: { $ne: tokenUserID } },
      {
        isActive: false,
        logoutTime: new Date(),
        updatedAt: new Date(),
        updatedBy: tokenUserID,
      }
    );

    console.log(
      `[INFO] - [${new Date().toISOString()}] - All user sessions inactivated successfully by admin user ID: ${tokenUserID}`
    );

    return {
      status: statusCodes.OK,
      message: "All user sessions inactivated successfully.",
    };
  } catch (error) {
    console.error(
      `[ERROR] - [${new Date().toISOString()}] - Error inactivating user sessions:`
    );

    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
      message:
        "Internal server error. Please report this issue to the administrator.",
    };
  }
};

module.exports = {
  migrateUserYears,
  inactivateUserSessions,
};
