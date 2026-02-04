const request = require("supertest");
const { execSync } = require("child_process");
const app = require("../app");

// Test credentials
const testUsers = {
  employee: {
    email: "joko.s@ptmajujaya.co.id",
    password: "Joko20200203",
    id: "emp-017",
    name: "Joko Susanto",
    managerId: "emp-016",
  },
  manager: {
    email: "agus.supriyadi@ptmajujaya.co.id",
    password: "Agus20160918",
    id: "emp-016",
    name: "Agus Supriyadi",
  },
  director: {
    email: "budi.santoso@ptmajujaya.co.id",
    password: "Budi20150312",
    id: "emp-001",
    name: "Budi Santoso",
  },
  nonManager: {
    email: "ahmad.hidayat@ptmajujaya.co.id",
    password: "Ahmad20190115",
    id: "emp-003",
    name: "Ahmad Hidayat",
  },
};

// Helper function to get auth token
async function getAuthToken(userType = "employee") {
  const user = testUsers[userType];
  const response = await request(app).post("/api/auth/login").send({
    email: user.email,
    password: user.password,
  });
  return response.body.token;
}

// Setup and teardown database
beforeAll(async () => {
  console.log("🗑️  Setting up test database...");

  try {
    // Drop database
    execSync("npx sequelize-cli db:drop --env test", { stdio: "ignore" });
  } catch (error) {
    // Database doesn't exist, continue
  }

  // Create database
  execSync("npx sequelize-cli db:create --env test", { stdio: "inherit" });

  // Run migrations
  execSync("npx sequelize-cli db:migrate --env test", { stdio: "inherit" });

  // Run seeds
  execSync("npx sequelize-cli db:seed:all --env test", { stdio: "inherit" });

  console.log("✅ Test database ready!");
});

afterAll(async () => {
  console.log("🧹 Cleaning up test database...");
  try {
    execSync("npx sequelize-cli db:drop --env test", { stdio: "ignore" });
  } catch (error) {
    // Ignore errors
  }
});

