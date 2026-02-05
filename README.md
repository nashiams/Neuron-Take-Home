# PT Maju Jaya Approval System

A web-based approval system for PT Maju Jaya Manufaktur to manage employee requests (leave, purchase, overtime) with proper approval workflows.

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
