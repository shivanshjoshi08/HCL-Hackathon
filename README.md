# SmartBank - Banking Backend System

A secure, scalable full-stack banking application built for the HCL Hackathon. SmartBank enables core banking operations including account management, transactions, KYC verification, and includes an AI-powered chatbot assistant.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Database Schema (ER Diagram)](#database-schema-er-diagram)
- [Application Flow](#application-flow)
- [API Documentation](#api-documentation)
- [SmartBank Chatbot](#smartbank-chatbot)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [CI/CD Pipeline](#cicd-pipeline)
- [Project Structure](#project-structure)
- [Security Features](#security-features)
- [Team](#team)

---

## Overview

SmartBank is a modern banking backend system that provides:

- **Customer Portal**: Register, manage accounts, perform transactions, view statements
- **Admin Dashboard**: Manage users, accounts, KYC approvals, monitor transactions
- **AI Chatbot**: RAG-powered assistant for banking queries and navigation

### Actors

| Actor | Capabilities |
|-------|-------------|
| **Customer** | Register, manage accounts, perform transactions, view statements, upload KYC |
| **Bank Admin** | Manage customer accounts, approve/reject KYC, freeze/activate accounts, view all transactions |

---

## Features

### Core Features (MVP)

| Feature | Description | Status |
|---------|-------------|--------|
| User Registration & KYC | Sign up with personal details, upload ID documents | Done |
| Account Creation | Create Savings, Current, or FD accounts | Done |
| Money Transfer | Transfer between accounts with validation | Done |
| Deposit | Add money to accounts | Done |
| Transaction History | View all past transactions | Done |
| Dashboard | Account summary and quick actions | Done |
| Admin Panel | User, account, and transaction management | Done |

### Additional Features

| Feature | Description | Status |
|---------|-------------|--------|
| AI Chatbot | RAG-powered SmartBank Assistant | Done |
| KYC Verification | Document upload with Cloudinary | Done |
| JWT Authentication | Secure token-based auth | Done |
| Rate Limiting | API protection | Done |
| CI/CD Pipeline | GitHub Actions | Done |
| Fraud Detection | ML-based anomaly detection | Not Implemented (Stretch goal) |

---

## Tech Stack

### Frontend
```
React 18          - UI Library
Vite              - Build Tool
Tailwind CSS      - Styling
React Router      - Navigation
Axios             - HTTP Client
Lucide React      - Icons
```

### Backend
```
Node.js 20        - Runtime
Express.js        - Web Framework
Prisma            - ORM
PostgreSQL        - Database (Neon)
JWT               - Authentication
Cloudinary        - File Storage
```

### AI/Chatbot
```
OpenAI API        - LLM (via LLM Gateway)
Xenova Transformers - Embeddings
RAG               - Retrieval Augmented Generation
```

### DevOps
```
GitHub Actions    - CI/CD
Docker            - Containerization
Vitest/Jest       - Testing
```

---

## System Architecture

```
+------------------------------------------------------------------+
|                        SMARTBANK SYSTEM                           |
+------------------------------------------------------------------+
|                                                                   |
|  +------------+         +------------+         +-------------+    |
|  |  Frontend  |  HTTP   |  Backend   |  SQL    | PostgreSQL  |    |
|  |  (React)   |<------->| (Express)  |<------->|   (Neon)    |    |
|  | Port: 5173 |   API   | Port: 5000 |         |             |    |
|  +------------+         +------------+         +-------------+    |
|        |                      |                                   |
|        |                      |                                   |
|        |               +------+------+                            |
|        |               |             |                            |
|        |          +----+----+  +-----+-----+                      |
|        |          |Cloudinary|  | LLM API  |                      |
|        |          | (Files) |  | (Chatbot)|                      |
|        |          +---------+  +----------+                       |
|        |                                                          |
|  +-----v------------------------------------------------------+   |
|  |                      CHAT WIDGET                           |   |
|  |  +---------+    +----------+    +---------+    +---------+ |   |
|  |  | User    |--->| Intent   |--->| RAG     |--->|Response | |   |
|  |  | Query   |    | Classify |    | Search  |    |Generate | |   |
|  |  +---------+    +----------+    +---------+    +---------+ |   |
|  +------------------------------------------------------------+   |
|                                                                   |
+-------------------------------------------------------------------+
```

---

## Database Schema (ER Diagram)

```
+-------------------------------------------------------------------+
|                         DATABASE SCHEMA                            |
+-------------------------------------------------------------------+

+----------------------+       +----------------------+
|        USERS         |       |       ACCOUNTS       |
+----------------------+       +----------------------+
| id (PK, UUID)        |       | id (PK, UUID)        |
| email (UNIQUE)       |       | accountNumber (UNIQUE)|
| password (HASH)      |       | accountType          |
| firstName            |       | balance (DECIMAL)    |
| lastName             |       | dailyLimit (DECIMAL) |
| phone                |       | status               |
| address              |<------| userId (FK)          |
| dateOfBirth          |  1:N  | createdAt            |
| idType               |       | updatedAt            |
| idNumber             |       +----------+-----------+
| documentUrl          |                  |
| kycStatus            |                  |
| kycRejectionReason   |                  |
| role                 |                  |
| createdAt            |                  |
| updatedAt            |                  |
+----------------------+                  |
                                          |
                              +-----------+-----------+
                              |                       |
                    +---------v---------+   +---------v-------+
                    |   TRANSACTIONS    |   |  TRANSACTIONS   |
                    |   (From Account)  |   |  (To Account)   |
                    +-------------------+   +-----------------+
                              |
                    +---------v---------+
                    |    TRANSACTIONS   |
                    +-------------------+
                    | id (PK, UUID)     |
                    | fromAccountId (FK)|
                    | toAccountId (FK)  |
                    | transactionType   |
                    | amount (DECIMAL)  |
                    | balanceAfter      |
                    | description       |
                    | status            |
                    | createdAt         |
                    +-------------------+

+-------------------------------------------------------------------+
| ENUMS                                                              |
+-------------------------------------------------------------------+
| accountType: SAVINGS | CURRENT | FD                                |
| accountStatus: ACTIVE | FROZEN | CLOSED                            |
| transactionType: DEPOSIT | WITHDRAWAL | TRANSFER                   |
| transactionStatus: PENDING | COMPLETED | FAILED                    |
| kycStatus: PENDING | VERIFIED | REJECTED                           |
| userRole: customer | admin                                         |
+-------------------------------------------------------------------+
```

---

## Application Flow

### 1. User Registration & KYC Flow

```
+----------+    +----------+    +----------+    +----------+
|  User    |    | Register |    |  Create  |    |  Upload  |
|  Visits  |--->|  Form    |--->|  Account |--->|   KYC    |
|  Site    |    |          |    |(SAVINGS) |    |  Docs    |
+----------+    +----------+    +----------+    +----+-----+
                                                     |
                     +-------------------------------+
                     v
              +-------------+    +-------------+    +----------+
              |   Admin     |    |  Approve/   |    |   KYC    |
              |   Reviews   |--->|   Reject    |--->| VERIFIED |
              |             |    |             |    |          |
              +-------------+    +-------------+    +----------+
```

### 2. Money Transfer Flow

```
+--------------+
| User Clicks  |
|  "Transfer"  |
+------+-------+
       |
       v
+--------------+     +--------------+     +--------------+
| Select From  |---->| Enter To     |---->| Enter Amount |
| Account      |     | Account No.  |     | & Description|
+--------------+     +--------------+     +------+-------+
                                                 |
       +-----------------------------------------+
       |
       v
+--------------+     +--------------+     +--------------+
|   Validate   |---->|   Validate   |---->|   Validate   |
|   Balance    |     |  Daily Limit |     |  Account     |
|   >= Amount  |     |   <= 50,000  |     |  is ACTIVE   |
+------+-------+     +------+-------+     +------+-------+
       |                    |                    |
       | FAIL               | FAIL               | FAIL
       v                    v                    v
+--------------+     +--------------+     +--------------+
| "Insufficient|     | "Daily limit |     | "Account not |
|  balance"    |     |  exceeded"   |     |  active"     |
+--------------+     +--------------+     +--------------+

       | PASS               | PASS               | PASS
       +--------------------+--------------------+
                            |
                            v
                 +--------------------+
                 |  ATOMIC TRANSACTION |
                 |  +--------------+   |
                 |  | Debit Sender |   |
                 |  +--------------+   |
                 |  +--------------+   |
                 |  |Credit Receiver|  |
                 |  +--------------+   |
                 |  +--------------+   |
                 |  |Log Transaction|  |
                 |  +--------------+   |
                 +---------+----------+
                           |
                           v
                 +------------------+
                 |  SUCCESS SCREEN  |
                 |  - Amount Sent   |
                 |  - New Balance   |
                 |  - Transaction ID|
                 +------------------+
```

### 3. Account Creation Flow

```
+----------+    +---------------+    +---------------+    +----------+
| Click    |    | Select Type:  |    | Enter Initial |    | Account  |
| "New     |--->| - SAVINGS     |--->| Deposit:      |--->| Created! |
| Account" |    | - CURRENT     |    | - SAVINGS:500 |    | Show Acc |
|          |    | - FD          |    | - CURRENT: 0  |    | Number   |
+----------+    +---------------+    | - FD: 1000    |    +----------+
                                     +---------------+
```

---

## API Documentation

### Base URL
```
http://localhost:5000
```

### Authentication
All protected endpoints require JWT token:
```
Authorization: Bearer <token>
```

### Endpoints Summary

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| **Auth** |
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/register-admin` | Register admin | No |
| POST | `/api/auth/login` | Login user | No |
| **Accounts** |
| GET | `/api/accounts` | Get user's accounts | Yes |
| POST | `/api/accounts/create` | Create new account | Yes |
| GET | `/api/accounts/:id/balance` | Get account balance | Yes |
| **Transactions** |
| POST | `/api/transactions/deposit` | Deposit money | Yes |
| POST | `/api/transactions/transfer` | Transfer money | Yes |
| GET | `/api/transactions/history` | Get transaction history | Yes |
| **KYC** |
| POST | `/api/kyc/upload` | Upload KYC document | Yes |
| GET | `/api/kyc/status` | Get KYC status | Yes |
| **Admin** |
| GET | `/api/admin/users` | Get all users | Admin |
| GET | `/api/admin/accounts` | Get all accounts | Admin |
| PUT | `/api/admin/accounts/:id/status` | Update account status | Admin |
| GET | `/api/admin/transactions` | Get all transactions | Admin |
| PUT | `/api/admin/kyc/:userId` | Approve/Reject KYC | Admin |
| **Chatbot** |
| GET | `/api/chatbot/config` | Get bot config | No |
| POST | `/api/chatbot/chat` | Send message to bot | No |

### Sample API Requests

#### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "9876543210",
  "address": "123 Main St",
  "dateOfBirth": "1990-01-15",
  "idType": "Aadhaar",
  "idNumber": "123456789012"
}
```

#### Transfer Money
```bash
POST /api/transactions/transfer
Authorization: Bearer <token>
Content-Type: application/json

{
  "fromAccountId": "uuid-of-sender-account",
  "toAccountNumber": "1234567890",
  "amount": 5000,
  "description": "Payment for services"
}
```

---

## SmartBank Chatbot

The SmartBank Assistant is an AI-powered RAG (Retrieval Augmented Generation) chatbot.

### Features
- **Natural Language Understanding**: Understands banking queries
- **Smart Navigation**: Can redirect to relevant pages
- **Knowledge Base**: 14 banking topics covered
- **Chat History**: Persists across sessions

### How It Works

```
+-------------+    +-------------+    +-------------+    +-------------+
| User types  |--->| Determine   |--->| Search      |--->| Generate    |
| "How do I   |    | Intent:     |    | Knowledge   |    | Response    |
|  transfer?" |    | RAG_SEARCH  |    | Base        |    | with LLM    |
+-------------+    +-------------+    +-------------+    +-------------+
```

### Intent Types
| Intent | Action |
|--------|--------|
| `NAVIGATE` | Redirect to page (e.g., "go to transfer" -> `/transfer`) |
| `RAG_SEARCH` | Search knowledge base and answer |
| `CHAT` | General conversation |

### Sample Queries
- "How do I transfer money?"
- "What are the account types?"
- "Take me to deposit page"
- "What is KYC verification?"

---

## Setup & Installation

### Prerequisites
- Node.js 20.x
- npm or yarn
- PostgreSQL (or use Neon cloud)

### 1. Clone Repository
```bash
git clone https://github.com/shivanshjoshi08/HCL-Hackathon.git
cd HCL-Hackathon
git checkout kunal
```

### 2. Backend Setup
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

---

## Environment Variables

### Backend (`backend/.env`)
```env
# Database
DATABASE_URL="postgresql://user:pass@host:5432/dbname"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="24h"
JWT_REFRESH_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV="development"

# Cloudinary (for KYC uploads)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Chatbot LLM
LLM_API_KEY="your-llm-api-key"
LLM_BASE_URL="https://api.llmgateway.io/v1/"
```

---

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Access Points
| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| API Health | http://localhost:5000/health |

### Test Credentials

**Customer:**
```
Email: test@example.com
Password: Password123
```

**Admin:**
```
Email: admin@smartbankapp.com
Password: Admin123!
```

---

## Testing

### Backend Tests
```bash
cd backend
npm test                 # Run tests
npm run test:coverage    # With coverage
```

### Frontend Tests
```bash
cd frontend
npm test                 # Run tests
npm run test:coverage    # With coverage
```

### Test Coverage
- **Backend**: Auth, Account, Transaction logic
- **Frontend**: UI Components, Utilities, Validation

---

## CI/CD Pipeline

### GitHub Actions Workflows

#### CI Pipeline (`.github/workflows/ci.yml`)
Triggers on push/PR to `main`, `kunal`, `develop`

```
+------------------+     +------------------+
|  Backend Check   |     |  Frontend Check  |
|  - npm install   |     |  - npm install   |
|  - prisma gen    |     |  - npm build     |
|  - syntax check  |     |                  |
+--------+---------+     +--------+---------+
         |                        |
         +------------+-----------+
                      |
                      v
             +-----------------+
             |  All Checks OK  |
             +-----------------+
```

#### CD Pipeline (`.github/workflows/cd.yml`)
Triggers on push to `main`

- Builds backend and frontend
- Uploads build artifacts
- Ready for deployment to Railway/Vercel/Netlify

---

## Project Structure

```
smartbank/
|-- .github/
|   |-- workflows/
|       |-- ci.yml              # CI pipeline
|       |-- cd.yml              # CD pipeline
|
|-- backend/
|   |-- __tests__/              # Unit tests
|   |   |-- auth.test.js
|   |   |-- account.test.js
|   |   |-- transaction.test.js
|   |-- prisma/
|   |   |-- schema.prisma       # Database schema
|   |   |-- migrations/         # DB migrations
|   |-- src/
|   |   |-- config/
|   |   |   |-- database.js     # Prisma client
|   |   |   |-- cloudinary.js   # File uploads
|   |   |   |-- chatbot.js      # Bot config & knowledge
|   |   |-- controllers/
|   |   |   |-- auth.controller.js
|   |   |   |-- account.controller.js
|   |   |   |-- transaction.controller.js
|   |   |   |-- kyc.controller.js
|   |   |   |-- admin.controller.js
|   |   |   |-- chatbot.controller.js
|   |   |-- middleware/
|   |   |   |-- auth.js         # JWT verification
|   |   |   |-- errorHandler.js
|   |   |   |-- rateLimiter.js
|   |   |   |-- validator.js
|   |   |-- routes/
|   |   |   |-- auth.routes.js
|   |   |   |-- account.routes.js
|   |   |   |-- transaction.routes.js
|   |   |   |-- kyc.routes.js
|   |   |   |-- admin.routes.js
|   |   |   |-- chatbot.routes.js
|   |   |-- utils/
|   |       |-- AppError.js
|   |       |-- helpers.js
|   |       |-- jwt.js
|   |-- server.js               # Entry point
|   |-- package.json
|
|-- frontend/
|   |-- src/
|   |   |-- __tests__/          # Unit tests
|   |   |-- components/
|   |   |   |-- ui/             # Reusable UI
|   |   |   |-- ChatWidget.jsx  # Chatbot
|   |   |   |-- Navbar.jsx
|   |   |   |-- ProtectedRoute.jsx
|   |   |-- context/
|   |   |   |-- AuthContext.jsx
|   |   |-- pages/
|   |   |   |-- Login.jsx
|   |   |   |-- Register.jsx
|   |   |   |-- Dashboard.jsx
|   |   |   |-- Accounts.jsx
|   |   |   |-- Transfer.jsx
|   |   |   |-- Deposit.jsx
|   |   |   |-- Transactions.jsx
|   |   |   |-- KycUpload.jsx
|   |   |   |-- AdminDashboard.jsx
|   |   |   |-- AdminUsers.jsx
|   |   |   |-- AdminAccounts.jsx
|   |   |   |-- AdminTransactions.jsx
|   |   |-- services/
|   |   |   |-- api.js          # Axios instance
|   |   |   |-- auth.js
|   |   |-- App.jsx
|   |-- package.json
|
|-- README.md
```

---

## Security Features

| Feature | Implementation |
|---------|----------------|
| **Authentication** | JWT tokens with 24h expiry |
| **Password Security** | bcrypt hashing (salt rounds: 12) |
| **Input Validation** | express-validator on all inputs |
| **Rate Limiting** | 100 requests/15min per IP |
| **CORS** | Configured for frontend origin |
| **Helmet** | Security headers |
| **SQL Injection** | Prisma ORM with parameterized queries |

---

## Team

| Name | Role |
|------|------|
| Kunal | Full Stack Developer |
| Team Members | Contributors |

---

## License

This project is licensed under the MIT License.

---

## Acknowledgments

- HCL Hackathon organizers
- Neon for PostgreSQL hosting
- Cloudinary for file storage
- LLM Gateway for chatbot API

---

Made for HCL Hackathon 2026
