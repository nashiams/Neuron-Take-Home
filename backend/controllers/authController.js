const { Employee } = require("../models");
const { comparePassword, hashPassword } = require("../helpers/bcrypt");
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

      const isPasswordValid = await comparePassword(
        password,
        employee.password,
      );

      if (!isPasswordValid) {
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

  static async register(req, res, next) {
    try {
      const { name, email, password, role, department_id, manager_id } =
        req.body;

      if (!name || !email || !password || !role || !department_id) {
        throw {
          name: "BadRequest",
          message: "Name, email, password, role, and department are required",
        };
      }

      const lastEmployee = await Employee.findOne({
        order: [["id", "DESC"]],
      });

      let newId = "emp-001";
      if (lastEmployee) {
        const lastNum = parseInt(lastEmployee.id.split("-")[1]);
        newId = `emp-${String(lastNum + 1).padStart(3, "0")}`;
      }

      const hashedPassword = await hashPassword(password);

      const newEmployee = await Employee.create({
        id: newId,
        name,
        email,
        password: hashedPassword,
        role,
        department_id,
        manager_id: manager_id || null,
        status: "active",
        join_date: new Date(),
      });

      res.status(201).json({
        message: "Employee registered successfully",
        employee: {
          id: newEmployee.id,
          name: newEmployee.name,
          email: newEmployee.email,
          role: newEmployee.role,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
