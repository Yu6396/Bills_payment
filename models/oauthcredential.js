'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OAuthCredential extends Model {
    static associate(models) {
      OAuthCredential.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }

  OAuthCredential.init({
    provider: {
      type: DataTypes.STRING,
      allowNull: false
    },
    providerId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'OAuthCredential',
    tableName: 'OAuthCredentials',
    timestamps: true
  });

  return OAuthCredential;
};
