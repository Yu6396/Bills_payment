const cron = require("node-cron");
const { BillTransaction, User } = require("../../models");
const vtpass = require("../services/vtPassServices");
const { requery } = require("../services/vtPassServices");
const refundUser = require("../services/refundService");
const sendEmail  = require("../services/emailService");
const { createNotification } = require("../services/NotificationService");
// Run every 5 minutes
cron.schedule("*/5 * * * *", async () => {
  console.log("🔄 Requery Job Running...");

  try {
    // Get all pending txns
    const pendingTxns = await BillTransaction.findAll({
      where: { status: "pending" },
    });

    for (const txn of pendingTxns) {
      console.log(`Requerying txn ${txn.transaction_ref}...`);

      const result = await vtpass.requery(txn.transaction_ref);

      if (result.success && result.data) {
        let newStatus = txn.status;

        if (result.data.code === "000") {
          newStatus = "success";
        } else if (["016", "099"].includes(result.data.code)) {
          newStatus = "pending"; // still pending, leave as is
        } else {
          newStatus = "failed";
        }
        if (newStatus === "failed" && !txn.refunded) {
          await refundUser(txn.user_id, txn.amount, txn);
        }

        await txn.update({
          status: newStatus,
          vtpass_response: result.data,
        });

        console.log(`✅ Txn ${txn.transaction_ref} updated to ${newStatus}`);
      } else {
        console.error(
          `❌ Requery failed for ${txn.transaction_ref}:`,
          result.error
        );
      }
    }
  } catch (err) {
    console.error("Requery Job Error:", err.message);
  }
});

async function processRequery() {
  const pendingTxns = await BillTransaction.findAll({
    where: { status: "pending" },
  });

  for (const txn of pendingTxns) {
    try {
      const resp = await requery(txn.transaction_ref);

      if (!resp.success) continue;

      const vtStatus = resp.data.content.transactions.status;

      if (vtStatus === "delivered") {
        await txn.update({ status: "success" });
      } else if (vtStatus === "failed" || vtStatus === "reversed") {
        await txn.update({ status: "failed" });

        // refund user’s wallet
        await refundWallet(txn.user_id, txn.amount);

        // fetch user info
        const user = await User.findByPk(txn.user_id);

        // send email
        await sendEmail(
          user.email,
          "Refund Processed",
          `Hello ${user.name}, your payment of ₦${txn.amount} for ${txn.category_id} has been refunded to your wallet.`
        );

        // in-app notification
        await createNotification(
          user.id,
          `Your payment of ₦${txn.amount} failed and has been refunded.`
        );
      }
    } catch (err) {
      console.error("Requery job error:", err.message);
    }
  }
}

module.exports = processRequery;
