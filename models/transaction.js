// models/Transaction.js
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      Transaction.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
      Transaction.belongsTo(models.Wallet, {
        foreignKey: "wallet_id",
        as: "wallet",
      });
    }
  }

  Transaction.init(
    {
      transaction_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: { type: DataTypes.UUID, allowNull: false },
      wallet_id: { type: DataTypes.UUID, allowNull: false },
      amount: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0.0 },
      status: { type: DataTypes.STRING },
      payment_reference: { type: DataTypes.STRING },
      type: {
        type: DataTypes.ENUM("credit", "debit"),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Transaction",
      tableName: "transactions",
      underscored: true,
    },
  );

  return Transaction;
};
