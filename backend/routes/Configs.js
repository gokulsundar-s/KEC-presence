const express = require("express");
const { Configs } = require("../schemas/Configs");
const { config } = require("dotenv");
const configsRoute = express.Router();

configsRoute.post("/", async (req, res) => {
  try {
    const { codeType, code, description } = req.body;

    if (!codeType) {
      return res.json({ status: 400, message: "Code type is required." });
    } else if (!code) {
      return res.json({ status: 400, message: "Code is required." });
    } else if (!description) {
      return res.json({ status: 400, message: "Description is required." });
    }

    const existingConfig = await Configs.findOne({ code });

    if (existingConfig) {
      return res.json({
        status: 400,
        message: "A config with this code already exists.",
      });
    }

    const configs = await Configs.find();
    const configID = "CON" + (configs.length + 1).toString().padStart(5, "0");

    const newConfig = new Configs({ configID, codeType, code, description });
    await newConfig.save();

    return res.json({
      status: 200,
      message: "Config created successfully.",
    });
  } catch (error) {
    return res.json({ status: 500, message: "Server error" });
  }
});

configsRoute.get("/", async (req, res) => {
  try {
    const configs = await Configs.find();
    const configData = configs.map((config) => ({
      configID: config.configID,
      codeType: config.codeType,
      code: config.code,
      description: config.description,
    }));

    return res.json({
      status: 200,
      message: "Configs retrieved successfully.",
      data: configData,
    });
  } catch (error) {
    return res.json({ status: 500, message: "Server error" });
  }
});

configsRoute.put("/:configID", async (req, res) => {
  try {
    const { configID } = req.params;

    const { codeType, code, description } = req.body;
    if (!codeType) {
      return res.json({ status: 400, message: "Code type is required." });
    } else if (!code) {
      return res.json({ status: 400, message: "Code is required." });
    } else if (!description) {
      return res.json({ status: 400, message: "Description is required." });
    }

    const existingConfig = await Configs.findOne({
      code,
      configID: { $ne: configID },
    });

    if (existingConfig) {
      return res.json({
        status: 400,
        message: "A config with this code already exists.",
      });
    }

    await Configs.updateOne({ configID }, { codeType, code, description });

    return res.json({
      status: 200,
      message: "Config updated successfully.",
    });
  } catch (error) {
    return res.json({ status: 500, message: "Server error" });
  }
});

configsRoute.delete("/:configID", async (req, res) => {
  try {
    const { configID } = req.params;
    const config = await Configs.findOne({ configID });

    if (!config) {
      return res.json({ status: 404, message: "Config not found." });
    }

    await Configs.deleteOne({ configID });

    return res.json({
      status: 200,
      message: "Config deleted successfully.",
    });
  } catch (error) {
    return res.json({ status: 500, message: "Server error" });
  }
});

module.exports = configsRoute;
