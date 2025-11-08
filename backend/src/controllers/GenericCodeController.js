const GenericCodeService = require("../services/GenericCodeService");

const createGenericCodeController = async (req, res) => {
  const result = await GenericCodeService.createGenericCodeService(req.body);
  res.status(201).json(result);
};

module.exports = {
  createGenericCodeController,
};
