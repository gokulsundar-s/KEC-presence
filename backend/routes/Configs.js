const express = require("express");
const { Configs } = require("../schemas/Configs");
const configsRoute = express.Router();

configsRoute.post("/", async (req, res) => {
  try {
    const { codeType, code, description } = req.body;

    if (!codeType) {
      return res.status(400).json({ message: "Code type is required." });
    } else if (!code) {
      return res.status(400).json({ message: "Code is required." });
    } else if (!description) {
      return res.status(400).json({ message: "Description is required." });
    }

    const existingConfig = await Configs.findOne({ code });

    if (existingConfig) {
      return res.status(400).json({
        message: "A config with this code already exists.",
      });
    }

    const newConfig = new Configs({ codeType, code, description });
    await newConfig.save();

    return res.status(200).json({
      message: "Config created successfully.",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = configsRoute;
