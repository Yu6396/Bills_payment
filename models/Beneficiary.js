"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Beneficiary extends Model {
    static associate(models) {
      Beneficiary.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });

      Beneficiary.belongsTo(models.BillProvider, {
        foreignKey: "provider_id",
        as: "provider",
      });
    }
  }

  Beneficiary.init(
    {
      beneficiary_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      provider_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },

      category: {
        type: DataTypes.ENUM("airtime", "data", "electricity", "tv"),
        allowNull: false,
      },

      label: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      phone_number: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },

      meter_number: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      meter_type: {
        type: DataTypes.ENUM("prepaid", "postpaid"),
        allowNull: true,
      },

      smartcard_number: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Beneficiary",
      tableName: "beneficiaries",
      underscored: true,
    },
  );

  return Beneficiary;
};
