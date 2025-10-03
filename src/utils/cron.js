const cron = require("node-cron");
const processRequery = require("../jobs/requeryJob");

// Run every 5 minutes
cron.schedule("*/5 * * * *", async () => {
  console.log("⏳ Running VTpass requery job...");
  await processRequery();
});
