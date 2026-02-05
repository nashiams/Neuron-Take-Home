"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Department extends Model {
    static associate(models) {
      Department.hasMany(models.Employee, {
        foreignKey: "department_id",
        as: "employees",
      });
    }
  }

  Department.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Department",
      tableName: "Departments",
    },
  );

  return Department;
};
