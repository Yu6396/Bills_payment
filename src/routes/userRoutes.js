
const express = require("express");
const router = express.Router();
const {
    createUser,
  verifyUser,
  loginUser,
  completeForgetPassword,
  updateUserProfile,
  completeFundAccount,
  resendOtp,
  changePassword,
  startForgetPassword,
  startFundAccount,
  getUserWallet,
  getUserProfile,
  getUserTransactions,
  refreshTokens,
  logoutUser
} = require("../controllers/userController");
const validationmiddleware = require("../middlewares/validationMiddleware");
const { createUserSchema , changePasswordSchema,verifyEmailSchema, completeForgetPasswordSchema} = require("../validations/userValidation");
const { UserAuthorization } = require("../middlewares/authorization");

router.post("/create/user", validationmiddleware(createUserSchema), createUser);
router.post("/verify/otp", verifyUser);
router.post("/start/fund/account", UserAuthorization, startFundAccount);
router.post("/login/user", loginUser);
router.post("/refresh-token", refreshTokens);
router.post("/logout", UserAuthorization, logoutUser);
router.get("/complete-fund-account/:reference", UserAuthorization, completeFundAccount);
router.post("/complete/forget/password", completeForgetPassword);
router.patch("/update/profile", UserAuthorization, updateUserProfile);
router.post("/resend-otp", resendOtp);
router.post("/start-forget-password",validationmiddleware(verifyEmailSchema), startForgetPassword);
router.post("/change-password", UserAuthorization, validationmiddleware(changePasswordSchema), changePassword);
router.get("/get-user-wallet", UserAuthorization, getUserWallet);
router.get("/get-user-profile", UserAuthorization, getUserProfile);
router.get("/get-user-transactions", UserAuthorization, getUserTransactions);

module.exports = router;