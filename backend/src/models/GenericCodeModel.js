const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const conn = mongoose.createConnection(process.env.MONGODB_URL);
const genericCodes = conn.useDb("genericCode");

const GenericCodeSchema = new mongoose.Schema({
  codeType: String,
  code: String,
  codeDescription: String,
  createdAt: Date,
  createdBy: String,
  updatedAt: Date,
  updatedBy: String,
});

const GenericCode = genericCodes.model("genericCode", GenericCodeSchema);

module.exports = { GenericCode };
