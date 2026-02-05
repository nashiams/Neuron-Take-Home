const { Employee } = require("../models");

async function isManager(req, res, next) {
  try {
    const employeeId = req.employee.id;

    const subordinatesCount = await Employee.count({
      where: { manager_id: employeeId },
    });

    if (subordinatesCount === 0) {
      throw {
        name: "Forbidden",
        message: "Access denied. Manager role required",
      };
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { isManager };
