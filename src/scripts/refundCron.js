require("dotenv").config();
const cron = require("node-cron");
const { checkAndRefundFailedTransactions } = require("../utils/refundCheck");

// Schedules the task to run every 5 minutes
cron.schedule("*/5 * * * *", async () => {
  console.log("⏰ Running automated refund cron...");
  await checkAndRefundFailedTransactions();
  console.log("⏰ Automated refund cron finished");
});
