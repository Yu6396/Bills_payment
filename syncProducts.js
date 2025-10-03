require('dotenv').config();
const { sequelize } = require('./models');
const  syncVTpassProductsOptimized  = require('./src/jobs/vtpassProductJob');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    await syncVTpassProductsOptimized();

    console.log('Done!');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
