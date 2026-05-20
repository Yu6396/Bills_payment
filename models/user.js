// models/User.js
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Wallet, { foreignKey: "user_id" });
      User.hasMany(models.Transaction, { foreignKey: "user_id" });
      User.hasMany(models.BillTransaction, { foreignKey: "user_id" });
      User.hasMany(models.OAuthCredential, { foreignKey: "user_id", as: "oauthCredentials"});
    }
  }

  User.init(
    {
      user_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      first_name: { type: DataTypes.STRING(100), allowNull: false },
      last_name: { type: DataTypes.STRING(100), allowNull: false },
      email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
      password_hash: { type: DataTypes.STRING, allowNull: false },
      password_salt: { type: DataTypes.STRING, allowNull: false },
      phone_number: { type: DataTypes.STRING(20), unique: true },
      is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
      pending_email: { type: DataTypes.STRING(150), allowNull: true ,},
      is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
      pending_phone_number: { type: DataTypes.STRING(20), allowNull: true },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      underscored: true,
    }
  );

  return User;
};
