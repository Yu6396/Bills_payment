'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Bill extends Model {}

  Bill.init(
    {
      bill_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      category: DataTypes.STRING,
      provider: DataTypes.STRING,
      name: DataTypes.STRING,
      code: DataTypes.STRING,
      price: DataTypes.DECIMAL(12, 2),
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
      modelName: 'Bill',
      tableName: 'Bills'
    }
  );

  return Bill;
};
