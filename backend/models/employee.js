'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Employee.init({
    id: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    role: DataTypes.STRING,
    department_id: DataTypes.STRING,
    manager_id: DataTypes.STRING,
    status: DataTypes.STRING,
    join_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Employee',
  });
  return Employee;
};