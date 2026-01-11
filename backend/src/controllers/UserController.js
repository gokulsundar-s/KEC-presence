const UserService = require("../services/UserService");

const createUserController = async (req, res) => {
  const result = await UserService.createUser(req);
  return res.status(result.status).json(result);
};

const getAllUsersController = async (req, res) => {
  const result = await UserService.getAllUsers(req);
  return res.status(result.status).json(result);
};

const getUserDataIDController = async (req, res) => {
  const result = await UserService.getUserDataByID(req);
  return res.status(result.status).json(result);
};

const updateUserDataController = async (req, res) => {
  const result = await UserService.updateUserData(req);
  return res.status(result.status).json(result);
};

const inactivateUserController = async (req, res) => {
  const result = await UserService.inactivateUser(req);
  return res.status(result.status).json(result);
};

const exportUserDataController = async (req, res) => {
  const result = await UserService.exportUserData(req);
  return res.status(result.status).json(result);
};

const getUserSessionDataController = async (req, res) => {
  const result = await UserService.getUserSessionData(req);
  return res.status(result.status).json(result);
};

const inactivateUserSessionController = async (req, res) => {
  const result = await UserService.inactivateUserSession(req);
  return res.status(result.status).json(result);
};

const inactivateAllUserSessionController = async (req, res) => {
  const result = await UserService.inActiveAllUserSessions(req);
  return res.status(result.status).json(result);
};

module.exports = {
  createUserController,
  getAllUsersController,
  getUserDataIDController,
  updateUserDataController,
  inactivateUserController,
  exportUserDataController,
  getUserSessionDataController,
  inactivateUserSessionController,
  inactivateAllUserSessionController,
};
