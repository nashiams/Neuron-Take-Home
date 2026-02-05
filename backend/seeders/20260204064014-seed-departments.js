"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require("./data/departments.json").map((dept) => {
      dept.createdAt = new Date();
      dept.updatedAt = new Date();
      return dept;
    });

    await queryInterface.bulkInsert("Departments", data, {
      ignoreDuplicates: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Departments", null, {});
  },
};
