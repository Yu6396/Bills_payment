// models/Wallet.js
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Wallet extends Model {
    static associate(models) {
      Wallet.belongsTo(models.User, { foreignKey: "user_id" });
      Wallet.hasMany(models.Transaction, { foreignKey: "wallet_id" });
    }
  }

  Wallet.init(
    {
      wallet_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: { type: DataTypes.UUID, allowNull: false },
      balance: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0.0 },
    },
    {
      sequelize,
      modelName: "Wallet",
      tableName: "wallets",
      underscored: true,
    }
  );

  return Wallet;
};
