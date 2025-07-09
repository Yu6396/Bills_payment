'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove the "type" column
    await queryInterface.removeColumn('Transactions', 'type');
     await queryInterface.removeColumn('Transactions', 'description');

    // Add the new "payment_reference" column
    await queryInterface.addColumn('Transactions', 'payment_reference', {
      type: Sequelize.STRING,
      allowNull: true, // or false, depending on your needs
    });
  },

  // down: async (queryInterface, Sequelize) => {
  //   // Revert: add "type" back
  //   await queryInterface.addColumn('Transactions', 'type', {
  //     type: Sequelize.STRING,
  //     allowNull: true, // or the original value
  //   });

  //   // Revert: remove "payment_reference"
  //   await queryInterface.removeColumn('Transactions', 'payment_reference');
  // }
};
