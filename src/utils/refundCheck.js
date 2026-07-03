// cron/refundCheck.js
require("dotenv").config();
const { BillTransaction, User, RefundLog } = require("../../models");
const { requery } = require("../services/vtPassServices");

async function checkAndRefundFailedTransactions() {
  console.log("🔄 Checking failed/pending transactions...");

  try {
    // 1. Find transactions that are still pending
    const pendingTxns = await BillTransaction.findAll({
      where: { status: "pending" },
      include: [{ model: User, as: "user" }],
    });

    if (!pendingTxns.length) {
      console.log("✅ No pending transactions found.");
      return;
    }

    for (const txn of pendingTxns) {
      console.log(`🔍 Requerying transaction ${txn.transaction_ref}`);

      const result = await requery(txn.transaction_ref);

      if (result.success) {
        const status = result.data.content.transactions.status;
        console.log(`➡️ VTpass status for ${txn.transaction_ref}: ${status}`);

        if (status === "delivered") {
          // mark as success
          await txn.update({ status: "success" });
          console.log(
            `✅ Transaction ${txn.transaction_ref} marked as success`
          );
        } else if (status === "failed") {
          // refund user
          const refundAmount = Number(txn.amount) + Number(txn.service_charge);
          await txn.update({ status: "failed" });

          await txn.user.increment("wallet_balance", { by: refundAmount });
          await RefundLog.create({
            transaction_id: txn.id,
            user_id: txn.user.id,
            amount: refundAmount,
            reason: "VTpass transaction failed",
          });

          console.log(`💸 Refunded ₦${refundAmount} to ${txn.user.email}`);
        }
      } else {
        console.log(
          `⚠️ Requery failed for ${txn.transaction_ref}: ${result.message}`
        );
      }
    }
  } catch (err) {
    console.error("❌ Cron job error:", err.message);
  }
}

module.exports = { checkAndRefundFailedTransactions };
