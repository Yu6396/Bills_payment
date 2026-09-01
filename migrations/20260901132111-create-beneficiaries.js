"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("beneficiaries", {
      beneficiary_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
        allowNull: false,
      },

      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "user_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      provider_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "bill_providers",
          key: "provider_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      category: {
        type: Sequelize.ENUM(
          "airtime",
          "data",
          "electricity",
          "tv"
        ),
        allowNull: false,
      },

      label: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      phone_number: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },

      meter_number: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },

      smartcard_number: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("beneficiaries");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_beneficiaries_category";'
    );
  },
};