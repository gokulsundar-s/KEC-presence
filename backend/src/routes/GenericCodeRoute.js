const express = require("express");
const router = express();
const {
  createGenericCodeController,
  getAllGenericCodesController,
  getGenericCodeByCodeController,
  updateGenericCodeController,
} = require("../controllers/GenericCodeController");

const {} = require("../controllers/GenericCodeController");

router.post("/", createGenericCodeController);
router.get("/", getAllGenericCodesController);
router.get("/:code", getGenericCodeByCodeController);
router.put("/:code", updateGenericCodeController);

module.exports = router;
