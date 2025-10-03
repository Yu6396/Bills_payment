"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    const categories = [
      {
        category_id: uuidv4(),
        name: "Airtime",
        description: "Airtime Top-up Services",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category_id: uuidv4(),
        name: "Data",
        description: "Mobile and Internet Data Bundles",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category_id: uuidv4(),
        name: "TV",
        description: "Cable TV Subscriptions",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category_id: uuidv4(),
        name: "Electricity",
        description: "Electricity Bill Payments",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await queryInterface.bulkInsert("bill_categories", categories, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("bill_categories", null, {});
  },
};
