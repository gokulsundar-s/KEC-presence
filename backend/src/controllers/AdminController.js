const AdminService = require("../services/AdminService");

const migrateUserYearController = async (req, res) => {
  const result = await AdminService.migrateUserYears(req);
  return res.status(result.status).json(result);
};

const inactivateUserSessionsController = async (req, res) => {
  const result = await AdminService.inactivateUserSessions(req);
  return res.status(result.status).json(result);
};

module.exports = {
  migrateUserYearController,
  inactivateUserSessionsController,
};
