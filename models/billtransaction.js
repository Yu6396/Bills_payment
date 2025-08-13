'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BillTransaction extends Model {
    static associate(models) {
      BillTransaction.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
      BillTransaction.belongsTo(models.BillProvider, {
        foreignKey: 'provider_id',
        as: 'provider'
      });
      BillTransaction.belongsTo(models.BillCategory, {
        foreignKey: 'category_id',
        as: 'category'
      });
    }
  }
  BillTransaction.init({
    transaction_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    category_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    provider_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    service_charge: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    status: {
      type: DataTypes.ENUM('pending', 'success', 'failed'),
      allowNull: false,
      defaultValue: 'pending'
    },
    transaction_ref: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false
    },
    payment_method: {
      type: DataTypes.STRING(50)
    }
  }, {
    sequelize,
    modelName: 'BillTransaction',
    tableName: 'BillTransactions'
  });
  return BillTransaction;
};
