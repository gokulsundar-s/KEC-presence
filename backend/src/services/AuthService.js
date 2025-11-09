const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  Auth,
  UserDetails,
  UserDepartmentDetails,
  UserContacts,
  UserSessions,
  PasswordOtp,
} = require("../models/UsersModel");
const MailerService = require("./MailerService");
const statusCodes = require("../utils/statusCodes");
const {
  verifyToken,
  getTokenData,
} = require("../services/TokenVerificationService");

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
        createdBy: "SYSTEM",
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

// Function to handle user login
const login = async (req) => {
  try {
    const { mail, password } = req.body;

    if (!mail) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Login attempt failed: Mail is required.`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: "Please provide your mail address to proceed with login.",
      };
    }

    if (!isValidEmail(mail)) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Login attempt failed: Invalid mail format.`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: "Please provide a valid mail address to proceed with login.",
      };
    }

    if (!password) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Login attempt failed: Password is required.`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: "Please provide your password to proceed with login.",
      };
    }

    console.log(
      `[INFO] - [${new Date().toISOString()}] - Login attempt initiated for mail: ${mail}`
    );

    const user = await UserDetails.findOne({ mail: mail });
    if (!user) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Login attempt failed: User not found for mail: ${
          req.mail
        }`
      );
      return {
        status: statusCodes.NOT_FOUND,
        message: "User not found associated with the provided mail.",
      };
    }

    const userPassword = await Auth.findOne({ userID: user.userID });
    const isPasswordValid = await bcrypt.compare(
      password,
      userPassword.password
    );
    if (!isPasswordValid) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Login attempt failed: Invalid password for mail: ${mail}`
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Your password is invalid. Please try again.",
      };
    }

    const userDetails = await UserDetails.findOne({ userID: user.userID });

    const authToken = jwt.sign(
      { userID: userDetails.userID, userType: userDetails.userType },
      process.env.JWT_KEY,
      {
        expiresIn: process.env.JWT_TOKEN_EXPIRY,
      }
    );
    const newUserSession = new UserSessions({
      userID: userDetails.userID,
      device: req.headers["user-agent"]
        ? req.headers["user-agent"]
            .split(" ")[1]
            ?.split(" ")[0]
            ?.replace(/[\(\)]/g, "")
        : "Unknown",
      browser: req.headers["user-agent"]
        ? req.headers["user-agent"].split(" ")[0]
        : "Unknown",
      ipAddress: req.ip || req.connection.remoteAddress,
      loginTime: new Date().toISOString(),
      logoutTime: null,
      token: authToken,
      isActive: true,
      createdAt: new Date().toISOString(),
      createdBy: userDetails.userID,
      updatedAt: new Date().toISOString(),
      updatedBy: userDetails.userID,
    });
    await newUserSession.save();

    console.log(
      `[INFO] - [${new Date().toISOString()}] - Login successful for mail: ${mail}`
    );

    return {
      status: statusCodes.OK,
      message: "Login successful.",
      token: authToken,
    };
  } catch (error) {
    console.error(
      `[ERROR] - [${new Date().toISOString()}] - Error during login process:`,
      error
    );
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
      message:
        "Internal server error. Please report this issue to the administrator.",
    };
  }
};

// Function to handle user logout
const logout = async (req) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    const session = await UserSessions.findOne({
      token: token,
      isActive: true,
    });
    if (!session) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Logout attempt failed: No active session found for token: ${token}`
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "No active session found. Please log in again.",
      };
    }

    session.logoutTime = new Date().toISOString();
    session.isActive = false;
    session.updatedAt = new Date().toISOString();
    session.updatedBy = session.userID;
    await session.save();

    console.log(
      `[INFO] - [${new Date().toISOString()}] - Logout successful for userID: ${
        session.userID
      }`
    );

    await session.save();

    return { status: statusCodes.OK, message: "Logout successful." };
  } catch (error) {
    console.error(
      `[ERROR] - [${new Date().toISOString()}] - Error during logout process:`,
      error
    );
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
    };
  }
};

