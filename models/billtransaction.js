"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class BillTransaction extends Model {
    static associate(models) {
      BillTransaction.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
      BillTransaction.belongsTo(models.BillCategory, { foreignKey: "category_id", as: "category" });
      BillTransaction.belongsTo(models.BillProvider, { foreignKey: "provider_id", as: "provider" });
    }
  }

  BillTransaction.init(
    {
      transaction_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: { type: DataTypes.UUID, allowNull: false },
      category_id: { type: DataTypes.UUID, allowNull: false },
      provider_id: { type: DataTypes.UUID, allowNull: false },
      amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      service_charge: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
      total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      transaction_ref: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      vtpass_reference: { type: DataTypes.STRING(100) },
       token: { type: DataTypes.STRING(200) },  // For electricity or PIN-based services
      expiry_date: { type: DataTypes.DATE },  
      status: {
        type: DataTypes.ENUM("pending", "success", "failed"),
        defaultValue: "pending",
      },
      payment_method: { type: DataTypes.STRING(50) },
      customer_info: { type: DataTypes.STRING(100) }, // e.g. smartcard, meter, phone
    },
    {
      sequelize,
      modelName: "BillTransaction",
      tableName: "bill_transactions",
      underscored: true,
    }
  );

  return BillTransaction;
};
