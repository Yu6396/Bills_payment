const {
  BillTransaction,
  BillProvider,
  Wallet,
  BillCategory,
  Transaction,
} = require("../../models");
const vtpass = require("../services/vtPassServices");
const { sequelize } = require("../../models");
const { v4: uuidv4 } = require("uuid");
const { generateRequestId, verifyPin } = require("../utils");
const { getFriendlyMessage } = require("../utils/vtpassErrorMap");

async function debitWallet(user_id, amount, payment_reference = null) {
  try {
    const wallet = await Wallet.findOne({
      where: { user_id },
    });

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    if (Number(wallet.balance) < Number(amount)) {
      throw new Error("Insufficient balance");
    }

    wallet.balance = Number(wallet.balance) - Number(amount);

    await wallet.save();

    await Transaction.create({
      user_id,
      wallet_id: wallet.wallet_id,
      amount: Number(amount),
      type: "debit",
      status: "successful",
      payment_reference,
    });

    return wallet;
  } catch (error) {
    throw new Error(error.message || "Failed to debit wallet");
  }
}
const payAirtime = async (req, res) => {
  try {
    const { provider_id, phone, amount, pin } = req.body;
    const { user_id } = req.user;

    // const checkPin = await verifyPin(req.user, pin);

    // if (!checkPin.valid) {
    //   return res.status(400).json({
    //     message: checkPin.message,
    //   });
    // }

    const provider = await BillProvider.findByPk(provider_id);

    if (!provider) {
      return res.status(404).json({
        message: "Provider not found",
      });
    }

    // Generate reference BEFORE wallet debit
    const requestId = generateRequestId();

    // Create bill transaction as pending
    const transaction = await BillTransaction.create({
      user_id,
      category_id: provider.category_id,
      provider_id,
      amount,
      total_amount: amount,
      service_charge: 0,
      transaction_ref: requestId,
      status: "pending",
      payment_method: "wallet",
      customer_info: phone,
    });

    // Debit wallet + create wallet transaction
    await debitWallet(user_id, amount, requestId);

    const result = await vtpass.buyAirtime({
      requestId,
      phone,
      amount,
      network: provider.code,
    });

    const successful = result.success && result?.data?.code === "000";

    await transaction.update({
      vtpass_reference: result?.data?.requestId || requestId,

      status: successful ? "success" : "failed",
    });

    

    return res.json({
      message: getFriendlyMessage(
        result?.data?.code,
        result?.data?.response_description,
      ),
      transaction,
      vtpass: result,
    });
  } catch (err) {
    console.error("Pay Airtime Error:", err.message);

    return res.status(400).json({
      message: err.message,
    });
  }
};

const payData = async (req, res) => {
  try {
    const { provider_id, phone, variation_code, amount, pin } = req.body;
    const { user_id } = req.user;

    // const checkPin = await verifyPin(req.user, pin);
    // if (!checkPin.valid) {
    //   return res.status(400).json({ message: checkPin.message });
    // }

    const provider = await BillProvider.findByPk(provider_id);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    

    const requestId = generateRequestId();

    const transaction = await BillTransaction.create({
      user_id,
      category_id: provider.category_id,
      provider_id,
      amount,
      service_charge: 0,
      total_amount: amount,
      transaction_ref: requestId,
      status: "pending",
      payment_method: "wallet",
      customer_info: phone,
    });

    await debitWallet(user_id, amount, requestId);

    const result = await vtpass.buyData({
      requestId,
      network: provider.code,
      phone,
      variationCode: variation_code,
    });
    await transaction.update({
      vtpass_reference: result?.data?.requestId || requestId,
      amount: result?.data?.content?.transactions?.amount || amount,
      status:
        result.success && result?.data?.code === "000" ? "success" : "failed",
    });

    return res.json({
      message: getFriendlyMessage(
        result?.data?.code,
        result?.data?.response_description,
      ),
      transaction,
      vtpass: result,
    });
  } catch (err) {
    console.error("Pay Data Error:", err.message);
    return res.status(400).json({ message: err.message });
  }
};

const payElectricity = async (req, res) => {
  try {
    const { provider_id, meter_no, type, amount, phone, pin } = req.body;
    const { user_id } = req.user;

    // const checkPin = await verifyPin(req.user, pin);
    // if (!checkPin.valid) {
    //   return res.status(400).json({ message: checkPin.message });
    // }

    const provider = await BillProvider.findByPk(provider_id);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    const requestId = generateRequestId();

    const transaction = await BillTransaction.create({
      user_id,
      category_id: provider.category_id,
      provider_id,
      amount,
      service_charge: 0,
      total_amount: amount,
      transaction_ref: requestId,
      status: "pending",
      payment_method: "wallet",
      customer_info: meter_no,
    });

    await debitWallet(user_id, amount, requestId);
    const result = await vtpass.payElectricity({
      requestId,
      disco: provider.code,
      meterNo: meter_no,
      type,
      amount,
      phone,
    });

    await transaction.update({
      vtpass_reference: result?.data?.requestId || requestId,
      token: result?.data?.token,
      status:
        result.success && result?.data?.code === "000" ? "success" : "failed",
    });

    return res.json({
      message: getFriendlyMessage(
        result?.data?.code,
        result?.data?.response_description,
      ),
      transaction,
      vtpass: result,
    });
  } catch (err) {
    console.error("Pay Electricity Error:", err.message);
    return res.status(400).json({ message: err.message });
  }
};

