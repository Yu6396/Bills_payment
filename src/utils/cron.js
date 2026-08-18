const processRequery = require("../jobs/requeryJob");
const processFailedRefunds = require("../jobs/processFailedRefund");
const cron = require('node-cron');


cron.schedule("* * * * *", async () => {
  console.log("⏳ Running VTpass requery job...");

  await processRequery();

  console.log("💰 Running failed refund job...");

  await processFailedRefunds();
});