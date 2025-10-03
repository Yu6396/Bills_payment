"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    // Fetch categories first so we can link providers correctly
    const categories = await queryInterface.sequelize.query(
      `SELECT category_id, name FROM bill_categories;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const findCategoryId = (name) =>
      categories.find((c) => c.name === name)?.category_id;

    const providers = [
      // Airtime Providers
      {
        provider_id: uuidv4(),
        category_id: findCategoryId("Airtime"),
        name: "MTN",
        code: "mtn",
        description: "MTN Airtime",
        service_charge: 0.0,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        provider_id: uuidv4(),
        category_id: findCategoryId("Airtime"),
        name: "Airtel",
        code: "airtel",
        description: "Airtel Airtime",
        service_charge: 0.0,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        provider_id: uuidv4(),
        category_id: findCategoryId("Airtime"),
        name: "GLO",
        code: "glo",
        description: "GLO Airtime",
        service_charge: 0.0,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        provider_id: uuidv4(),
        category_id: findCategoryId("Airtime"),
        name: "9mobile",
        code: "etisalat",
        description: "9mobile Airtime",
        service_charge: 0.0,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Data Providers
      {
        provider_id: uuidv4(),
        category_id: findCategoryId("Data"),
        name: "MTN Data",
        code: "mtn-data",
        description: "MTN Internet Data",
        service_charge: 0.0,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        provider_id: uuidv4(),
        category_id: findCategoryId("Data"),
        name: "Airtel Data",
        code: "airtel-data",
        description: "Airtel Internet Data",
        service_charge: 0.0,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        provider_id: uuidv4(),
        category_id: findCategoryId("Data"),
        name: "GLO Data",
        code: "glo-data",
        description: "GLO Internet Data",
        service_charge: 0.0,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        provider_id: uuidv4(),
        category_id: findCategoryId("Data"),
        name: "9mobile Data",
        code: "etisalat-data",
        description: "9mobile Internet Data",
        service_charge: 0.0,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        provider_id: uuidv4(),
        category_id: findCategoryId("Data"),
        name: "Smile",
        code: "smile-direct",
        description: "Smile Internet Data",
        service_charge: 0.0,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        provider_id: uuidv4(),
        category_id: findCategoryId("Data"),
        name: "Spectranet",
        code: "spectranet",
        description: "Spectranet Internet Data",
        service_charge: 0.0,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // TV
      {
        provider_id: uuidv4(),
        category_id: findCategoryId("TV"),
        name: "DSTV",
        code: "dstv",
        description: "DSTV Subscription",
        service_charge: 0.0,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        provider_id: uuidv4(),
        category_id: findCategoryId("TV"),
        name: "GOTV",
        code: "gotv",
        description: "GOTV Subscription",
        service_charge: 0.0,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        provider_id: uuidv4(),
        category_id: findCategoryId("TV"),
        name: "Startimes",
        code: "startimes",
        description: "Startimes Subscription",
        service_charge: 0.0,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Electricity
      {
        provider_id: uuidv4(),
        category_id: findCategoryId("Electricity"),
        name: "Ikeja Electric",
        code: "ikeja-electric",
        description: "Ikeja Electricity Bills",
        service_charge: 0.0,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        provider_id: uuidv4(),
        category_id: findCategoryId("Electricity"),
        name: "Eko Electric",
        code: "eko-electric",
        description: "Eko Electricity Bills",
        service_charge: 0.0,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        provider_id: uuidv4(),
        category_id: findCategoryId("Electricity"),
        name: "Abuja Disco (AEDC)",
        code: "abuja-electric",
        description: "Abuja Electricity Bills (AEDC)",
        service_charge: 0.0,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await queryInterface.bulkInsert("bill_providers", providers, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("bill_providers", null, {});
  },
};
