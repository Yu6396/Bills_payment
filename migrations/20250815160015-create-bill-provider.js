"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("bill_providers", {
      provider_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      category_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "bill_categories",
          key: "category_id",
        },
        onDelete: "CASCADE",
      },
      name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      code: {
        type: Sequelize.STRING(50),
        unique: true,
      },
      description: {
        type: Sequelize.TEXT,
      },
      service_charge: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("bill_providers");
  },
};
