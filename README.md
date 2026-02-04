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

### Technical Preferences

We work primarily with **React, TypeScript, Vite, Tailwind CSS, and shadcn/ui** on the frontend, and **Node.js with Express or Fastify** on the backend. You're welcome to use these or other technologies you're most productive with — just be prepared to explain your choices.

### AI Tools

We actively encourage the use of AI coding tools — Claude Code, Cursor, GitHub Copilot, ChatGPT, or whatever you normally use. AI-assisted development is part of our standard workflow, and knowing how to leverage these tools effectively is a skill we value.

If you do use AI tools, please include a brief section in your README describing:

- Which tools you used and for what
- Where the AI was most and least helpful
- Any AI-generated output you had to significantly correct or rethink

We're not testing whether you can code without AI — we're testing whether you can **direct AI effectively** to solve a real problem and **maintain ownership of the result**. You should be able to explain and defend every decision in your codebase, regardless of how it was produced.

### What to Submit

- A GitHub repository with your solution
- The application should run locally with minimal setup (ideally `npm install` and a start command or two)
- A **README** explaining your approach, the decisions you made, and anything else you think is important

### Time Guidance

- You have **5 calendar days** from receiving this assignment
- We expect roughly **4–6 hours** of focused work — please don't spend an entire weekend on this
- We'd rather see a well-thought-out partial solution than a rushed complete one

### What Happens Next

After you submit, we'll schedule a **45–60 minute technical discussion** where we'll talk through your solution — the decisions you made, the tradeoffs you considered, and how you'd evolve the system. We're more interested in how you think than in pixel-perfect UI.

---

## Seed Data

We've shared three JSON files along with this brief:

- **`departments.json`** — Company departments
- **`employees.json`** — Employee roster with reporting relationships
- **`requests.json`** — Historical approval requests compiled from WhatsApp and email records

This data reflects what the client gave us. Import it however you see fit.

---

## System Design Consideration

During our discussion, we'd like to explore how this system might evolve. In particular, the client mentioned two things that could come up in a future phase:

1. **"What happens when a manager is on leave or unavailable for an extended period?"**
2. **"For purchase requests above Rp 100 juta (100 million), we probably need the director to also approve, not just the department manager."**

You don't need to implement these, but we'd love to hear how you'd approach making the approval workflow **configurable** — so the company could adjust approval rules without needing a developer to change code every time.

Think about this and be prepared to discuss your approach. If you'd like, you can include a brief write-up in your README or a separate design document.

---

## Questions?

If you have questions about the assignment, you can send us a message. That said, in real client work, you don't always get the chance to clarify everything upfront — so use your best judgment where things are ambiguous, and document your assumptions. We value how you handle uncertainty as much as how you write code.

Good luck, and we look forward to seeing your work.

— **Engineering Team**
