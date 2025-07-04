'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
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
        allowNull: false,
        lowercase: true,
        trim: true
      },
      email_verified:{
        type: DataTypes.BOOLEAN,
        defaultValue: false

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
