// models/AuditLog.js
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class AuditLog extends Model {
    static associate(models) {
      AuditLog.belongsTo(models.Admin, { foreignKey: "admin_id", as: "admin" });
    }
  }

  AuditLog.init(
    {
      auditLog_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      admin_id: { type: DataTypes.UUID, allowNull: false },
      action: { type: DataTypes.STRING },
      resource: { type: DataTypes.STRING },
      timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      sequelize,
      modelName: "AuditLog",
      tableName: "audit_logs",
      underscored: true,
    }
  );

  return AuditLog;
};
