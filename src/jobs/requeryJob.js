const { BillTransaction, User } = require("../../models");
const { requery } = require("../services/vtPassServices");
const refundUser = require("../services/refundService");
const sendEmail  = require("../services/emailService");
const { createNotification } = require("../services/NotificationService");

async function processRequery() {
  try {
    const pendingTxns = await BillTransaction.findAll({
      where: { status: "pending" },
    });

    for (const txn of pendingTxns) {
      try {
        const resp = await requery(txn.transaction_ref);

        if (!resp.success || !resp.data) continue;

        const vtStatus = resp.data.code || resp.data.content?.transactions?.status;

        let newStatus = txn.status;

        if (vtStatus === "000" || vtStatus === "delivered") {
          newStatus = "success";
        } else if (["016", "099"].includes(vtStatus) || vtStatus === "pending") {
          newStatus = "pending";
        } else {
          newStatus = "failed";
        }

        if (newStatus === "failed" && !txn.refunded) {
          // Refund user
          await refundUser(txn.user_id, txn.amount, txn);

          // Fetch user info
          const user = await User.findByPk(txn.user_id);

          // Send email
          await sendEmail(
            user.email,
            "Refund Processed",
            `Hello ${user.name}, your payment of ₦${txn.amount} for ${txn.category_id} has been refunded to your wallet.`
          );

          // In-app notification
          await createNotification(
            user.id,
            `Your payment of ₦${txn.amount} failed and has been refunded.`
          );
        }

        // Update transaction status
        await txn.update({
          status: newStatus,
          vtpass_response: resp.data,
        });

        console.log(`✅ Txn ${txn.transaction_ref} updated to ${newStatus}`);
      } catch (err) {
        console.error(`Requery job error for ${txn.transaction_ref}:`, err.message);
      }
    }
  } catch (err) {
    console.error("Process Requery Error:", err.message);
  }
}

module.exports = processRequery;
