// models/Admin.js
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    static associate(models) {
      Admin.hasMany(models.AuditLog, { foreignKey: "admin_id" });
    }
  }

  Admin.init(
    {
      admin_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      first_name: { type: DataTypes.STRING, allowNull: false },
      last_name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password_hash: { type: DataTypes.STRING, allowNull: false },
      password_salt: { type: DataTypes.STRING, allowNull: false },
      address: { type: DataTypes.STRING },
      phone_number: { type: DataTypes.STRING, allowNull: false },
      role: { type: DataTypes.STRING, defaultValue: "admin" },
    },
    {
      sequelize,
      modelName: "Admin",
      tableName: "admins",
      underscored: true,
    }
  );

  return Admin;
};
