const { generateOtp } = require("../utils");
const { User, Otp, Wallet, Transaction } = require("../../models");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const sendEmail = require("../services/emailService");
const jwt = require("jsonwebtoken");
const {
  intializePayment,
  verifyPayment,
} = require("../services/paystackService");
const { TRANSACTION_STATUS } = require("../../constants/data");

const createNewUser = async (req, res) => {
  const { first_name, last_name, email, phone, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error({ message: "User already exists" });
    }
    

    const{
      salt,
      hashedPassword
    } = await saltAndHashPassword(password);
    user_id = uuidv4();
   

    await Wallet.create({
      wallet_id: uuidv4(),
      user_id: user_id,
      balance: 0,
    });

    await User.create({
      user_id: user_id,
      first_name,
      last_name,
      email,
      phone,
      password_salt: salt,
      password_hash: hashedPassword,
    });

    const otpCode = generateOtp();
    const expiredAt = new Date(Date.now() + 1 * 60 * 1000); // 1 minutes from now
    await Otp.create({
      email,
      otp: otpCode,
      expired_at: expiredAt,
    });
    await sendEmail(email, "Verify your otp", { otp: otpCode }, "otp");

    return res.status(200).json({
      message: "Verify Otp sent to your email",
    });
  } catch (error) {
    console.error("Error creating user: ", error.message);
    return res.status(400).json(error.message || "Internal server error");
  }
};

const verifyUser = async (req, res) => {
  const { email, otp } = req.params;
  try {
    const existingUser = await Otp.findOne({ where: { email, otp } });
    console.log("findMail1: ", existingUser);

    if (!existingUser) {
      throw new Error("Invalid Otp");
    }
    console.log("hey1: ");
    if (new Date() > existingUser.expired_at) {
      throw new Error("Otp expired");
    }
    console.log("hey2: ");

    // await Otp.destroy({ where: { email } });
    res.status(201).json({
      message: "Otp verified, account created successfully",
    });
  } catch (error) {
    console.error("Error creating user: ", error.message);
    res.status(400).json({ message: error.message || "Internal server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const checkIfUserExists = await User.findOne({ where: { email } });
    if (!checkIfUserExists) {
      throw new Error({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      checkIfUserExists.passwordHash
    );
    if (!isPasswordValid) {
      throw new Error({ message: "Invalid email or password" });
    }
    const payload = { email: checkIfUserExists.email, id: uuidv4() };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXP },
      function (err, token) {
        if (err) {
          return res.status(400).json({
            message: err.message || "Something went wrong",
          });
        }
        res.setHeader("authorization", token);
        res.status(200).json({
          message: "User logged in successfully",
        });
      }
    );
  } catch (error) {
    console.error("Error creating user: ", error);
    res.status(400).json({ message: error.message || "Bad Request" });
  }
};

const startFundAccount = async (req, res) => {
  const { amount } = req.body;
  const { email } = req.params;

  try {
    await User.findOne({ where: { email } });
    if (!email) {
      throw new Error("User not found");
    }
    const transaction = await intializePayment(email, amount);
    if (transaction.status === false) {
      throw new Error("payment cannot be initialized this moment");
    }
    res.status(200).json({
      message: "Transaction initialized successfully",
      data: transaction.data.data,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || "Something went wrong",
    });
  }
};

const completeFundAccount = async (req, res) => {
  const { reference, id } = req.params;
  try {
    const checkIfreferenceExists = await Transaction.findOne({
      where: { payment_reference: reference },
    });
    console.log("ref", checkIfreferenceExists);

    if (reference === checkIfreferenceExists?.dataValues?.payment_reference) {
      throw new Error("Payment reference already used");
    }
    const verifyPaymentTransaction = await verifyPayment(reference);
    console.log("object2", verifyPaymentTransaction);

    if (verifyPaymentTransaction.data.status === false) {
      throw new Error("Transaction failed");
    }
    const checkWallet = await Wallet.findOne({ where: { user_id: id } });
    console.log("object1", checkWallet);

    await Wallet.update(
      {
        balance:
          parseInt(checkWallet?.dataValues?.balance) +
          parseInt(verifyPaymentTransaction?.data?.data?.amount),
      },
      { where: { user_id: id } }
    );

    await Transaction.create({
      transaction_id: uuidv4(),
      user_id: id,
      amount: verifyPaymentTransaction.data.data.amount,
      status: TRANSACTION_STATUS.SUCCESS,
      payment_reference: verifyPaymentTransaction?.data?.data?.reference,
    });

    res.status(200).json({
      message: "Transaction verified successfully",
      data: verifyPaymentTransaction.data.data,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || "Something went wrong",
    });
  }
};

module.exports = {
  createNewUser,
  verifyUser,
  startFundAccount,
  login,
  completeFundAccount,
};
