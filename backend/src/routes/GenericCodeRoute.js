const express = require("express");
const router = express();
const {
  createGenericCodeController,
} = require("../controllers/GenericCodeController");

const {} = require("../controllers/GenericCodeController");

router.post("/", createGenericCodeController);

module.exports = router;
