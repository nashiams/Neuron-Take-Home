const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");
const authentication = require("../middlewares/authentication");
const { isManager } = require("../middlewares/authorization");

router.post("/login", AuthController.login);

router.post("/register", authentication, isManager, AuthController.register);

module.exports = router;
