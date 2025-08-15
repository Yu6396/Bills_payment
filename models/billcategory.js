// models/BillCategory.js
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class BillCategory extends Model {
    static associate(models) {
      BillCategory.hasMany(models.BillProvider, { foreignKey: "category_id" });
      BillCategory.hasMany(models.BillTransaction, { foreignKey: "category_id" });
    }
  }

  BillCategory.init(
    {
      category_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      description: { type: DataTypes.TEXT },
      is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    {
      sequelize,
      modelName: "BillCategory",
      tableName: "bill_categories",
      underscored: true,
    }
  );

  return BillCategory;
};
