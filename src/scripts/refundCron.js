require("dotenv").config();
const cron = require("node-cron");
const { checkAndRefundFailedTransactions } = require("../utils/refundCheck");

cron.schedule("* * * * *", async () => {
  console.log("⏰ Running automated refund cron...");
  await checkAndRefundFailedTransactions();
  console.log("⏰ Automated refund cron finished");
});
