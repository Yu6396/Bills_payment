'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AuditLog extends Model {}

  AuditLog.init(
    {
      auditLog_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      admin_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      action: {
        type: DataTypes.STRING,
        allowNull: true
      },
      resource: {
        type: DataTypes.STRING,
        allowNull: true
      },
    },
    {
      sequelize,
      modelName: 'AuditLog',
      tableName: 'AuditLogs',
      timestamps: true 
    }
  );

  return AuditLog;
};
