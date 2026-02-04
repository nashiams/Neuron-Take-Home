'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Request extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Request.init({
    id: DataTypes.STRING,
    type: DataTypes.STRING,
    submitted_by: DataTypes.STRING,
    submitted_at: DataTypes.DATE,
    status: DataTypes.STRING,
    approved_by: DataTypes.STRING,
    approved_at: DataTypes.DATE,
    rejected_by: DataTypes.STRING,
    rejected_at: DataTypes.DATE,
    details: DataTypes.JSONB,
    notes: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Request',
  });
  return Request;
};