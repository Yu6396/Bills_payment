// models/OAuthCredential.js
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class OAuthCredential extends Model {
    static associate(models) {
      OAuthCredential.belongsTo(models.User, { foreignKey: "user_id" });
    }
  }

  OAuthCredential.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      provider: { type: DataTypes.STRING, allowNull: false },
      providerId: { type: DataTypes.STRING, allowNull: false },
      user_id: { type: DataTypes.UUID, allowNull: false },
    },
    {
      sequelize,
      modelName: "OAuthCredential",
      tableName: "oauth_credentials",
      underscored: true,
    }
  );

  return OAuthCredential;
};
