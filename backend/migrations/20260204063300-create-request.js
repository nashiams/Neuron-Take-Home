"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Requests", {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      submitted_by: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "Employees",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      submitted_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: "pending",
      },
      approved_by: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: "Employees",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      approved_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      rejected_by: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: "Employees",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      rejected_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      details: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex("Requests", ["submitted_by"]);
    await queryInterface.addIndex("Requests", ["status"]);
    await queryInterface.addIndex("Requests", ["approved_by"]);
    await queryInterface.addIndex("Requests", ["rejected_by"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Requests");
  },
};
