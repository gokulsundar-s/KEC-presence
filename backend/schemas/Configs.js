const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const conn = mongoose.createConnection(process.env.MONGODB_URL);
const configs = conn.useDb("configs");

const configsSchema = mongoose.Schema({
  requestID: String,
  userID: String,
});

const Configs = configs.model("configs", configsSchema);

module.exports = { Configs };
