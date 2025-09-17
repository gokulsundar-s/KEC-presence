const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const conn = mongoose.createConnection(process.env.MONGODB_URL);
const users = conn.useDb("users");

const authSchema = new mongoose.Schema(
  {
    userID: String,
    password: String,
  },
  { collection: "auth" }
);

const userDetailsSchema = new mongoose.Schema({
  userID: String,
  userType: String,
  name: String,
  mail: String,
});

const userDepartmentDetailsSchema = new mongoose.Schema({
  userID: String,
  rollNumber: String,
  year: Number,
  section: String,
  department: String,
});

const userContactsSchema = new mongoose.Schema({
  userID: String,
  phoneNumber: String,
  parentPhone: String,
  parentMail: String,
});

const userSessionsSchema = new mongoose.Schema({
  sessionID: String,
  userID: String,
  device: String,
  browser: String,
  ipAddress: String,
  loginTime: String,
  logoutTime: String,
  isActive: Boolean,
});

const Auth = users.model("auth", authSchema);
const UserDetails = users.model("userdetails", userDetailsSchema);
const UserDepartmentDetails = users.model(
  "userdepartmentdetails",
  userDepartmentDetailsSchema
);
const UserContacts = users.model("usercontacts", userContactsSchema);
const UserSessions = users.model("usersessions", userSessionsSchema);

module.exports = {
  Auth,
  UserDetails,
  UserDepartmentDetails,
  UserContacts,
  UserSessions,
};
