"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require("./data/employees.json").map((emp) => {
      emp.createdAt = new Date();
      emp.updatedAt = new Date();
      return emp;
    });

    await queryInterface.bulkInsert("Employees", data, {
      ignoreDuplicates: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Employees", null, {});
  },
};
