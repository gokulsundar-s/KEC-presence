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
  mail: String,
});

const userDepartmentDetailsSchema = new mongoose.Schema({
  userID: String,
  name: String,
  rollNumber: String,
  year: Number,
  section: String,
  department: String,
});

const userContactsSchema = new mongoose.Schema({
  userID: String,
  phone: String,
  pphone: String,
  pmail: String,
});

const Auth = users.model("auth", authSchema);
const UserDetails = users.model("userdetails", userDetailsSchema);
const UserDepartmentDetails = users.model(
  "userdepartmentdetails",
  userDepartmentDetailsSchema
);
const UserContacts = users.model("usercontacts", userContactsSchema);

module.exports = {
  Auth,
  UserDetails,
  UserDepartmentDetails,
  UserContacts,
};
