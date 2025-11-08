const express = require("express");
const router = express();
const {
  createRequestController,
  getAllRequestsController,
  getRequestByIDController,
  updateRequestController,
} = require("../controllers/RequestController");

router.post("/", createRequestController);
router.get("/", getAllRequestsController);
router.get("/:requestID", getRequestByIDController);
router.put("/:requestID", updateRequestController);

module.exports = router;
