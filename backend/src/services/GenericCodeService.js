const { GenericCode } = require("../models/GenericCodeModel");
const { verifyToken, getTokenData } = require("./TokenVerficationService");
const statusCodes = require("../utils/statusCodes");

const createGenericCodeService = async (res) => {
  try {
  } catch (error) {
    console.error(
      `[ERROR] - [${new Date().toISOString()}] - Error creating generic code:`,
      error
    );
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
      message:
        "Internal server error. Please report this issue to the administrator.",
    };
  }
};

module.exports = {
  createGenericCodeService,
};
