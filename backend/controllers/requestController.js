const { Request, Employee } = require("../models");
const { Op } = require("sequelize");

class RequestController {
  static async createRequest(req, res, next) {
    try {
      const { type, details, notes } = req.body;
      const submittedBy = req.employee.id;

      if (!type || !details) {
        throw { name: "BadRequest", message: "Type and details are required" };
      }

      const allRequests = await Request.findAll({
        attributes: ["id"],
        order: [["id", "DESC"]],
      });

      let newId = "req-001";
      if (allRequests.length > 0) {
        const numbers = allRequests.map((r) => parseInt(r.id.split("-")[1]));
        const maxNumber = Math.max(...numbers);
        newId = `req-${String(maxNumber + 1).padStart(3, "0")}`;
      }

      // Check if user is a top-level manager (no manager_id)
      const isTopLevelManager = req.employee.manager_id === null;

      const newRequest = await Request.create({
        id: newId,
        type,
        submitted_by: submittedBy,
        submitted_at: new Date(),
        status: isTopLevelManager ? "approved" : "pending",
        approved_by: isTopLevelManager ? submittedBy : null,
        approved_at: isTopLevelManager ? new Date() : null,
        details,
        notes: isTopLevelManager
          ? notes
            ? `${notes} (Auto-approved - Top-level authority)`
            : "Auto-approved - Top-level authority"
          : notes || null,
      });

      const requestWithDetails = await Request.findByPk(newId, {
        include: [
          {
            association: "submitter",
            attributes: ["id", "name", "email", "role"],
          },
          ...(isTopLevelManager
            ? [
                {
                  association: "approver",
                  attributes: ["id", "name", "email", "role"],
                },
              ]
            : []),
        ],
      });

      res.status(201).json({
        message: isTopLevelManager
          ? "Request created and auto-approved (Top-level authority)"
          : "Request created successfully",
        request: requestWithDetails,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMyRequests(req, res, next) {
    try {
      const employeeId = req.employee.id;

      const requests = await Request.findAll({
        where: { submitted_by: employeeId },
        include: [
          {
            association: "approver",
            attributes: ["id", "name", "email"],
          },
          {
            association: "rejecter",
            attributes: ["id", "name", "email"],
          },
        ],
        order: [["submitted_at", "DESC"]],
      });

      res.status(200).json({
        message: "Requests retrieved successfully",
        requests,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPendingApprovals(req, res, next) {
    try {
      const managerId = req.employee.id;

      const subordinates = await Employee.findAll({
        where: { manager_id: managerId },
        attributes: ["id"],
      });

      const subordinateIds = subordinates.map((sub) => sub.id);

      const requests = await Request.findAll({
        where: {
          submitted_by: { [Op.in]: subordinateIds },
          status: "pending",
        },
        include: [
          {
            association: "submitter",
            attributes: ["id", "name", "email", "role"],
            include: [
              {
                association: "department",
                attributes: ["id", "name"],
              },
            ],
          },
        ],
        order: [["submitted_at", "ASC"]],
      });

      res.status(200).json({
        message: "Pending approvals retrieved successfully",
        requests,
      });
    } catch (error) {
      next(error);
    }
  }

  static async approveRequest(req, res, next) {
    try {
      const { id } = req.params;
      const { notes } = req.body;
      const managerId = req.employee.id;

      const request = await Request.findByPk(id, {
        include: [
          {
            association: "submitter",
            attributes: ["id", "name", "manager_id"],
          },
        ],
      });

      if (!request) {
        throw { name: "Not Found", message: "Request not found" };
      }

      if (request.status !== "pending") {
        throw { name: "BadRequest", message: "Request is not pending" };
      }

      // Prevent self-approval
      if (request.submitted_by === managerId) {
        throw {
          name: "Forbidden",
          message: "You cannot approve your own request",
        };
      }

      if (request.submitter.manager_id !== managerId) {
        throw {
          name: "Forbidden",
          message: "You are not authorized to approve this request",
        };
      }

      await request.update({
        status: "approved",
        approved_by: managerId,
        approved_at: new Date(),
        notes: notes || request.notes,
      });

      const updatedRequest = await Request.findByPk(id, {
        include: [
          {
            association: "submitter",
            attributes: ["id", "name", "email"],
          },
          {
            association: "approver",
            attributes: ["id", "name", "email"],
          },
        ],
      });

      res.status(200).json({
        message: "Request approved successfully",
        request: updatedRequest,
      });
    } catch (error) {
      next(error);
    }
  }

  static async rejectRequest(req, res, next) {
    try {
      const { id } = req.params;
      const { notes } = req.body;
      const managerId = req.employee.id;

      const request = await Request.findByPk(id, {
        include: [
          {
            association: "submitter",
            attributes: ["id", "name", "manager_id"],
          },
        ],
      });

      if (!request) {
        throw { name: "Not Found", message: "Request not found" };
      }

      if (request.status !== "pending") {
        throw { name: "BadRequest", message: "Request is not pending" };
      }

      // Prevent self-rejection
      if (request.submitted_by === managerId) {
        throw {
          name: "Forbidden",
          message: "You cannot reject your own request",
        };
      }

      if (request.submitter.manager_id !== managerId) {
        throw {
          name: "Forbidden",
          message: "You are not authorized to reject this request",
        };
      }

      await request.update({
        status: "rejected",
        rejected_by: managerId,
        rejected_at: new Date(),
        notes: notes || request.notes,
      });

      const updatedRequest = await Request.findByPk(id, {
        include: [
          {
            association: "submitter",
            attributes: ["id", "name", "email"],
          },
          {
            association: "rejecter",
            attributes: ["id", "name", "email"],
          },
        ],
      });

      res.status(200).json({
        message: "Request rejected successfully",
        request: updatedRequest,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMyApprovals(req, res, next) {
    try {
      const managerId = req.employee.id;

      const requests = await Request.findAll({
        where: {
          [Op.or]: [{ approved_by: managerId }, { rejected_by: managerId }],
        },
        include: [
          {
            association: "submitter",
            attributes: ["id", "name", "email", "role"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({
        message: "Approval history retrieved successfully",
        requests,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = RequestController;
