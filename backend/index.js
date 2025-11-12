const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const UsersService = require("./src/services/UserService");
const GenericCodeService = require("./src/services/GenericCodeService");

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(cors());

try {
  mongoose.connect(process.env.MONGODB_URL);
  console.log(
    `[INFO] - ${new Date().toISOString()} - MongoDB connection successful`
  );
} catch (error) {
  console.error(
    `[ERROR] - ${new Date().toISOString()} - Error connecting to MongoDB: ${error}`
  );
}

UsersService.createAdminUser();
GenericCodeService.createInitialGenericCodes();

const authRoute = require("./src/routes/AuthRoute");
const usersRoute = require("./src/routes/UserRoute");
const requestRoute = require("./src/routes/RequestRoute");
const genericCodeRoute = require("./src/routes/GenericCodeRoute");
const adminRoute = require("./src/routes/AdminRoute");
const dashboardRoute = require("./src/routes/DashboardRoute");

app.use("/", authRoute);
app.use("/users", usersRoute);
app.use("/requests", requestRoute);
app.use("/generic-codes", genericCodeRoute);
app.use("/admin", adminRoute);
app.use("/dashboard", dashboardRoute);

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
