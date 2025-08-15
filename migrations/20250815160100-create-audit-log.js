'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('audit_logs', {
      auditLog_id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true, allowNull: false },
      admin_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'admins', key: 'admin_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      action: { type: Sequelize.STRING },
      resource: { type: Sequelize.STRING },
      timestamp: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW'), allowNull: false },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW'), allowNull: false },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW'), allowNull: false },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('audit_logs');
  }
};
