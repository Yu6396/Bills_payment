const axios = require("axios");
const { Transaction, Wallet } = require("../../models");
const {
  purchaseUtilityBiller,
  getAllBillersCategory,
  getAllAirtimeOperator,
  getAllCountries,
  purchaseAirtime,
  getAllCountriesOperators,
} = require("../services/reloadlyServices");
const { v4: uuidv4 } = require("uuid");
const { TRANSACTION_STATUS } = require("../../constants/data");
const PurchaseUtilityBills = async (req, res) => {
  const { billerID, id } = req.params;
  const { amount, subscriberAccountNumber } = req.body;
  try {
    const checkWalletBalance = await Wallet.findOne({
      where: { user_id: id },
    });
    if (!checkWalletBalance) {
      throw new Error("Wallet not found");
    }
    if (checkWalletBalance.balance < amount) {
      throw new Error("Insufficient wallet balance");
    }
    const BuyUtilityResponse = await purchaseUtilityBiller(
      billerID,
      amount,
      subscriberAccountNumber
    );

    console.log("object", BuyUtilityResponse);
    // deduct the amount from the user's wallet balance
    const newBalance = checkWalletBalance.balance - amount;

    // update the user's wallet balance
    await Wallet.update({ balance: newBalance }, { where: { user_id: id } });

    // create a transaction record
    const transaction = await Transaction.create({
      transaction_id: uuidv4(),
      user_id: id,
      amount: amount,
      transaction_type: "Utility Bill Payment", //
      status: TRANSACTION_STATUS.COMPLETED || "Success",
      payment_reference: uuidv4(),
    });

    res.status(200).send({
      status: true,
      message: "Transaction is completed",
      data: BuyUtilityResponse,
    });
  } catch (error) {
    console.log("purchaseError", error.message);
    res.status(500).send({
      message: "Transaction failed",
      data: error.message,
    });
  }
};

const GetAllUtilityBillers = async (req, res) => {
  try {
    const billerCategory = await getAllBillersCategory();
    res.status(200).send({
      status: true,
      message: "All billers retrieved successfully",
      data: billerCategory,
    });
  } catch (error) {
    console.log("getbillerError", error.message);
    res.status(500).send({
      message: "Failed to get all billers",
      data: error.message,
    });
  }
};

const GetAllAirtimeOperators = async (req, res) => {
    try {
      const operatorCategory = await getAllAirtimeOperator();

      res.status(200).send({
        status: true,
        message: "All operators retrieved successfully",
        data: operatorCategory,
      });
    } catch (error) {
      console.log("getOperatorError", error.message);
      res.status(500).send({
        message: "Failed to get all operators",
        data: error.message,
      });
    }
};

const GetAllCountriesOperators = async (req, res) => {
    const { countrycode } = req.params;
    try {
      const countries = await getAllCountriesOperators(countrycode);
        
      res.status(200).send({
        status: true,
        message: "All countries retrieved successfully",
        data: countries,
      });
    } catch (error) {
      console.log("countriesError", error.message);
      res.status(500).send({
        message: "Failed to get all countries",
        data: error.message,
      });
    }
};

const PurchaseAirtime = async (req, res) => {
    const { id } = req.params;
    const { operatorId, amount, phone } = req.body;
  
    try {
      const checkWalletBalance = await Wallet.findOne({
        where: { user_id: id },
      });
  
      if (!checkWalletBalance) {
        throw new Error("Wallet not found");
      }
  
      if (checkWalletBalance.balance < amount) {
        throw new Error("Insufficient wallet balance");
      }
  
      // Purchase airtime
      const BuyAirtimeResponse = await purchaseAirtime(operatorId, amount, phone);
  
      // Deduct wallet balance
      const newBalance = checkWalletBalance.balance - amount;
      await Wallet.update({ balance: newBalance }, { where: { user_id: id } });
  
      // Record transaction
      const transaction = await Transaction.create({
        transaction_id: uuidv4(),
        user_id: id,
        amount: amount,
        transaction_type: "Airtime",
        status: TRANSACTION_STATUS.COMPLETED || "Success",
        payment_reference: uuidv4(),
      });
  
      res.status(200).send({
        status: true,
        message: "Transaction is completed",
        data: BuyAirtimeResponse,
      });
    } catch (error) {
      console.log("purchaseError", error.message);
      res.status(500).send({
        status: false,
        message: "Transaction failed",
        error: error.message,
      });
    }
  };

module.exports = {
  PurchaseUtilityBills,
  GetAllUtilityBillers,
  GetAllAirtimeOperators,
  GetAllCountriesOperators,
  PurchaseAirtime
};
