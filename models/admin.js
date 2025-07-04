'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {}

  Admin.init(
    {
      admin_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
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
        lowercase: true,
        trim: true
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
        lowercase: true,
        trim: true
      },
      password_salt: {
        type: DataTypes.STRING,
        allowNull: false,
        lowercase: true,
        trim: true
      },
      address:{
        type: DataTypes.STRING,
        lowercase: true,
        trim: true
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
        lowercase: true,
        trim: true
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: 'admin'
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
      modelName: 'Admin',
      tableName: 'Admins'
    }
  );

  return Admin;
};
