'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'pending_email', {
      type: Sequelize.STRING(150),
      allowNull: true,
      unique: false, // usually pending_email does not need to be unique
    });

    await queryInterface.addColumn('users', 'pending_phone_number', {
      type: Sequelize.STRING(20),
      allowNull: true,
      unique: false, // uniqueness will be enforced on phone_number only
    });

    await queryInterface.addColumn('users','is_active', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    });
  },


  async down(queryInterface) {
    await queryInterface.removeColumn('users', 'pending_email');
    await queryInterface.removeColumn('users', 'pending_phone_number');
    await queryInterface.removeColumn('users', 'is_active');
  }
};
