const express = require("express");
const router = express();
const {
  createGenericCodeController,
  getAllGenericCodesController,
  getGenericCodeByCodeController,
  getGenericCodeByCodeTypeController,
  updateGenericCodeController,
  deleteGenericCodeController,
} = require("../controllers/GenericCodeController");

const {} = require("../controllers/GenericCodeController");

router.post("/", createGenericCodeController);
router.get("/", getAllGenericCodesController);
router.get("/:code", getGenericCodeByCodeController);
router.get("/type/:codeType", getGenericCodeByCodeTypeController);
router.put("/:code", updateGenericCodeController);
router.delete("/:code", deleteGenericCodeController);

module.exports = router;
