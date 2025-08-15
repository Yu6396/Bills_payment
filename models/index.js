'use strict';

require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const db = {};

// Import models
db.User = require('./user')(sequelize, Sequelize.DataTypes);
db.Admin = require('./admin')(sequelize, Sequelize.DataTypes);
db.Wallet = require('./wallet')(sequelize, Sequelize.DataTypes);
db.Otp = require('./otp')(sequelize, Sequelize.DataTypes);
db.Transaction = require('./transactions')(sequelize, Sequelize.DataTypes);
db.BillCategory = require('./billCategories')(sequelize, Sequelize.DataTypes);
db.BillProvider = require('./billProviders')(sequelize, Sequelize.DataTypes);
db.BillTransaction = require('./billTransactions')(sequelize, Sequelize.DataTypes);
db.AuditLog = require('./auditLogs')(sequelize, Sequelize.DataTypes);
db.OAuthCredential = require('./oauthCredentials')(sequelize, Sequelize.DataTypes);

// Associations

// Wallet belongs to User
db.User.hasOne(db.Wallet, { foreignKey: 'user_id' });
db.Wallet.belongsTo(db.User, { foreignKey: 'user_id' });

// Transaction belongs to User and Wallet
db.User.hasMany(db.Transaction, { foreignKey: 'user_id' });
db.Transaction.belongsTo(db.User, { foreignKey: 'user_id' });
db.Wallet.hasMany(db.Transaction, { foreignKey: 'wallet_id' });
db.Transaction.belongsTo(db.Wallet, { foreignKey: 'wallet_id' });

// BillTransactions associations
db.User.hasMany(db.BillTransaction, { foreignKey: 'user_id' });
db.BillTransaction.belongsTo(db.User, { foreignKey: 'user_id' });

db.BillCategory.hasMany(db.BillTransaction, { foreignKey: 'category_id' });
db.BillTransaction.belongsTo(db.BillCategory, { foreignKey: 'category_id' });

db.BillProvider.hasMany(db.BillTransaction, { foreignKey: 'provider_id' });
db.BillTransaction.belongsTo(db.BillProvider, { foreignKey: 'provider_id' });

// AuditLogs
db.Admin.hasMany(db.AuditLog, { foreignKey: 'admin_id' });
db.AuditLog.belongsTo(db.Admin, { foreignKey: 'admin_id' });

// OAuthCredentials
db.User.hasMany(db.OAuthCredential, { foreignKey: 'user_id' });
db.OAuthCredential.belongsTo(db.User, { foreignKey: 'user_id' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
