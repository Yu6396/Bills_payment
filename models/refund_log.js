// models/refund_log.js
"use strict";

module.exports = (sequelize, DataTypes) => {
  const RefundLog = sequelize.define(
    "RefundLog",
    {
      transaction_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      reason: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {}
  );

  RefundLog.associate = (models) => {
    RefundLog.belongsTo(models.BillTransaction, {
      foreignKey: "transaction_id",
      as: "transaction",
    });
    RefundLog.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });
  };

  return RefundLog;
};
