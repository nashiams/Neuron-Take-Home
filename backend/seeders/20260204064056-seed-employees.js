"use strict";

const {
  generatePasswordFromEmployee,
  hashPassword,
} = require("../helpers/bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const employees = require("./data/employees.json");

    const data = await Promise.all(
      employees.map(async (emp) => {
        const plainPassword = generatePasswordFromEmployee(
          emp.name,
          emp.join_date,
        );
        const hashedPassword = await hashPassword(plainPassword);

        return {
          ...emp,
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }),
    );

    await queryInterface.bulkInsert("Employees", data, {
      ignoreDuplicates: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Employees", null, {});
  },
};