// Function to handle forget password
const forgetPassword = async (req) => {
  try {
    const { mail } = req.body;

    if (!mail) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Forget password attempt failed: Mail is required.`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message:
          "Please provide your mail address to proceed with password reset.",
      };
    }

    if (!isValidEmail(mail)) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Forget password attempt failed: Invalid mail format.`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message:
          "Please provide a valid mail address to proceed with password reset.",
      };
    }

    const userData = await UserDetails.findOne({ mail: mail });
    if (!userData) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Forget password attempt failed: User not found for mail: ${mail}`
      );
      return {
        status: statusCodes.NOT_FOUND,
        message: "User not found.",
      };
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    MailerService.mailerService(
      mail,
      "Password Reset OTP",
      `Dear ${userData.name},\n\nWe received a request to reset your password. Please use the following One-Time Password (OTP) to proceed with resetting your password:\n\nOTP: ${generatedOtp}\n\nIf you did not request a password reset, please ignore this email.\n\nThanks & Regards,\nKEC Presence Team`
    );

    const newOTP = new PasswordOtp({
      userID: userData.userID,
      otp: generatedOtp,
      isVerified: false,
      createdAt: new Date().toISOString(),
      createdBy: userData.userID,
      updatedAt: new Date().toISOString(),
      updatedBy: userData.userID,
    });

    await newOTP.save();

    console.log(
      `[INFO] - [${new Date().toISOString()}] - OTP sent successfully to mail: ${mail}`
    );
    return {
      status: statusCodes.OK,
      message: "OTP has been sent to your email.",
    };
  } catch (error) {
    console.error(
      `[ERROR] - [${new Date().toISOString()}] - Error during forget password process:`,
      error
    );
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
      message:
        "Internal server error. Please report this issue to the administrator.",
    };
  }
};

// Function to verify OTP
const verifyOtp = async (req) => {
  try {
    const { mail, otp } = req.body;

    if (!otp) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - OTP verification attempt failed: OTP is required.`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: "Please provide the OTP sent to your email.",
      };
    }

    const userData = await UserDetails.findOne({ mail: mail });
    const userMail = await PasswordOtp.findOne({
      userID: userData.userID,
    }).sort({
      createdAt: -1,
    });

    if (userMail.createdAt < new Date(Date.now() - 10 * 60 * 1000)) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - OTP verification attempt failed: OTP expired for mail: ${mail}`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: "OTP has expired. Please request a new one.",
      };
    }

    if (userMail.otp !== otp) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - OTP verification attempt failed: Invalid OTP for mail: ${mail}`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: "Invalid OTP. Please try again.",
      };
    }

    await PasswordOtp.updateOne(
      { userID: userData.userID, otp: otp },
      {
        $set: {
          isVerified: true,
          updatedAt: new Date().toISOString(),
          updatedBy: userData.userID,
          __v: userMail.__v + 1,
        },
      }
    );

    console.log(
      `[INFO] - [${new Date().toISOString()}] - OTP verified successfully for mail: ${mail}`
    );
    return {
      status: statusCodes.OK,
      message: "OTP verified successfully.",
    };
  } catch (error) {
    console.error(
      `[ERROR] - [${new Date().toISOString()}] - Error during OTP verification process:`,
      error
    );
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
      message:
        "Internal server error. Please report this issue to the administrator.",
    };
  }
};

