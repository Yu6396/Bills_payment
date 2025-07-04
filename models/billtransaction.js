'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BillTransaction extends Model {}

  BillTransaction.init(
    {
      billTransaction_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      bill_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      amount: DataTypes.DECIMAL(12, 2),
      status: DataTypes.STRING,
      reference: DataTypes.STRING,
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    },

    {
      sequelize,
      modelName: 'BillTransaction',
      tableName: 'BillTransactions'
    }
  );

  return BillTransaction;
};
