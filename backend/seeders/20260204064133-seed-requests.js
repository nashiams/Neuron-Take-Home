"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require("./data/requests.json").map((req) => {
      req.details = JSON.stringify(req.details);
      req.createdAt = new Date();
      req.updatedAt = new Date();
      return req;
    });

    await queryInterface.bulkInsert("Requests", data, {
      ignoreDuplicates: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Requests", null, {});
  },
};
