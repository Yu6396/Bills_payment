'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {}

  Transaction.init(
    {
      transaction_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      wallet_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      amount: DataTypes.DECIMAL(12, 2),
      status: DataTypes.STRING,
      payment_reference: DataTypes.STRING,
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      

    },

    {
      sequelize,
      modelName: 'Transaction',
      tableName: 'Transactions'
    }
  );

  return Transaction;
};
