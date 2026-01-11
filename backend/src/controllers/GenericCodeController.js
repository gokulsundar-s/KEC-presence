const GenericCodeService = require("../services/GenericCodeService");

const createGenericCodeController = async (req, res) => {
  const result = await GenericCodeService.createGenericCode(req);
  res.status(201).json(result);
};

const getAllGenericCodesController = async (req, res) => {
  const result = await GenericCodeService.getAllGenericCodes(req);
  res.status(200).json(result);
};

const getGenericCodeByCodeTypeController = async (req, res) => {
  const result = await GenericCodeService.getGenericCodeByCodeType(req);
  res.status(200).json(result);
};

const getGenericCodeByCodeController = async (req, res) => {
  const result = await GenericCodeService.getGenericCodeByCode(req);
  res.status(200).json(result);
};

const updateGenericCodeController = async (req, res) => {
  const result = await GenericCodeService.updateGenericCode(req);
  res.status(200).json(result);
};

const deleteGenericCodeController = async (req, res) => {
  const result = await GenericCodeService.deleteGenericCode(req);
  res.status(200).json(result);
};

module.exports = {
  createGenericCodeController,
  getAllGenericCodesController,
  getGenericCodeByCodeController,
  getGenericCodeByCodeTypeController,
  updateGenericCodeController,
  deleteGenericCodeController,
};