const payTV = async (req, res) => {
  try {
    const { provider_id, smart_card, variation_code, amount, phone, pin } =
      req.body;
    const { user_id } = req.user;

    // const checkPin = await verifyPin(req.user, pin);
    // if (!checkPin.valid) {
    //   return res.status(400).json({ message: checkPin.message });
    // }

    const provider = await BillProvider.findByPk(provider_id);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    const requestId = generateRequestId();

    const transaction = await BillTransaction.create({
      user_id,
      category_id: provider.category_id,
      provider_id,
      amount,
      service_charge: 0,
      total_amount: amount,
      status: "pending",
      transaction_ref: requestId,
      payment_method: "wallet",
      customer_info: smart_card,
    });

    await debitWallet(user_id, amount, requestId);

    const result = await vtpass.payTV({
      requestId,
      provider: provider.code,
      smartCard: smart_card,
      variationCode: variation_code,
      phone,
    });
    await transaction.update({
      vtpass_reference: result?.data?.requestId || requestId,
      expiry_date: result?.data?.content?.transactions?.expiry_date,
      amount: result?.data?.content?.transactions?.amount || amount,
      status:
        result.success && result?.data?.code === "000" ? "success" : "failed",
    });

    return res.json({
      message: getFriendlyMessage(
        result?.data?.code,
        result?.data?.response_description,
      ),
      transaction,
      vtpass: result,
    });
  } catch (err) {
    console.error("Pay TV Error:", err.message);
    return res.status(400).json({ message: err.message });
  }
};

const requeryTransaction = async (req, res) => {
  try {
    const { transaction_ref } = req.params;
    const transaction = await BillTransaction.findOne({
      where: { transaction_ref },
    });
    if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });

    const result = await vtpass.requery(transaction_ref);

    if (result.success && result.data) {
      let newStatus = transaction.status;

      // VTpass success code
      if (result.data.code === "000") {
        newStatus = "success";
      } else if (["016", "099"].includes(result.data.code)) {
        // 016 = pending, 099 = still processing
        newStatus = "pending";
      } else {
        newStatus = "failed";
      }

      await transaction.update({
        status: newStatus,
      });
    }

    return res.json({
      message: "Requery complete",
      transaction,
      vtpass: result,
    });
  } catch (err) {
    console.error("Requery Error:", err.message);
    return res.status(400).json({ message: err.message });
  }
};

const getUserBillTransactions = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const transactions = await BillTransaction.findAll({
      where: { user_id },

      include: [
        {
          model: BillCategory,
          as: "category",
          attributes: ["category_id", "name"],
        },
        {
          model: BillProvider,
          as: "provider",
          attributes: ["provider_id", "name"],
        },
      ],

      order: [["created_at", "DESC"]],
    });

    const formattedTransactions = transactions.map((transaction) => ({
      id: transaction.transaction_id,
      reference: transaction.transaction_ref,
      amount: Number(transaction.total_amount),

      status:
        transaction.status === "success" ? "successful" : transaction.status,

      token: transaction.token,
      expiry_date: transaction.expiry_date,
      customer_info: transaction.customer_info,
      payment_method: transaction.payment_method,

      category: transaction.category
        ? {
            id: transaction.category.category_id,
            name: transaction.category.name,
          }
        : null,

      provider: transaction.provider
        ? {
            id: transaction.provider.provider_id,
            name: transaction.provider.name,
          }
        : null,

      created_at: transaction.createdAt,
    }));

    return res.status(200).json({
      message: "Bill transactions retrieved successfully",
      transactions: formattedTransactions,
    });
  } catch (error) {
    console.error("Get user bill transactions error:", error);

    return res.status(500).json({
      message: "Failed to retrieve bill transactions",
    });
  }
};

const getBillTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    const transaction = await BillTransaction.findOne({
      where: {
        transaction_id: id,
        user_id: userId,
      },
      include: [
        {
          model: BillCategory,
          as: "category",
          attributes: ["category_id", "name"],
        },
        {
          model: BillProvider,
          as: "provider",
          attributes: ["provider_id", "name"],
        },
      ],
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Bill transaction not found",
      });
    }

    return res.status(200).json({
      message: "Bill transaction retrieved successfully",
      transaction: {
        id: transaction.transaction_id,
        reference: transaction.transaction_ref,
        amount: Number(transaction.amount),
        service_charge: Number(transaction.service_charge),
        total_amount: Number(transaction.total_amount),
        status:
          transaction.status === "success" ? "successful" : transaction.status,
        token: transaction.token,
        expiry_date: transaction.expiry_date,
        customer_info: transaction.customer_info,
        payment_method: transaction.payment_method,
        created_at: transaction.createdAt,
        category: transaction.category
          ? {
              id: transaction.category.category_id,
              name: transaction.category.name,
            }
          : null,
        provider: transaction.provider
          ? {
              id: transaction.provider.provider_id,
              name: transaction.provider.name,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Get bill transaction error:", error);

    return res.status(500).json({
      message: "Failed to retrieve bill transaction",
    });
  }
};

module.exports = {
  payAirtime,
  payData,
  payElectricity,
  payTV,
  requeryTransaction,
  getUserBillTransactions,
  getBillTransactionById,
};
