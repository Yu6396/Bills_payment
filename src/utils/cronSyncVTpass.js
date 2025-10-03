const cron = require('node-cron');
const  syncVTpassProductsOptimized  = require('../jobs/vtpassProductJob'); // your sync function file

// Schedule cron job to run every day at 2:00 AM
cron.schedule('0 2 * * *', async () => {
  console.log('⏰ Running VTpass products sync...');
  try {
    await syncVTpassProductsOptimized();
    console.log('✅ VTpass products sync completed.');
  } catch (err) {
    console.error('❌ Error in cron job:', err.message);
  }
});

console.log('🕒 VTpass cron job scheduled.');
