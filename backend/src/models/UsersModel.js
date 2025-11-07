const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const conn = mongoose.createConnection(process.env.MONGODB_URL);
const users = conn.useDb("users");

const authSchema = new mongoose.Schema(
  {
    userID: String,
    password: String,
    isActive: Boolean,
    createdAt: Date,
    updatedAt: Date,
  },
  { collection: "auth" }
);

const userDetailsSchema = new mongoose.Schema({
  userID: String,
  userType: String,
  name: String,
  mail: String,
  createdAt: Date,
  updatedAt: Date,
});

const userDepartmentDetailsSchema = new mongoose.Schema({
  userID: String,
  rollNumber: String,
  year: Number,
  section: String,
  department: String,
  createdAt: Date,
  updatedAt: Date,
});

const userContactsSchema = new mongoose.Schema({
  userID: String,
  phoneNumber: String,
  parentPhone: String,
  parentMail: String,
  createdAt: Date,
  updatedAt: Date,
});

const userSessionsSchema = new mongoose.Schema({
  userID: String,
  device: String,
  browser: String,
  ipAddress: String,
  loginTime: String,
  logoutTime: String,
  token: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date,
});

const passwordOtpSchema = new mongoose.Schema({
  userID: String,
  otp: String,
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date,
});

const Auth = users.model("auth", authSchema);
const UserDetails = users.model("userdetails", userDetailsSchema);
const UserDepartmentDetails = users.model(
  "userdepartmentdetails",
  userDepartmentDetailsSchema
);
const UserContacts = users.model("usercontacts", userContactsSchema);
const UserSessions = users.model("usersessions", userSessionsSchema);
const PasswordOtp = users.model("passwordotp", passwordOtpSchema);

module.exports = {
  Auth,
  UserDetails,
  UserDepartmentDetails,
  UserContacts,
  UserSessions,
  PasswordOtp,
};
