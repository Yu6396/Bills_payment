"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("bill_transactions", "vtpass_request_id");
    await queryInterface.removeColumn("bill_transactions", "vtpass_response");
    await queryInterface.removeColumn("bill_transactions", "request_payload");


    await queryInterface.addColumn("bill_transactions","token", {
      type: Sequelize.STRING(200),
    });
    await queryInterface.addColumn("bill_transactions","expiry_date", {
      type: Sequelize.DATE,
    });
     
    
  },


  async down(queryInterface, Sequelize) {
    // Revert changes
    await queryInterface.addColumn("bill_transactions", "vtpass_request_id", {
      type: Sequelize.STRING(100),
      unique: true,
    });

    await queryInterface.addColumn("bill_transactions", "vtpass_response", {
      type: Sequelize.JSON,
    });
    await queryInterface.addColumn("bill_transactions", "request_payload", {
      type: Sequelize.JSON,
    });

    await queryInterface.removeColumn("bill_transactions", "token");
    await queryInterface.removeColumn("bill_transactions", "expiry_date");
  },
};
