const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");
const requestRoutes = require("./requestRoutes");

router.get("/", (req, res) => {
  res.status(200).json({
    message: "PT Maju Jaya Approval System API",
    status: "running",
  });
});

router.use("/api/auth", authRoutes);
router.use("/api/requests", requestRoutes);

module.exports = router;
