const express = require("express");
const router = express();
const {
  loginController,
  logoutController,
  forgetPasswordController,
  verifyOtpController,
  changePasswordController,
  userChangePasswordController,
} = require("../controllers/AuthController");

router.post("/login", loginController);
router.put("/logout", logoutController);
router.put("/forget-password", forgetPasswordController);
router.put("/verify-otp", verifyOtpController);
router.put("/change-password", changePasswordController);
router.put("/user-change-password", userChangePasswordController);

module.exports = router;
