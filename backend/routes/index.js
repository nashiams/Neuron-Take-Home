const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");
const requestRoutes = require("./requestRoutes");
const authentication = require("../middlewares/authentication");
const EmployeeController = require("../controllers/employeeController");

router.get("/", (req, res) => {
  res.status(200).json({
    message: "PT Maju Jaya Approval System API",
    status: "running",
  });
});

router.use("/api/auth", authRoutes);
router.use("/api/requests", requestRoutes);

router.get(
  "/api/departments",
  authentication,
  EmployeeController.getDepartments,
);
router.get(
  "/api/employees/managers",
  authentication,
  EmployeeController.getManagers,
);

module.exports = router;
