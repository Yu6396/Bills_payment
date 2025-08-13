'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BillCategory extends Model {
    static associate(models) {
      // One category can have many bill providers
      BillCategory.hasMany(models.BillProvider, {
        foreignKey: 'category_id',
        as: 'providers'
      });
    }
  }

  BillCategory.init(
    {
      category_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    },
    {
      sequelize,
      modelName: 'BillCategory',
      tableName: 'BillCategories',
      timestamps: true
    }
  );

  return BillCategory;
};
