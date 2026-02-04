const { Employee } = require("../models");
const { generatePasswordFromEmployee } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");

class AuthController {
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw {
          name: "BadRequest",
          message: "Email and password are required",
        };
      }

      const employee = await Employee.findOne({
        where: { email },
        include: [
          {
            association: "department",
            attributes: ["id", "name"],
          },
        ],
      });

      if (!employee) {
        throw { name: "Unauthorized", message: "Invalid email or password" };
      }

      const expectedPassword = generatePasswordFromEmployee(
        employee.name,
        employee.join_date,
      );

      if (password !== expectedPassword) {
        throw { name: "Unauthorized", message: "Invalid email or password" };
      }

      const payload = {
        id: employee.id,
        email: employee.email,
        name: employee.name,
        role: employee.role,
        department_id: employee.department_id,
        manager_id: employee.manager_id,
      };

      const token = signToken(payload);

      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: employee.id,
          name: employee.name,
          email: employee.email,
          role: employee.role,
          department: employee.department,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
