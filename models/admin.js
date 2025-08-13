'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    static associate(models) {
      // associations here if needed
    }
  }

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
        set(value) {
          if (value) this.setDataValue('first_name', value.trim().toLowerCase());
        }
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
          if (value) this.setDataValue('last_name', value.trim().toLowerCase());
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
        set(value) {
          if (value) this.setDataValue('email', value.trim().toLowerCase());
        }
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password_salt: {
        type: DataTypes.STRING,
        allowNull: false
      },
      address: {
        type: DataTypes.STRING,
        set(value) {
          if (value) this.setDataValue('address', value.trim().toLowerCase());
        }
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
          if (value) this.setDataValue('phone_number', value.trim().toLowerCase());
        }
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
