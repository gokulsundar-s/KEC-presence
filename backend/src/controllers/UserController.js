const UserService = require("../services/UserService");

const createUserController = async (req, res) => {
  const result = await UserService.createUser(req);
  return res.status(result.status).json(result);
};

const createBulkUsersController = async (req, res) => {
  const result = await UserService.createBulkUsers(req);
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

module.exports = {
  createUserController,
  createBulkUsersController,
  getAllUsersController,
  getUserDataIDController,
  updateUserDataController,
  inactivateUserController,
};
