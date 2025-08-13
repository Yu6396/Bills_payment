"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class BillProvider extends Model {
    static associate(models) {
      BillProvider.belongsTo(models.BillCategory, {
        foreignKey: "category_id",
        as: "category",
      });
    }
  }
  BillProvider.init(
    {
      provider_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      category_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING(50),
        unique: true,
      },
      description: DataTypes.TEXT,
      service_charge: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "BillProvider",
      tableName: "BillProviders",
    }
  );
  return BillProvider;
};
