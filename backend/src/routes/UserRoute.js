const express = require("express");
const router = express();
const {
  createUserController,
  getAllUsersController,
  getUserDataIDController,
  updateUserDataController,
  inactivateUserController,
  exportUserDataController,
  getUserSessionDataController,
  inactivateUserSessionController,
  inactivateAllUserSessionController,
} = require("../controllers/UserController");

router.post("/", createUserController);
router.get("/", getAllUsersController);
router.get("/export", exportUserDataController);
router.get("/sessions", getUserSessionDataController);
router.put("/inactivate", inactivateUserController);
router.put("/sessions/inactivate", inactivateUserSessionController);
router.put("/sessions/inactivateAll", inactivateAllUserSessionController);
router.get("/:userID", getUserDataIDController);
router.put("/:userID", updateUserDataController);

module.exports = router;
