const AdminServices = require("../services/AdminServices");

const migrateUserYearController = async (req, res) => {
  const result = await AdminServices.migrateUserYears(req);
  return res.status(result.status).json(result);
};

const inactivateUserSessionsController = async (req, res) => {
  const result = await AdminServices.inactivateUserSessions(req);
  return res.status(result.status).json(result);
};

module.exports = {
  migrateUserYearController,
  inactivateUserSessionsController,
};
