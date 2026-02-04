const express = require("express");
const router = express.Router();
const RequestController = require("../controllers/requestController");
const authentication = require("../middlewares/authentication");
const { isManager } = require("../middlewares/authorization");

router.use(authentication);

router.post("/", RequestController.createRequest);

router.get("/my-requests", RequestController.getMyRequests);

router.get(
  "/pending-approvals",
  isManager,
  RequestController.getPendingApprovals,
);

router.patch("/:id/approve", isManager, RequestController.approveRequest);

router.patch("/:id/reject", isManager, RequestController.rejectRequest);

router.get("/my-approvals", isManager, RequestController.getMyApprovals);

module.exports = router;
