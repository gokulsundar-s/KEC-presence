const express = require("express");
const router = express();
const {
  createGenericCodeController,
  getAllGenericCodesController,
  getGenericCodeByCodeTypeController,
  updateGenericCodeController,
} = require("../controllers/GenericCodeController");

const {} = require("../controllers/GenericCodeController");

router.post("/", createGenericCodeController);
router.get("/", getAllGenericCodesController);
router.get("/:codeType", getGenericCodeByCodeTypeController);
router.put("/:code", updateGenericCodeController);

module.exports = router;
