const DashboardService = require("../services/DashboardService");

const getAdminDataController = async (req, res) => {
  const result = await DashboardService.getAdminData(req);
  return res.status(result.status).json(result);
};
const getHodDataController = async (req, res) => {
  const result = await DashboardService.getHoDData(req);
  return res.status(result.status).json(result);
};
const getInchargeDataController = async (req, res) => {
  const result = await DashboardService.getInchargeData(req);
  return res.status(result.status).json(result);
};
const getAdvisorDataController = async (req, res) => {
  const result = await DashboardService.getAdvisorData(req);
  return res.status(result.status).json(result);
};
const getStudentDataController = async (req, res) => {
  const result = await DashboardService.getStudentData(req);
  return res.status(result.status).json(result);
};

module.exports = {
  getAdminDataController,
  getHodDataController,
  getInchargeDataController,
  getAdvisorDataController,
  getStudentDataController,
};
