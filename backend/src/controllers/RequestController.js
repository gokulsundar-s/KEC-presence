const RequestService = require("../services/RequestService");

const createRequestController = async (req, res) => {
  const result = await RequestService.createRequest(req);
  return res.status(result.status).json(result);
};

const getAllRequestsController = async (req, res) => {
  const result = await RequestService.getAllRequests(req);
  return res.status(result.status).json(result);
};

const getRequestByIDController = async (req, res) => {
  const result = await RequestService.getRequestByID(req);
  return res.status(result.status).json(result);
};

const updateRequestController = async (req, res) => {
  const result = await RequestService.updateRequest(req);
  return res.status(result.status).json(result);
};

module.exports = {
  createRequestController,
  getAllRequestsController,
  getRequestByIDController,
  updateRequestController,
};
