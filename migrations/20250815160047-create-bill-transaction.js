"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("bill_transactions", {
      transaction_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },

      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "user_id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },

      category_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "bill_categories",
          key: "category_id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },

      provider_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "bill_providers",
          key: "provider_id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },

      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      service_charge: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },

      total_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },

      transaction_ref: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },

      vtpass_reference: {
        type: Sequelize.STRING(100),
      },

      token: {
        type: Sequelize.STRING(200),
      },

      expiry_date: {
        type: Sequelize.DATE,
      },

      status: {
        type: Sequelize.ENUM("pending", "success", "failed"),
        allowNull: false,
        defaultValue: "pending",
      },

      payment_method: {
        type: Sequelize.STRING(50),
      },

      customer_info: {
        type: Sequelize.STRING(100),
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("bill_transactions");
  },
};