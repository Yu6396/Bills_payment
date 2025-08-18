
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
  getUserTransactions
} = require("../controllers/userController");
const validationmiddleware = require("../middlewares/validationMiddleware");
const { createUserSchema , changePasswordSchema,verifyEmailSchema, completeForgetPasswordSchema} = require("../validations/userValidation");
const { UserAuthorization } = require("../middlewares/authorization");

router.post("/create/user", validationmiddleware(createUserSchema), createUser);
router.get("/verify/user/:email/:otp", verifyUser);
router.post("/start/fund/account", UserAuthorization, startFundAccount);
router.post("/login/user", loginUser);
router.get("/complete-fund-account/:reference", UserAuthorization, completeFundAccount);
router.post("/complete/forget/password",validationmiddleware(completeForgetPasswordSchema), completeForgetPassword);
router.patch("/update/profile", UserAuthorization, updateUserProfile);
router.get("/resend-otp/:email", resendOtp);
router.post("/start-forget-password",validationmiddleware(verifyEmailSchema), startForgetPassword);
router.post("/change-password", UserAuthorization, validationmiddleware(changePasswordSchema), changePassword);
router.get("/get-user-wallet", UserAuthorization, getUserWallet);
router.get("/get-user-profile", UserAuthorization, getUserProfile);
router.get("/get-user-transactions", UserAuthorization, getUserTransactions);

module.exports = router;