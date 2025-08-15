'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('wallets', {
      wallet_id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true, allowNull: false },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'user_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      balance: { type: Sequelize.DECIMAL(12, 2), defaultValue: 0.0 },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW'), allowNull: false },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW'), allowNull: false },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('wallets');
  }
};
