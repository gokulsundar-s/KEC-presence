const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const conn = mongoose.createConnection(process.env.MONGODB_URL);
const requests = conn.useDb("requests");

const requestSchema = mongoose.Schema({
  userID: String,
  requestID: String,
  reqType: String,
  reason: String,
  fromDate: String,
  toDate: String,
  session: String,
});

const statusSchema = mongoose.Schema({
  requestID: String,
  advisorStatus: String,
  inchargeStatus: String,
  updatedAt: String,
});

const notesSchema = mongoose.Schema({
  requestID: String,
  advisorNote: String,
  inchargeNote: String,
});

const proofsSchema = mongoose.Schema({
  requestID: String,
  proofLink: String,
});

const Request = requests.model("request", requestSchema);
const Status = requests.model("status", statusSchema);
const Notes = requests.model("notes", notesSchema);
const Proofs = requests.model("proofs", proofsSchema);

module.exports = {
  Request,
  Status,
  Notes,
  Proofs,
};
