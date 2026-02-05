const { Employee, Department } = require("../models");

class EmployeeController {
  static async getDepartments(req, res, next) {
    try {
      const departments = await Department.findAll({
        attributes: ["id", "name", "location"],
        order: [["name", "ASC"]],
      });

      res.status(200).json({ departments });
    } catch (error) {
      next(error);
    }
  }

  static async getManagers(req, res, next) {
    try {
      const managers = await Employee.findAll({
        where: {
          role: {
            [require("sequelize").Op.or]: [
              { [require("sequelize").Op.like]: "%Manager%" },
              { [require("sequelize").Op.like]: "%Director%" },
            ],
          },
        },
        attributes: ["id", "name", "role"],
        order: [["name", "ASC"]],
      });

      res.status(200).json({ managers });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = EmployeeController;
