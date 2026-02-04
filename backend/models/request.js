"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Request extends Model {
    static associate(models) {
      Request.belongsTo(models.Employee, {
        foreignKey: "submitted_by",
        as: "submitter",
      });

      Request.belongsTo(models.Employee, {
        foreignKey: "approved_by",
        as: "approver",
      });

      Request.belongsTo(models.Employee, {
        foreignKey: "rejected_by",
        as: "rejecter",
      });
    }
  }

  Request.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      submitted_by: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      submitted_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "pending",
      },
      approved_by: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      approved_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      rejected_by: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      rejected_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      details: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Request",
      tableName: "Requests",
    },
  );

  return Request;
};
