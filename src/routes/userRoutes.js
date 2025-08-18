
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
  startFundAccount
} = require("../controllers/userController");
const validationmiddleware = require("../middlewares/validationMiddleware");
const { createUserSchema , changePasswordSchema,verifyEmailSchema, completeForgetPasswordSchema} = require("../validations/userValidation");
const { UserAuthorization } = require("../middlewares/authorization");

router.post("/create/user", validationmiddleware(createUserSchema), createUser);
router.get("/verify/user/:email/:otp", verifyUser);
router.post("/start/fund/account", UserAuthorization, startFundAccount);
router.post("/login/user", loginUser);
router.post("/complete-fund-account", UserAuthorization, completeFundAccount);
router.post("/complete/forget/password",validationmiddleware(completeForgetPasswordSchema), completeForgetPassword);
router.patch("/update/profile", UserAuthorization, updateUserProfile);
router.get("/resend-otp", resendOtp);
router.post("/start-forget-password",validationmiddleware(verifyEmailSchema), startForgetPassword);
router.post("/change-password", UserAuthorization, validationmiddleware(changePasswordSchema), changePassword);

module.exports = router;