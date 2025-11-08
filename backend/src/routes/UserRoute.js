const express = require("express");
const router = express();
const {
  createUserController,
  createBulkUsersController,
  getAllUsersController,
  getUserDataIDController,
  updateUserDataController,
  inactivateUserController,
} = require("../controllers/UserController");

router.post("/", createUserController);
router.post("/bulk-users", createBulkUsersController);
router.get("/", getAllUsersController);
router.get("/:userID", getUserDataIDController);
router.put("/:userID", updateUserDataController);
router.put("/:userID/inactivate", inactivateUserController);

module.exports = router;
