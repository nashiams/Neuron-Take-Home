"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    static associate(models) {
      Employee.belongsTo(models.Department, {
        foreignKey: "department_id",
        as: "department",
      });

      Employee.belongsTo(models.Employee, {
        foreignKey: "manager_id",
        as: "manager",
      });

      Employee.hasMany(models.Employee, {
        foreignKey: "manager_id",
        as: "subordinates",
      });

      Employee.hasMany(models.Request, {
        foreignKey: "submitted_by",
        as: "submitted_requests",
      });

      Employee.hasMany(models.Request, {
        foreignKey: "approved_by",
        as: "approved_requests",
      });

      Employee.hasMany(models.Request, {
        foreignKey: "rejected_by",
        as: "rejected_requests",
      });
    }
  }

  Employee.init(
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
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      department_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      manager_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "active",
      },
      join_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Employee",
      tableName: "Employees",
    },
  );

  return Employee;
};