describe("PT Maju Jaya Approval System - Complete Test Suite", () => {
  // ========== HEALTH CHECK ==========
  describe("GET / - Health Check", () => {
    test.only("should return API status", async () => {
      const response = await request(app).get("/");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "PT Maju Jaya Approval System API",
      );
      expect(response.body).toHaveProperty("status", "running");
    });
  });

  // ========== AUTHENTICATION TESTS ==========
  describe("Authentication API", () => {
    describe("POST /api/auth/login - Success Cases", () => {
      test.only("should login employee successfully", async () => {
        const response = await request(app).post("/api/auth/login").send({
          email: testUsers.employee.email,
          password: testUsers.employee.password,
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
        expect(response.body).toHaveProperty("message", "Login successful");
        expect(response.body.user).toMatchObject({
          id: testUsers.employee.id,
          name: testUsers.employee.name,
          email: testUsers.employee.email,
        });
      });

      test.only("should login manager successfully", async () => {
        const response = await request(app).post("/api/auth/login").send({
          email: testUsers.manager.email,
          password: testUsers.manager.password,
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
        expect(response.body.user.id).toBe(testUsers.manager.id);
      });

      test.only("should login director successfully", async () => {
        const response = await request(app).post("/api/auth/login").send({
          email: testUsers.director.email,
          password: testUsers.director.password,
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
      });
    });

    describe("POST /api/auth/login - Failure Cases", () => {
      test.skip("should fail with invalid email", async () => {
        const response = await request(app).post("/api/auth/login").send({
          email: "nonexistent@example.com",
          password: "SomePassword123",
        });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid email or password");
      });

      test.skip("should fail with invalid password", async () => {
        const response = await request(app).post("/api/auth/login").send({
          email: testUsers.employee.email,
          password: "WrongPassword123",
        });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid email or password");
      });

      test.skip("should fail when email is missing", async () => {
        const response = await request(app)
          .post("/api/auth/login")
          .send({ password: "password123" });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Email and password are required");
      });

      test.skip("should fail when password is missing", async () => {
        const response = await request(app)
          .post("/api/auth/login")
          .send({ email: testUsers.employee.email });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Email and password are required");
      });

      test.skip("should fail when both email and password are missing", async () => {
        const response = await request(app).post("/api/auth/login").send({});

        expect(response.status).toBe(400);
      });
    });
  });

  // ========== REQUEST CREATION TESTS ==========
  describe("POST /api/requests - Create Request", () => {
    let employeeToken;

    beforeAll(async () => {
      employeeToken = await getAuthToken("employee");
    });

    describe("Success Cases", () => {
      test.only("should create leave request successfully", async () => {
        const response = await request(app)
          .post("/api/requests")
          .set("Authorization", `Bearer ${employeeToken}`)
          .send({
            type: "leave",
            details: {
              leave_type: "annual",
              start_date: "2026-03-10",
              end_date: "2026-03-12",
              reason: "Family vacation",
            },
            notes: "Already coordinated with team",
          });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Request created successfully");
        expect(response.body.request).toMatchObject({
          type: "leave",
          status: "pending",
          submitted_by: testUsers.employee.id,
        });
        expect(response.body.request.details).toHaveProperty(
          "leave_type",
          "annual",
        );
      });

      test.only("should create purchase request successfully", async () => {
        const response = await request(app)
          .post("/api/requests")
          .set("Authorization", `Bearer ${employeeToken}`)
          .send({
            type: "purchase",
            details: {
              item_description: "Safety helmets x 20",
              estimated_cost: 5000000,
              currency: "IDR",
              vendor: "PT Safety Indonesia",
              urgency: "high",
            },
          });

        expect(response.status).toBe(201);
        expect(response.body.request.type).toBe("purchase");
        expect(response.body.request.details.item_description).toBe(
          "Safety helmets x 20",
        );
      });

      test.only("should create overtime request successfully", async () => {
        const response = await request(app)
          .post("/api/requests")
          .set("Authorization", `Bearer ${employeeToken}`)
          .send({
            type: "overtime",
            details: {
              date: "2026-02-10",
              hours: 3,
              reason: "Rush order completion",
            },
          });

        expect(response.status).toBe(201);
        expect(response.body.request.type).toBe("overtime");
        expect(response.body.request.details.hours).toBe(3);
      });

      test.only("should create request without notes", async () => {
        const response = await request(app)
          .post("/api/requests")
          .set("Authorization", `Bearer ${employeeToken}`)
          .send({
            type: "leave",
            details: {
              leave_type: "sick",
              start_date: "2026-03-15",
              end_date: "2026-03-16",
              reason: "Medical appointment",
            },
          });

        expect(response.status).toBe(201);
        expect(response.body.request.notes).toBeNull();
      });
    });

    describe("Failure Cases", () => {
      test.skip("should fail without authentication", async () => {
        const response = await request(app)
          .post("/api/requests")
          .send({
            type: "leave",
            details: { leave_type: "annual" },
          });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Token not provided");
      });

      test.skip("should fail with invalid token", async () => {
        const response = await request(app)
          .post("/api/requests")
          .set("Authorization", "Bearer invalid-token-here")
          .send({
            type: "leave",
            details: { leave_type: "annual" },
          });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid token");
      });

      test.skip("should fail when type is missing", async () => {
        const response = await request(app)
          .post("/api/requests")
          .set("Authorization", `Bearer ${employeeToken}`)
          .send({
            details: { leave_type: "annual" },
          });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Type and details are required");
      });

      test.skip("should fail when details is missing", async () => {
        const response = await request(app)
          .post("/api/requests")
          .set("Authorization", `Bearer ${employeeToken}`)
          .send({
            type: "leave",
          });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Type and details are required");
      });

      test.skip("should fail when both type and details are missing", async () => {
        const response = await request(app)
          .post("/api/requests")
          .set("Authorization", `Bearer ${employeeToken}`)
          .send({});

        expect(response.status).toBe(400);
      });
    });
  });

  // ========== GET MY REQUESTS TESTS ==========
  describe("GET /api/requests/my-requests - Get My Requests", () => {
    let employeeToken;

    beforeAll(async () => {
      employeeToken = await getAuthToken("employee");
    });

    test.only("should get employee own requests", async () => {
      const response = await request(app)
        .get("/api/requests/my-requests")
        .set("Authorization", `Bearer ${employeeToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Requests retrieved successfully");
      expect(Array.isArray(response.body.requests)).toBe(true);

      // Should have at least the seeded request req-004
      const ownRequest = response.body.requests.find((r) => r.id === "req-004");
      expect(ownRequest).toBeDefined();
      expect(ownRequest.submitted_by).toBe(testUsers.employee.id);
    });

    test.only("should return empty array if no requests", async () => {
      const nonManagerToken = await getAuthToken("nonManager");
      const response = await request(app)
        .get("/api/requests/my-requests")
        .set("Authorization", `Bearer ${nonManagerToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.requests)).toBe(true);
    });

    test.skip("should fail without authentication", async () => {
      const response = await request(app).get("/api/requests/my-requests");

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Token not provided");
    });

    test.skip("should fail with invalid token", async () => {
      const response = await request(app)
        .get("/api/requests/my-requests")
        .set("Authorization", "Bearer invalid-token");

      expect(response.status).toBe(401);
    });
  });

  // ========== PENDING APPROVALS TESTS ==========
  describe("GET /api/requests/pending-approvals - Get Pending Approvals", () => {
    let managerToken;
    let nonManagerToken;

    beforeAll(async () => {
      managerToken = await getAuthToken("manager");
      nonManagerToken = await getAuthToken("nonManager");
    });

    test.only("should get pending approvals for manager", async () => {
      const response = await request(app)
        .get("/api/requests/pending-approvals")
        .set("Authorization", `Bearer ${managerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        "Pending approvals retrieved successfully",
      );
      expect(Array.isArray(response.body.requests)).toBe(true);

      // All requests should be pending
      response.body.requests.forEach((req) => {
        expect(req.status).toBe("pending");
        expect(req.submitter).toBeDefined();
      });
    });

    test.only("should return empty array if no pending requests", async () => {
      const directorToken = await getAuthToken("director");
      const response = await request(app)
        .get("/api/requests/pending-approvals")
        .set("Authorization", `Bearer ${directorToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.requests)).toBe(true);
    });

    test.skip("should fail for non-manager employee", async () => {
      const response = await request(app)
        .get("/api/requests/pending-approvals")
        .set("Authorization", `Bearer ${nonManagerToken}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe(
        "Access denied. Manager role required",
      );
    });

    test.skip("should fail without authentication", async () => {
      const response = await request(app).get(
        "/api/requests/pending-approvals",
      );

      expect(response.status).toBe(401);
    });
  });

  // ========== APPROVE REQUEST TESTS ==========
  describe("PATCH /api/requests/:id/approve - Approve Request", () => {
    let managerToken;
    let employeeToken;
    let directorToken;
    let testRequestId;

    beforeAll(async () => {
      managerToken = await getAuthToken("manager");
      employeeToken = await getAuthToken("employee");
      directorToken = await getAuthToken("director");

      // Create a request to approve
      const createResponse = await request(app)
        .post("/api/requests")
        .set("Authorization", `Bearer ${employeeToken}`)
        .send({
          type: "leave",
          details: {
            leave_type: "annual",
            start_date: "2026-04-01",
            end_date: "2026-04-03",
            reason: "Test approval",
          },
        });
      testRequestId = createResponse.body.request.id;
    });

    test.only("should approve request successfully by manager", async () => {
      const response = await request(app)
        .patch(`/api/requests/${testRequestId}/approve`)
        .set("Authorization", `Bearer ${managerToken}`)
        .send({
          notes: "Approved for testing",
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Request approved successfully");
      expect(response.body.request).toMatchObject({
        status: "approved",
        approved_by: testUsers.manager.id,
      });
      expect(response.body.request.approved_at).toBeDefined();
    });

    test.only("should approve request without notes", async () => {
      // Create another request
      const createResp = await request(app)
        .post("/api/requests")
        .set("Authorization", `Bearer ${employeeToken}`)
        .send({
          type: "overtime",
          details: { date: "2026-04-05", hours: 2, reason: "Test" },
        });

      const response = await request(app)
        .patch(`/api/requests/${createResp.body.request.id}/approve`)
        .set("Authorization", `Bearer ${managerToken}`)
        .send({});

      expect(response.status).toBe(200);
      expect(response.body.request.status).toBe("approved");
    });

    test.skip("should fail to approve non-existent request", async () => {
      const response = await request(app)
        .patch("/api/requests/req-999999/approve")
        .set("Authorization", `Bearer ${managerToken}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Request not found");
    });

    test.skip("should fail to approve already approved request", async () => {
      const response = await request(app)
        .patch(`/api/requests/${testRequestId}/approve`)
        .set("Authorization", `Bearer ${managerToken}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Request is not pending");
    });

    test.skip("should fail without authentication", async () => {
      const response = await request(app).patch(
        "/api/requests/req-008/approve",
      );

      expect(response.status).toBe(401);
    });

    test.skip("should fail for non-manager", async () => {
      const nonManagerToken = await getAuthToken("nonManager");
      const response = await request(app)
        .patch("/api/requests/req-008/approve")
        .set("Authorization", `Bearer ${nonManagerToken}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe(
        "Access denied. Manager role required",
      );
    });
  });

  // ========== REJECT REQUEST TESTS ==========
  describe("PATCH /api/requests/:id/reject - Reject Request", () => {
    let managerToken;
    let employeeToken;
    let testRequestId;

    beforeAll(async () => {
      managerToken = await getAuthToken("manager");
      employeeToken = await getAuthToken("employee");

      // Create a request to reject
      const createResponse = await request(app)
        .post("/api/requests")
        .set("Authorization", `Bearer ${employeeToken}`)
        .send({
          type: "overtime",
          details: {
            date: "2026-05-10",
            hours: 4,
            reason: "Test rejection",
          },
        });
      testRequestId = createResponse.body.request.id;
    });

    test.only("should reject request successfully by manager", async () => {
      const response = await request(app)
        .patch(`/api/requests/${testRequestId}/reject`)
        .set("Authorization", `Bearer ${managerToken}`)
        .send({
          notes: "Schedule conflict",
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Request rejected successfully");
      expect(response.body.request).toMatchObject({
        status: "rejected",
        rejected_by: testUsers.manager.id,
      });
      expect(response.body.request.rejected_at).toBeDefined();
    });

    test.only("should reject request without notes", async () => {
      // Create another request
      const createResp = await request(app)
        .post("/api/requests")
        .set("Authorization", `Bearer ${employeeToken}`)
        .send({
          type: "leave",
          details: {
            leave_type: "sick",
            start_date: "2026-05-15",
            end_date: "2026-05-16",
            reason: "Test",
          },
        });

      const response = await request(app)
        .patch(`/api/requests/${createResp.body.request.id}/reject`)
        .set("Authorization", `Bearer ${managerToken}`)
        .send({});

      expect(response.status).toBe(200);
      expect(response.body.request.status).toBe("rejected");
    });

    test.skip("should fail to reject non-existent request", async () => {
      const response = await request(app)
        .patch("/api/requests/req-999999/reject")
        .set("Authorization", `Bearer ${managerToken}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Request not found");
    });

    test.skip("should fail to reject already rejected request", async () => {
      const response = await request(app)
        .patch(`/api/requests/${testRequestId}/reject`)
        .set("Authorization", `Bearer ${managerToken}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Request is not pending");
    });

    test.skip("should fail without authentication", async () => {
      const response = await request(app).patch("/api/requests/req-008/reject");

      expect(response.status).toBe(401);
    });
  });

  // ========== GET MY APPROVALS TESTS ==========
  describe("GET /api/requests/my-approvals - Get My Approvals", () => {
    let managerToken;
    let nonManagerToken;

    beforeAll(async () => {
      managerToken = await getAuthToken("manager");
      nonManagerToken = await getAuthToken("nonManager");
    });

    test.only("should get approval history for manager", async () => {
      const response = await request(app)
        .get("/api/requests/my-approvals")
        .set("Authorization", `Bearer ${managerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        "Approval history retrieved successfully",
      );
      expect(Array.isArray(response.body.requests)).toBe(true);

      // Should have approvals from previous tests
      expect(response.body.requests.length).toBeGreaterThan(0);

      // All should be approved or rejected by this manager
      response.body.requests.forEach((req) => {
        const isApprovedByManager = req.approved_by === testUsers.manager.id;
        const isRejectedByManager = req.rejected_by === testUsers.manager.id;
        expect(isApprovedByManager || isRejectedByManager).toBe(true);
      });
    });

    test.skip("should return empty array if no approvals", async () => {
      // Non-manager who never approved anything
      const response = await request(app)
        .get("/api/requests/my-approvals")
        .set("Authorization", `Bearer ${nonManagerToken}`);

      expect(response.status).toBe(403); // Should fail for non-manager
    });

    test.skip("should fail for non-manager", async () => {
      const response = await request(app)
        .get("/api/requests/my-approvals")
        .set("Authorization", `Bearer ${nonManagerToken}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe(
        "Access denied. Manager role required",
      );
    });

    test.skip("should fail without authentication", async () => {
      const response = await request(app).get("/api/requests/my-approvals");

      expect(response.status).toBe(401);
    });
  });

  // ========== INTEGRATION TESTS ==========
  describe("Integration Tests - Complete Workflow", () => {
    test.only("complete workflow: employee creates, manager approves", async () => {
      // 1. Employee logs in
      const loginResponse = await request(app).post("/api/auth/login").send({
        email: testUsers.employee.email,
        password: testUsers.employee.password,
      });

      expect(loginResponse.status).toBe(200);
      const employeeToken = loginResponse.body.token;

      // 2. Employee creates request
      const createResponse = await request(app)
        .post("/api/requests")
        .set("Authorization", `Bearer ${employeeToken}`)
        .send({
          type: "purchase",
          details: {
            item_description: "Integration test item",
            estimated_cost: 1000000,
            currency: "IDR",
            vendor: "Test Vendor",
            urgency: "normal",
          },
          notes: "Integration test",
        });

      expect(createResponse.status).toBe(201);
      const requestId = createResponse.body.request.id;

      // 3. Employee checks their requests
      const myRequestsResponse = await request(app)
        .get("/api/requests/my-requests")
        .set("Authorization", `Bearer ${employeeToken}`);

      expect(myRequestsResponse.status).toBe(200);
      const createdRequest = myRequestsResponse.body.requests.find(
        (r) => r.id === requestId,
      );
      expect(createdRequest).toBeDefined();
      expect(createdRequest.status).toBe("pending");

      // 4. Manager logs in
      const managerLoginResponse = await request(app)
        .post("/api/auth/login")
        .send({
          email: testUsers.manager.email,
          password: testUsers.manager.password,
        });

      const managerToken = managerLoginResponse.body.token;

      // 5. Manager sees pending request
      const pendingResponse = await request(app)
        .get("/api/requests/pending-approvals")
        .set("Authorization", `Bearer ${managerToken}`);

      expect(pendingResponse.status).toBe(200);
      const pendingRequest = pendingResponse.body.requests.find(
        (r) => r.id === requestId,
      );
      expect(pendingRequest).toBeDefined();

      // 6. Manager approves request
      const approveResponse = await request(app)
        .patch(`/api/requests/${requestId}/approve`)
        .set("Authorization", `Bearer ${managerToken}`)
        .send({
          notes: "Integration test approval",
        });

      expect(approveResponse.status).toBe(200);
      expect(approveResponse.body.request.status).toBe("approved");

      // 7. Employee checks request status
      const finalCheckResponse = await request(app)
        .get("/api/requests/my-requests")
        .set("Authorization", `Bearer ${employeeToken}`);

      const approvedRequest = finalCheckResponse.body.requests.find(
        (r) => r.id === requestId,
      );
      expect(approvedRequest.status).toBe("approved");
      expect(approvedRequest.approved_by).toBe(testUsers.manager.id);
    });

    test.only("complete workflow: employee creates, manager rejects", async () => {
      const employeeToken = await getAuthToken("employee");
      const managerToken = await getAuthToken("manager");

      // Create request
      const createResponse = await request(app)
        .post("/api/requests")
        .set("Authorization", `Bearer ${employeeToken}`)
        .send({
          type: "overtime",
          details: {
            date: "2026-06-01",
            hours: 10,
            reason: "Too much overtime test",
          },
        });

      const requestId = createResponse.body.request.id;

      // Reject request
      const rejectResponse = await request(app)
        .patch(`/api/requests/${requestId}/reject`)
        .set("Authorization", `Bearer ${managerToken}`)
        .send({
          notes: "Excessive hours requested",
        });

      expect(rejectResponse.status).toBe(200);
      expect(rejectResponse.body.request.status).toBe("rejected");
      expect(rejectResponse.body.request.notes).toBe(
        "Excessive hours requested",
      );
    });
  });

  // ========== EDGE CASES ==========
  describe("Edge Cases and Security Tests", () => {
    test.skip("should not allow bearer token without Bearer prefix", async () => {
      const token = await getAuthToken("employee");
      const response = await request(app)
        .get("/api/requests/my-requests")
        .set("Authorization", token);

      expect(response.status).toBe(401);
    });

    test.skip("should not allow empty bearer token", async () => {
      const response = await request(app)
        .get("/api/requests/my-requests")
        .set("Authorization", "Bearer ");

      expect(response.status).toBe(401);
    });

    test.skip("should generate sequential request IDs", async () => {
      const employeeToken = await getAuthToken("employee");

      const response1 = await request(app)
        .post("/api/requests")
        .set("Authorization", `Bearer ${employeeToken}`)
        .send({
          type: "leave",
          details: {
            leave_type: "annual",
            start_date: "2026-07-01",
            end_date: "2026-07-02",
            reason: "test",
          },
        });

      const response2 = await request(app)
        .post("/api/requests")
        .set("Authorization", `Bearer ${employeeToken}`)
        .send({
          type: "leave",
          details: {
            leave_type: "annual",
            start_date: "2026-07-03",
            end_date: "2026-07-04",
            reason: "test",
          },
        });

      const id1Num = parseInt(response1.body.request.id.split("-")[1]);
      const id2Num = parseInt(response2.body.request.id.split("-")[1]);

      expect(id2Num).toBe(id1Num + 1);
    });
  });
});
