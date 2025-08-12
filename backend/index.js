const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = 3003;
const loginRoute = require("./routes/Login");
const usersRoute = require("./routes/Users");

mongoose.connect(process.env.MONGODB_URL);

app.use("/", loginRoute);
app.use("/users", usersRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
