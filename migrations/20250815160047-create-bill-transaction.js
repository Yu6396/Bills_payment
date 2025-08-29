"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("bill_transactions", {
      transaction_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
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
      provider_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "bill_providers",
          key: "provider_id",
        },
        onDelete: "CASCADE",
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      service_charge: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      status: {
        type: Sequelize.ENUM("pending", "success", "failed"),
        defaultValue: "pending",
      },
      transaction_ref: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      payment_method: {
        type: Sequelize.STRING(50),
      },
      vtpass_request_id: {
        type: Sequelize.STRING(100), // <-- new (for VTPass reference)
        unique: true,
      },
      vtpass_response: {
        type: Sequelize.JSONB, // <-- save VTpass response payload
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
    await queryInterface.dropTable("bill_transactions");
  },
};
