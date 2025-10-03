require("dotenv").config();
const { checkAndRefundFailedTransactions } = require("../utils/refundCheck");

(async () => {
  console.log("Running refund cron...");
  await checkAndRefundFailedTransactions();
  console.log("Refund cron finished");
})();
