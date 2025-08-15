'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bill_categories', {
      category_id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true, allowNull: false },
      name: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      description: { type: Sequelize.TEXT },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW'), allowNull: false },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW'), allowNull: false },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('bill_categories');
  }
};
