'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // e.g., User.hasMany(models.OAuthCredential) if using a separate table
    }
  }

  User.init(
    {
      user_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
        lowercase: true,
        trim: true
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
        lowercase: true,
        trim: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
        lowercase: true,
        trim: true
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: true,
        lowercase: true,
        trim: true
      },
      password_salt: {
        type: DataTypes.STRING,
        allowNull: true,
        lowercase: true,
        trim: true
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: true, // ✅ made optional for Google users
        lowercase: true,
        trim: true
      },
      email_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      provider: {
        type: DataTypes.STRING,
        allowNull: true, 
        defaultValue: 'local'
      },
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
      modelName: 'User',
      tableName: 'Users',
      timestamps: true,
    }
  );

  return User;
};
