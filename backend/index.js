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
const authRoute = require("./routes/Auth");
const usersRoute = require("./routes/Users");
const configsRoute = require("./routes/Configs");
const requestRoute = require("./routes/Requests");
const dashboardRoute = require("./routes/Dashboard");

mongoose.connect(process.env.MONGODB_URL);

app.use("/", authRoute);
app.use("/users", usersRoute);
app.use("/configs", configsRoute);
app.use("/requests", requestRoute);
app.use("/dashboard", dashboardRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
