const { BillTransaction, BillProvider,Wallet } = require("../../models");
const vtpass = require("../services/vtPassServices");
const { v4: uuidv4 } = require("uuid");
const {   generateRequestId } = require("../utils");
const { getFriendlyMessage } = require("../utils/vtpassErrorMap");
   

async function debitWallet(user_id, amount) {
  try {
    const wallet = await Wallet.findOne({ where: { user_id } });
    if (!wallet) throw new Error("Wallet not found");

    if (Number(wallet.balance) < Number(amount)) {
      throw new Error("Insufficient balance");
    }

    // Deduct amount
    wallet.balance = Number(wallet.balance) - Number(amount);

    await wallet.save(); // save the updated balance
    return wallet;
  } catch (error) {
    throw new Error(error.message || "Failed to debit wallet");
  }
}


  const payAirtime = async (req, res) => {
  try {
    const { provider_id, phone, amount } = req.body;
    const {user_id} = req.params

    // Check provider
    const provider = await BillProvider.findByPk(provider_id);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    // Debit wallet
    await debitWallet(user_id, amount);

    // Generate transaction reference
    const requestId = generateRequestId();

    // Create transaction record
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

    
    const result = await vtpass.buyAirtime({
      requestId,
      phone,
      amount,
      network: provider.code, 
    });


    await transaction.update({
      vtpass_reference: result?.data?.requestId || requestId,
      status: result.success && result?.data?.code === "000" ? "success" : "failed",
    });

    return res.json({
    message: getFriendlyMessage(result?.data?.code, result?.data?.response_description),
      transaction,
      vtpass: result,
    });
  } catch (err) {
    console.error("Pay Airtime Error:", err.message);
    return res.status(400).json({ message: err.message });
  }
};


  const payData = async (req, res) => {
  try {
    const { provider_id, phone, variation_code, amount } = req.body;
    const {user_id }= req.params
     
    // Check provider
    const provider = await BillProvider.findByPk(provider_id);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    // Debit wallet
    await debitWallet(user_id, amount);

    // Generate transaction reference
    const requestId = generateRequestId();

    // Create transaction record
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

    // Call VTPass
    const result = await vtpass.buyData({
      requestId,
      network: provider.code,
      phone,
      variationCode: variation_code,
    });

    // Update transaction with VTPass result
    await transaction.update({
      vtpass_reference: result?.data?.requestId || requestId,
      amount: result?.data?.content?.transactions?.amount || amount,
      status: result.success && result?.data?.code === "000" ? "success" : "failed",
    });

    return res.json({
        message: getFriendlyMessage(result?.data?.code, result?.data?.response_description),
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
    const { provider_id, meter_no, type, amount, phone } = req.body;
    const {user_id} = req.params;

    // Check provider
    const provider = await BillProvider.findByPk(provider_id);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    // Debit wallet
    await debitWallet(user_id, amount);

    // Generate transaction reference
    const requestId = generateRequestId();

    // Create transaction record
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

    // Call VTPass
    const result = await vtpass.payElectricity({
      requestId,
      disco: provider.code,
      meterNo: meter_no,
      type,
      amount,
      phone,
    });

    // Update transaction based on VTPass response
    await transaction.update({
      vtpass_reference: result?.data?.requestId || requestId,
      token: result?.data?.token,
      status: result.success && result?.data?.code === "000" ? "success" : "failed",
    });

    return res.json({
  message: getFriendlyMessage(result?.data?.code, result?.data?.response_description),
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
    const { provider_id, smart_card, variation_code, amount, phone } = req.body;
    const {user_id} = req.params;

    // Check provider
    const provider = await BillProvider.findByPk(provider_id);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    // Debit wallet
    await debitWallet(user_id, amount);

    // Generate requestId
    const requestId = generateRequestId();

    // Create transaction record
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

    // Call VTpass
    const result = await vtpass.payTV({
      requestId,
      provider: provider.code,
      smartCard: smart_card,
      variationCode: variation_code,
      phone,
    });

    // Update transaction with response
    await transaction.update({
      vtpass_reference: result?.data?.requestId || requestId,
      expiry_date: result?.data?.content?.transactions?.expiry_date,
      amount: result?.data?.content?.transactions?.amount || amount,
      status: result.success && result?.data?.code === "000" ? "success" : "failed",
    });

    return res.json({
      message: getFriendlyMessage(result?.data?.code, result?.data?.response_description),
      transaction,
      vtpass: result,
    });
  } catch (err) {
    console.error("Pay TV Error:", err.message);
    return res.status(400).json({ message: err.message });
  }
};


  const requeryTransaction = async (req, res)=> {
  try {
    const { transaction_ref } = req.params;
    const transaction = await BillTransaction.findOne({ where: { transaction_ref } });
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

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

    return res.json({ message: "Requery complete", transaction, vtpass: result });
  } catch (err) {
    console.error("Requery Error:", err.message);
    return res.status(400).json({ message: err.message });
  }
}



  // TODO: payElectricity, payTV similar to above...
module.exports = { payAirtime, payData, payElectricity, payTV, requeryTransaction };
