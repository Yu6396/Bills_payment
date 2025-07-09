require("dotenv").config();
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

const createUser = async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    phone_number,
    password,
    confirmPassword,
  } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error(messages.USER_ALREADY_EXISTS);
    }
    if (password !== confirmPassword) {
      throw new Error(messages.PASSWORD_NOT_MATCH);
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

const loginUser = async (req, res) => {
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

const resendOtp = async (req, res) => {
  const { email } = req.params;

  try {
    const otpRecord = await Otp.findOne({ where: { email } });

    if (otpRecord && otpRecord.expires_at > new Date()) {
      await sendEmail(email, "Your OTP", { otp: otpRecord.otp }, "otp");

      return res.status(200).json({
        message: "OTP resent successfully",
      });
    }

    const newOtp = generateOtp();
    const newExpiresAt = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes

    await Otp.delete({ where: { email } });
    await Otp.create({
      email,
      otp: newOtp,
      expires_at: newExpiresAt,
    });

    await sendEmail(email, "Your OTP", { otp: newOtp }, "otp");

    return res.status(200).json({
      message: "New OTP generated and sent",
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Something went wrong",
    });
  }
};
const changePassword = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { oldPassword, newPassword } = req.body;

    const checkDBForPassword = await User.findOne({ where: { user_id } });
    const checkIfPasswordIsCorrect = await comparePassword(
      oldPassword,
      checkDBForPassword.password_hash
    );

    if (checkIfPasswordIsCorrect === false) {
      throw new Error(messages.WRONG_PASSWORD);
    }
    if (newPassword === oldPassword) {
      throw new Error(messages.SAME_PASSWORD);
    }

    const { salt, hashedPassword } = await saltAndHashPassword(newPassword);

    await User.update(
      { where: { user_id } },
      {
        $set: {
          password_hash: hashedPassword,
          password_salt: salt,
        },
      }
    );

    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || "Something went wrong",
    });
  }
};
const startForgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const isEmailAvailable = await User.findOne({ where: { email } });
    if (isEmpty(isEmailAvailable)) {
      throw new Error(messages.USER_NOT_FOUND);
    }
    const newOtp = generateOtp();
    const expiredAt = new Date(Date.now() + 10 * 60 * 1000);
    await Otp.create({ email, otp: newOtp, expires_at: expiredAt });
    await sendEmail(email, "Reset password", { otp: newOtp }, "resetPassword");

    res.status(200).json({
      message: "Otp sent successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || "Something went wrong",
    });
  }
};
const completeForgetPassword = async (req, res) => {
  const { email, otp } = req.params;
  const { newPassword, confirmPassword } = req.body;
  try {
    const isEmailAvailable = await Otp.findOne({ where: { email, otp } });

    if (isEmailAvailable.otp !== otp || isEmailAvailable.email !== email) {
      throw new Error(messages.INVALID_OTP);
    }

    if (isEmailAvailable.expires_at <= new Date()) {
      throw new Error(messages.OTP_EXPIRED);
    }
    if (newPassword !== confirmPassword) {
      throw new Error(messages.PASSWORD_NOT_MATCH);
    }
    const { salt, hashedPassword } = await saltAndHashPassword(newPassword);
    await User.update(
      { where: { email } },
      {
        $set: {
          password_hash: hashedPassword,
          password_salt: salt,
        },
      }
    );
    await Otp.delete({ where: { email: email } });
    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || "Something went wrong",
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { first_name, last_name, phone_number, email } = req.body;
    const checkIfUserExists = await User.findOne({ where: { user_id } });
    if (!checkIfUserExists) {
      throw new Error(messages.USER_NOT_FOUND);
    }
    await User.update(
      { where: { user_id } },
      {
        $set: {
          first_name,
          last_name,
          phone_number,
          email,
        },
      }
    );
    res.status(200).json({
      message: "Profile updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
const startFundAccount = async (req, res) => {
  try {
    const { amount } = req.body;
    const { email } = req.params;
    const checkUser = await User.findOne({ where: { email } });
    if (!checkUser.email) {
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
    console.log("error", error);
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
  createUser,
  verifyUser,
  startFundAccount,
  loginUser,
  completeForgetPassword,
  updateUserProfile,
  completeFundAccount,
  resendOtp,
  changePassword,
  startForgetPassword,
};
