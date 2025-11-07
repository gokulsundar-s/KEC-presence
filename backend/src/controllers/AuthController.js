const AuthServices = require("../services/AuthService");

const loginController = async (req, res) => {
  const result = await AuthServices.login(req);
  return res.status(result.status).json(result);
};

const logoutController = async (req, res) => {
  const result = await AuthServices.logout(req);
  return res.status(result.status).json(result);
};

const forgetPasswordController = async (req, res) => {
  const result = await AuthServices.forgetPassword(req);
  return res.status(result.status).json(result);
};

const verifyOtpController = async (req, res) => {
  const result = await AuthServices.verifyOtp(req);
  return res.status(result.status).json(result);
};

const changePasswordController = async (req, res) => {
  const result = await AuthServices.changePassword(req);
  return res.status(result.status).json(result);
};

const userChangePasswordController = async (req, res) => {
  const result = await AuthServices.userChangePassword(req);
  return res.status(result.status).json(result);
};

module.exports = {
  loginController,
  logoutController,
  forgetPasswordController,
  verifyOtpController,
  changePasswordController,
  userChangePasswordController,
};
