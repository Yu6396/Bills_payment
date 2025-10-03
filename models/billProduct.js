"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class BillProduct extends Model {
    static associate(models) {
      BillProduct.belongsTo(models.BillProvider, { foreignKey: "provider_id", as: "provider" });
    }
  }

  BillProduct.init(
    {
      product_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      provider_id: { type: DataTypes.UUID, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      variation_code: { type: DataTypes.STRING, allowNull: false },
      price: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    },
    {
      sequelize,
      modelName: "BillProduct",
      tableName: "bills_products",
      underscored: true,
    }
  );

  return BillProduct;
};
