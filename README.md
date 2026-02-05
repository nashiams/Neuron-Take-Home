# PT Maju Jaya Approval System

A web-based approval system for PT Maju Jaya Manufaktur to manage employee requests (leave, purchase, overtime) with proper approval workflows.

## Tech Stack

### Backend

- **Node.js** with **Express.js** - RESTful API server
- **PostgreSQL** - Relational database for structured data
- **Sequelize ORM** - Database migrations and models
- **JWT** - Authentication and authorization
- **bcrypt** - Password hashing
- **Docker** - Containerization

### Frontend

- **React 18** with **Vite** - Fast development and optimized builds
- **React Router** - Client-side routing
- **Zustand** - Lightweight state management
- **Axios** - HTTP client
- **Bootstrap 5** - UI components and responsive design

### DevOps

- **Docker Compose** - Multi-container orchestration
- **Jest & Supertest** - Backend testing

## Features

- User authentication with JWT
- Role-based access control (Employee/Manager)
- Create requests (Leave, Purchase, Overtime)
- View personal request history
- Manager: View pending approvals from subordinates
- Manager: Approve/Reject requests
- Manager: View approval history
- Manager: Register new employees
- Dark theme with GitHub color palette

## Installation & Setup

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- PostgreSQL (if running locally without Docker)


1. **Clone the repository**

```bash
git clone <repository-url>
cd Neuron-Take-Home
```

2. **Configure environment variables**

```bash
cd deployment
cp .env.example .env
# Edit .env file with your configuration
```

3. **Build and run containers**

```bash
docker compose up --build
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- PostgreSQL: localhost:5432

## Environment Variables

Create `deployment/.env` file:

```env
# Database Configuration
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=approval_system
DB_HOST=localhost
DB_PORT=5432

# JWT Secret
JWT_SECRET=my-super-secret-jwt-key-change-in-production

# Node Environment
NODE_ENV=development
```

## Test Credentials

### Employees

```
Email: joko.s@ptmajujaya.co.id
Password: Joko20200203
Role: Production Operator
```

### Managers

```
Email: agus.supriyadi@ptmajujaya.co.id
Password: Agus20160918
Role: Production Manager
```

```
Email: budi.santoso@ptmajujaya.co.id
Password: Budi20150312
Role: Plant Director
```

**Password Format:** FirstName + JoinDate (YYYYMMDD)

## API Endpoints

### Authentication

| Method | Endpoint             | Description                          | Auth Required |
| ------ | -------------------- | ------------------------------------ | ------------- |
| POST   | `/api/auth/login`    | Login with email & password          | No            |
| POST   | `/api/auth/register` | Register new employee (Manager only) | Yes (Manager) |

### Requests

| Method | Endpoint                          | Description                            | Auth Required |
| ------ | --------------------------------- | -------------------------------------- | ------------- |
| POST   | `/api/requests`                   | Create new request                     | Yes           |
| GET    | `/api/requests/my-requests`       | Get user's own requests                | Yes           |
| GET    | `/api/requests/pending-approvals` | Get pending requests from subordinates | Yes (Manager) |
| PATCH  | `/api/requests/:id/approve`       | Approve a request                      | Yes (Manager) |
| PATCH  | `/api/requests/:id/reject`        | Reject a request                       | Yes (Manager) |
| GET    | `/api/requests/my-approvals`      | Get approval history                   | Yes (Manager) |

### Helper Endpoints

| Method | Endpoint                  | Description         | Auth Required |
| ------ | ------------------------- | ------------------- | ------------- |
| GET    | `/api/departments`        | Get all departments | Yes           |
| GET    | `/api/employees/managers` | Get all managers    | Yes           |

## Docker Commands

### Start services

```bash
docker compose up
```

### Start with rebuild

```bash
docker compose up --build
```

### Stop services

```bash
docker compose down
```

### Stop and remove volumes

```bash
docker compose down -v
```

### View logs

```bash
docker compose logs -f backend
docker compose logs -f frontend
```

### Run backend tests

```bash
docker compose exec backend npm test
```

### Run migrations manually

```bash
docker compose exec backend npx sequelize-cli db:migrate
```

### Run seeds manually

```bash
docker compose exec backend npx sequelize-cli db:seed:all
```

### Access database

```bash
docker compose exec db psql -U postgres -d approval_system
```

## Testing

### Backend Tests

```bash
cd backend
npm test
```

Test coverage includes:

- Authentication (login, token validation)
- Request creation (leave, purchase, overtime)
- Manager approval workflow
- Authorization checks
- Complete integration workflows

## Project Structure

```
Neuron-Take-Home/
├── backend/
│   ├── controllers/       # Request handlers
│   ├── models/           # Sequelize models
│   ├── routes/           # API routes
│   ├── middlewares/      # Auth & authorization
│   ├── helpers/          # Utilities (bcrypt, jwt)
│   ├── migrations/       # Database migrations
│   ├── seeders/          # Seed data
│   ├── __test__/         # Jest tests
│   └── app.js            # Express app
├── frontend/client/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── store/        # Zustand store
│   │   └── App.jsx       # Main app
│   └── vite.config.js    # Vite configuration
└── deployment/
    ├── docker-compose.yml
    └── .env              # Environment variables
