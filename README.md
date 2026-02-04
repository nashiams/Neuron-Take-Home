# Neuron-Take-Home

## Background

Welcome to our engineering assessment. This exercise is designed to reflect the kind of work we do day-to-day — building real solutions for real clients with imperfect information.

Please read this entire document before you begin.

---

## The Client

**PT Maju Jaya Manufaktur** is a mid-size manufacturing company based in Cikarang, West Java, with administrative offices in Jakarta. They have around 25 employees across departments including Production, Finance, HR, Procurement, QA, Warehouse, and IT.

## The Problem

The company currently handles all internal approvals through WhatsApp groups and email. When an employee needs to request something — a purchase, time off, overtime — they message their manager on WhatsApp or send an email. The manager replies "ok" or "no." Sometimes managers forget to reply. Sometimes the request gets buried in a group chat. There is no single place to see what's been requested, what's been approved, or what's still waiting.

The company's HR team recently tried to compile a history of past requests by going through WhatsApp chats and emails. They exported what they could into a spreadsheet, which we've converted to JSON for you (see the attached JSON files).

## What They Want

The client has asked us to build a simple web-based approval system. Here's what they told us in the kickoff meeting (paraphrased):

> "We need a place where our employees can submit requests — purchases, leave, overtime, things like that. And then the right person can approve or reject them. Everyone should be able to see where their request stands. Oh, and it would be nice to have some kind of history or log so we can look back at what was approved and when. We don't need anything fancy, just something that works and is better than WhatsApp."

That's essentially all the detail we got from the client.

## Your Task

Build a working web application that addresses the client's needs. Use the provided seed data to populate the system with the historical data the HR team compiled.

## Frontend Pages ↔ Backend Routes Mapping

Frontend PageBackend Routes Used

1. Login pagePOST /api/auth/login
2. Create request formPOST /api/requests
3. My request historyGET /api/requests/my-requests
4. Pending requests (manager)GET /api/requests/pending-approvals PATCH /api/requests/:id/approve PATCH /api/requests/:id/reject
5. My approved history (manager)GET /api/requests/my-approvals

-- 1. departments table
CREATE TABLE departments (
id VARCHAR(50) PRIMARY KEY,
name VARCHAR(100) NOT NULL,
location VARCHAR(100) NOT NULL
);

-- 2. employees table
CREATE TABLE employees (
id VARCHAR(50) PRIMARY KEY,
name VARCHAR(100) NOT NULL,
email VARCHAR(100) UNIQUE NOT NULL,
role VARCHAR(100) NOT NULL,
department_id VARCHAR(50) NOT NULL,
manager_id VARCHAR(50),
status VARCHAR(20) DEFAULT 'active',
join_date DATE NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

FOREIGN KEY (department_id) REFERENCES departments(id),
FOREIGN KEY (manager_id) REFERENCES employees(id)
);

-- 3. requests table
CREATE TABLE requests (
id VARCHAR(50) PRIMARY KEY,
type VARCHAR(20) NOT NULL, -- 'purchase', 'leave', 'overtime'
submitted_by VARCHAR(50) NOT NULL,
submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
approved_by VARCHAR(50),
approved_at TIMESTAMP,
rejected_by VARCHAR(50),
rejected_at TIMESTAMP,
details JSONB NOT NULL, -- Store type-specific details as JSON
notes TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

FOREIGN KEY (submitted_by) REFERENCES employees(id),
FOREIGN KEY (approved_by) REFERENCES employees(id),
FOREIGN KEY (rejected_by) REFERENCES employees(id)
);

-- Indexes for performance
CREATE INDEX idx_requests_submitted_by ON requests(submitted_by);
CREATE INDEX idx_requests_status ON requests(status);
CREATE INDEX idx_requests_approved_by ON requests(approved_by);
CREATE INDEX idx_requests_rejected_by ON requests(rejected_by);
CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_employees_department_id ON employees(department_id);
