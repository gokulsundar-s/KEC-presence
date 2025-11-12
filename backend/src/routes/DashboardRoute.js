const express = require("express");
const router = express();
const DashboardController = require("../controllers/DashboardController");

router.get("/admin", DashboardController.getAdminDataController);
router.get("/hod", DashboardController.getHodDataController);
router.get("/incharge", DashboardController.getInchargeDataController);
router.get("/advisor", DashboardController.getAdvisorDataController);
router.get("/student", DashboardController.getStudentDataController);

module.exports = router;
