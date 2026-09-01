"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      "beneficiaries",
      "meter_type",
      {
        type: Sequelize.ENUM("prepaid", "postpaid"),
        allowNull: true,
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.removeColumn(
      "beneficiaries",
      "meter_type"
    );

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_beneficiaries_meter_type";'
    );
  },
};