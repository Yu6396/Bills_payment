const Router = require('express').Router();
const { createNewUser, login, verifyUser, startFundAccount, completeFundAccount } = require("../controllers/userController");
const { createUserSchema, loginSchema } = require("../validations/userValidation");
const validationmiddleware = require("../middlewares/validationMiddleware");

Router.post("/register", validationmiddleware(createUserSchema), createNewUser);

Router.post("/login", validationmiddleware(loginSchema), login);

Router.get("/verify-user/:email/:otp", verifyUser);

Router.post("/start-fund-account/:email", startFundAccount);

Router.post("/complete-fund-account/:reference/:id", completeFundAccount);


module.exports = Router