```

## System Design Consideration

### Future Enhancements

#### 1. Manager Unavailability / Delegation

**Problem:** When a manager is on leave, approval requests are stuck in pending status.

**Proposed Solution:**

**A. Temporary Delegation Table**

```sql
CREATE TABLE approval_delegations (
  id SERIAL PRIMARY KEY,
  manager_id VARCHAR(50) REFERENCES employees(id),
  delegate_id VARCHAR(50) REFERENCES employees(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_by VARCHAR(50) REFERENCES employees(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Implementation Approach:**

- Add a "Delegate Approval Authority" feature in the UI (manager/admin only)
- When fetching pending approvals, check if:
  1. User is the actual manager, OR
  2. User is a current active delegate for that manager
- Middleware: `checkApprovalAuthority(employeeId, managerId, requestDate)`
- On approval/rejection, log both the original manager and the delegate who acted

**Business Rules:**

- Only one active delegate per manager at a time
- Delegation requires director approval for sensitive roles
- Delegations automatically expire after end_date
- Original manager retains visibility of all actions

**B. Escalation Rules**

```javascript
const ESCALATION_RULES = {
  pending_days: 3, // Auto-escalate after 3 days
  escalate_to: "next_level_manager", // or 'director'
};
```

If a request is pending for > 3 days:

- System sends notification to manager's manager
- Director can see all escalated requests in a separate queue

---

#### 2. Multi-Level Approval for High-Value Purchases

**Problem:** Purchase requests > Rp 100 million need director approval after manager approval.

**Proposed Solution:**

**A. Approval Rules Configuration Table**

```sql
CREATE TABLE approval_rules (
  id SERIAL PRIMARY KEY,
  rule_name VARCHAR(100) NOT NULL,
  request_type VARCHAR(20) NOT NULL, -- 'purchase', 'leave', 'overtime'
  conditions JSONB NOT NULL, -- Flexible conditions
  approval_flow JSONB NOT NULL, -- Ordered list of approvers
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Example data
{
  "rule_name": "High Value Purchase Approval",
  "request_type": "purchase",
  "conditions": {
    "estimated_cost_gte": 100000000,
    "currency": "IDR"
  },
  "approval_flow": [
    {
      "level": 1,
      "approver_role": "manager",
      "approver_type": "direct_manager"
    },
    {
      "level": 2,
      "approver_role": "director",
      "approver_type": "role_based",
      "role_filter": "Plant Director"
    }
  ]
}
```

**B. Request Approval Tracking Table**

```sql
CREATE TABLE request_approvals (
  id SERIAL PRIMARY KEY,
  request_id VARCHAR(50) REFERENCES requests(id),
  approval_level INT NOT NULL,
  required_approver_role VARCHAR(100),
  approved_by VARCHAR(50) REFERENCES employees(id),
  approved_at TIMESTAMP,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  notes TEXT
);
```

**Implementation Flow:**

1. **On Request Creation:**

```javascript
async function createRequest(requestData) {
  // Determine applicable approval rules
  const rules = await ApprovalRule.findApplicableRules(requestData);

  // Create request
  const request = await Request.create(requestData);

  // Initialize approval tracking
  for (const level of rules.approval_flow) {
    await RequestApproval.create({
      request_id: request.id,
      approval_level: level.level,
      required_approver_role: level.approver_role,
      status: "pending",
    });
  }
}
```

2. **On Approval:**

```javascript
async function approveRequest(requestId, approverId) {
  // Get current approval level
  const currentLevel = await RequestApproval.findOne({
    where: { request_id: requestId, status: "pending" },
    order: [["approval_level", "ASC"]],
  });

  // Verify approver has authority for this level
  if (!canApproveLevel(approverId, currentLevel)) {
    throw new Error("Unauthorized");
  }

  // Mark current level as approved
  await currentLevel.update({
    approved_by: approverId,
    approved_at: new Date(),
    status: "approved",
  });

  // Check if there are more levels
  const nextLevel = await RequestApproval.findOne({
    where: { request_id: requestId, status: "pending" },
    order: [["approval_level", "ASC"]],
  });

  if (!nextLevel) {
    // All levels approved - mark request as approved
    await Request.update(
      { status: "approved", approved_at: new Date() },
      { where: { id: requestId } },
    );
  }
  // Otherwise, request stays 'pending' for next level
}
```

3. **UI Changes:**

- Requests show approval progress: "Level 1/2 Approved"
- Different queues for different approval levels
- Directors see "Awaiting Director Approval" queue
- Managers see their level queue

**C. Configuration UI (Admin Panel)**

Add an admin interface where authorized users can:

- Create new approval rules
- Define conditions (amount thresholds, request types)
- Set approval flows (who approves at each level)
- Activate/deactivate rules
- View rule audit log

**Example Rules Configuration:**

```javascript
[
  {
    name: "Standard Purchase",
    type: "purchase",
    conditions: { max_cost: 100000000 },
    flow: [{ level: 1, role: "direct_manager" }],
  },
  {
    name: "High Value Purchase",
    type: "purchase",
    conditions: { min_cost: 100000000 },
    flow: [
      { level: 1, role: "direct_manager" },
      { level: 2, role: "director" },
    ],
  },
  {
    name: "Extended Leave",
    type: "leave",
    conditions: { days_gte: 5 },
    flow: [
      { level: 1, role: "direct_manager" },
      { level: 2, role: "hr_manager" },
    ],
  },
];
```

**Benefits:**

- ✅ Non-technical users can modify approval workflows
- ✅ Flexible rule engine supports complex conditions
- ✅ Clear audit trail of who approved at each level
- ✅ System scales to any number of approval levels
- ✅ Rules can be tested before activation
- ✅ No code changes needed for business logic updates

---

### Technology Choices for Configurable Workflows

For production implementation, consider:

1. **Rules Engine:** Use a library like `json-rules-engine` for complex condition evaluation
2. **Workflow State Machine:** Implement using `xstate` for predictable state transitions
3. **Admin UI:** Build with React Admin or similar for rapid development
4. **Versioning:** Track rule changes with version history for compliance

This approach provides flexibility while maintaining system integrity and auditability.

## AI Tool Usage

This project was developed with assistance from **Claude (Sonnet 3.5)**. Here's how AI was leveraged:

### Most Helpful

- **Boilerplate generation:** Quickly scaffolded Express routes, controllers, and React components
- **Database schema design:** Helped design normalized tables with proper foreign keys
- **Testing:** Generated comprehensive test cases covering success and failure scenarios
- **Docker configuration:** Set up multi-container environment with proper healthchecks

### Less Helpful

- **Business logic:** Required significant human judgment for approval workflow rules
- **UI/UX decisions:** Needed manual refinement for user experience and visual consistency
- **Error handling:** AI-generated error handling was too generic, needed customization
- **Authorization logic:** Complex authorization rules (who can approve what) required careful manual implementation

### Corrections Made

- Fixed sequelize migration ordering issues
- Corrected JWT token verification in middleware
- Adjusted frontend API error handling for better user feedback
- Refined authorization middleware to properly check manager-subordinate relationships

**Key Takeaway:** AI excels at generating patterns and structures, but critical thinking is essential for business logic, security, and user experience decisions.

## License

MIT