// Function to change password after OTP verification
const changePassword = async (req) => {
  try {
    const { mail, otp, newPassword, confirmPassword } = req.body;
    if (!newPassword || !confirmPassword) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Change password attempt failed: Missing required fields.`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: "Please provide all required fields.",
      };
    }

    if (newPassword !== confirmPassword) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Change password attempt failed: Passwords do not match for mail: ${mail}`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: "Passwords do not match. Please try again.",
      };
    }

    const userData = await UserDetails.findOne({ mail: mail });

    const optData = await PasswordOtp.findOne({
      userID: userData.userID,
      otp: otp,
    }).sort({
      createdAt: -1,
    });

    if (!optData || !optData.isVerified) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Change password attempt failed: OTP not verified for mail: ${mail}`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: "OTP not verified. Please try again.",
      };
    }

    if (!isStrongPassword(newPassword).valid) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Change password attempt failed: Weak new password for mail: ${mail}`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: isStrongPassword(newPassword).reason,
      };
    }

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const authData = await Auth.findOne({ userID: userData.userID });
    await Auth.updateOne(
      { userID: userData.userID },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date().toISOString(),
          updatedBy: userData.userID,
          __v: authData.__v + 1,
        },
      }
    );

    console.log(
      `[INFO] - [${new Date().toISOString()}] - Password changed successfully for mail: ${mail}`
    );
    return {
      status: statusCodes.OK,
      message: "Password changed successfully.",
    };
  } catch (error) {
    console.error(
      `[ERROR] - [${new Date().toISOString()}] - Error during change password process:`,
      error
    );
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
      message:
        "Internal server error. Please report this issue to the administrator.",
    };
  }
};

// Function for user to change password after login
const userChangePassword = async (req) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
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

    if (!currentPassword) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User change password attempt failed: Current password is required.`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: "Please provide your current password.",
      };
    } else if (!newPassword || !confirmPassword) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User change password attempt failed: New password and confirm password are required.`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: "Please provide your new password and confirm it.",
      };
    } else if (newPassword !== confirmPassword) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User change password attempt failed: Passwords do not match for user ID: ${tokenUserID}`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: "Passwords do not match. Please try again.",
      };
    }

    const passwordData = await Auth.findOne({ userID: tokenUserID });

    const isOldPasswordSame = await bcrypt.compare(
      newPassword,
      passwordData.password
    );
    if (isOldPasswordSame) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User change password attempt failed: New password cannot be the same as the old password for user ID: ${tokenUserID}`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: "New password cannot be the same as the old password.",
      };
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      passwordData.password
    );
    if (!isMatch) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User change password attempt failed: Incorrect current password for user ID: ${tokenUserID}`
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Incorrect current password.",
      };
    }

    if (!isStrongPassword(newPassword).valid) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User change password attempt failed: Weak new password for user ID: ${tokenUserID}`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: isStrongPassword(newPassword).reason,
      };
    }

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    await Auth.updateOne(
      { userID: tokenUserID },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date().toISOString(),
          updatedBy: tokenUserID,
          __v: passwordData.__v + 1,
        },
      }
    );

    console.log(
      `[INFO] - [${new Date().toISOString()}] - User change password successful for user ID: ${tokenUserID}`
    );
    return {
      status: statusCodes.OK,
      message: "Password changed successfully.",
    };
  } catch (error) {
    console.error(
      `[ERROR] - [${new Date().toISOString()}] - Error during user change password process:`,
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

// Helper function to check password strength
function isStrongPassword(password) {
  const minLength = 8;
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_\-\\[\]\/~`+=;]/.test(password);

  if (password.length < minLength) {
    return {
      valid: false,
      reason: "Password must be at least 8 characters long.",
    };
  }
  if (!hasLowercase) {
    return {
      valid: false,
      reason: "Password must contain at least one lowercase letter.",
    };
  }
  if (!hasUppercase) {
    return {
      valid: false,
      reason: "Password must contain at least one uppercase letter.",
    };
  }
  if (!hasDigit) {
    return {
      valid: false,
      reason: "Password must contain at least one digit.",
    };
  }
  if (!hasSpecialChar) {
    return {
      valid: false,
      reason: "Password must contain at least one special character.",
    };
  }

  return { valid: true, reason: "Password is strong." };
}

module.exports = {
  createAdminUser,
  login,
  logout,
  forgetPassword,
  verifyOtp,
  changePassword,
  userChangePassword,
};
