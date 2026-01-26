const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const conn = mongoose.createConnection(process.env.MONGODB_URL);
const requests = conn.useDb("requests");

const requestUserMapSchema = new mongoose.Schema({
  requestID: String,
  userID: String,
  isActiveRequest: Boolean,
  createdAt: Date,
  createdBy: String,
  updatedAt: Date,
  updatedBy: String,
});

const requestSchema = new mongoose.Schema({
  requestID: String,
  requestType: String,
  reason: String,
  fromDate: String,
  toDate: String,
  fromSession: String,
  toSession: String,
  days: Number,
  createdAt: Date,
  createdBy: String,
  updatedAt: Date,
  updatedBy: String,
});

const statusSchema = new mongoose.Schema({
  requestID: String,
  advisorStatus: String,
  inchargeStatus: String,
  createdAt: Date,
  createdBy: String,
  updatedAt: Date,
  updatedBy: String,
});

const notesSchema = new mongoose.Schema({
  requestID: String,
  advisorNote: String,
  inchargeNote: String,
  createdAt: Date,
  createdBy: String,
  updatedAt: Date,
  updatedBy: String,
});

const proofsSchema = new mongoose.Schema({
  requestID: String,
  proofLink: String,
  createdAt: Date,
  createdBy: String,
  updatedAt: Date,
  updatedBy: String,
});

const RequestUserMap = requests.model("requestUserMap", requestUserMapSchema);
const Request = requests.model("request", requestSchema);
const Status = requests.model("status", statusSchema);
const Notes = requests.model("notes", notesSchema);
const Proofs = requests.model("proofs", proofsSchema);

module.exports = {
  RequestUserMap,
  Request,
  Status,
  Notes,
  Proofs,
};
