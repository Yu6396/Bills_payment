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
const { saltAndHashPassword } = require("../utils");
const messages = require("../messages/index");


const createNewUser = async (req, res) => {
  const { first_name, last_name, email, phone_number, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error(messages.USER_ALREADY_EXISTS);
    }

    const { salt, hashedPassword } = await saltAndHashPassword(password);
    user_id = uuidv4();
    await User.create({
      user_id: user_id,
      first_name,
      last_name,
      email,
      phone_number,
      password_salt: salt,
      password_hash: hashedPassword,
    });

    await Wallet.create({
      wallet_id: uuidv4(),
      user_id: user_id,
      balance: 0,
    });

    const otpCode = generateOtp();
    const expiresAt = new Date(Date.now() + 1 * 60 * 1000);
    await Otp.create({
      email,
      otp: otpCode,
      expires_at: expiresAt,
    });
    await sendEmail(email, "Verify your otp", { otp: otpCode }, "otp");

    return res.status(200).json({
      message: "Verify Otp sent to your email",
    });
  } catch (error) {
    console.error("Error creating user: ", error.message || error);
    return res.status(400).json({
      message: "Failed to create user",
      error: error.message || "Unknown error",
    });
  }
};

const verifyUser = async (req, res) => {
  const { email, otp } = req.params;
  try {
    const existingUser = await Otp.findOne({ where: { email, otp } });

    if (!existingUser) {
      throw new Error(messages.INVALID_OTP);
    }

    if (new Date() > existingUser.expired_at) {
      throw new Error(messages.OTP_EXPIRED);
    }

    await Otp.destroy({ where: { email } });
    await User.update({ email_verified: true }, { where: { email } });
    const Userinfo = await User.findOne({ where: { email } });
    await sendEmail(
      email,
      "WELCOME HOME",
      { name: `${Userinfo.first_name} ${Userinfo.last_name}` },
      "welcome"
    );
    res.status(201).json({
      message: "Otp verified, account created successfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message || "Internal server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const checkIfUserExists = await User.findOne({ where: { email } });
    if (!checkIfUserExists) {
      throw new Error(messages.USER_NOT_FOUND);
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      checkIfUserExists.password_hash
    );
    if (!isPasswordValid) {
      throw new Error(messages.INVALID_PASSWORD);
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
      throw new Error("Email is required");
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
    
    if (reference === checkIfreferenceExists?.dataValues?.payment_reference) {
      throw new Error("Payment reference already used");
    }
    const verifyPaymentTransaction = await verifyPayment(reference);

    if (verifyPaymentTransaction.data.status === false) {
      throw new Error("Transaction failed");
    }
    const checkWallet = await Wallet.findOne({ where: { user_id: id } });

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
      wallet_id: checkWallet.id,
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
