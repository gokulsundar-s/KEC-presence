const express = require("express");
const router = express();
const {
  migrateUserYearController,
  inactivateUserSessionsController,
} = require("../controllers/AdminController");

router.put("/migrate-year", migrateUserYearController);
router.put("/inactivate-sessions", inactivateUserSessionsController);

module.exports = router;
