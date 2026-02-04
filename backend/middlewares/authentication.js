const { verifyToken } = require("../helpers/jwt");
const { Employee } = require("../models");

async function authentication(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw { name: "Unauthorized", message: "Token not provided" };
    }

    const token = authHeader.split(" ")[1];

    const payload = verifyToken(token);

    const employee = await Employee.findByPk(payload.id);

    if (!employee) {
      throw { name: "Unauthorized", message: "Invalid token" };
    }

    // Attach employee to request
    req.employee = {
      id: employee.id,
      email: employee.email,
      name: employee.name,
      role: employee.role,
      department_id: employee.department_id,
      manager_id: employee.manager_id,
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      next({ name: "Unauthorized", message: "Invalid token" });
    } else {
      next(error);
    }
  }
}

module.exports = authentication;
