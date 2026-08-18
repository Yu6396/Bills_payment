"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("transactions", "type", {
      type: Sequelize.ENUM("credit", "debit"),
      allowNull: false,
      defaultValue: "credit",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("transactions", "type");

    // PostgreSQL
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_transactions_type";'
    );
  },
};