# 🏦 SmartBank

> A secure, scalable full-stack banking application built for the **HCL Hackathon 2026**

SmartBank enables core banking operations including account management, transactions, KYC verification, and includes an AI-powered chatbot assistant.

[![CI](https://github.com/shivanshjoshi08/HCL-Hackathon/actions/workflows/ci.yml/badge.svg)](https://github.com/shivanshjoshi08/HCL-Hackathon/actions/workflows/ci.yml)
[![CD](https://github.com/shivanshjoshi08/HCL-Hackathon/actions/workflows/cd.yml/badge.svg)](https://github.com/shivanshjoshi08/HCL-Hackathon/actions/workflows/cd.yml)

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Database Schema](#-database-schema)
- [Application Flows](#-application-flows)
- [API Reference](#-api-reference)
- [Chatbot](#-chatbot)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Testing](#-testing)
- [CI/CD](#-cicd)
- [Project Structure](#-project-structure)
- [Security](#-security)
- [Team](#-team)
- [Acknowledgments](#-acknowledgments)

---

## 🎯 Overview

SmartBank is a modern banking system providing:

| Portal | Description |
|--------|-------------|
| **Customer Portal** | Register, manage accounts, perform transactions, view statements |
| **Admin Dashboard** | Manage users, accounts, KYC approvals, monitor transactions |
| **AI Chatbot** | RAG-powered assistant for banking queries and navigation |

### System Actors

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SMARTBANK USERS                                │
├─────────────────────────────────┬───────────────────────────────────────────┤
│           CUSTOMER              │              BANK ADMIN                   │
├─────────────────────────────────┼───────────────────────────────────────────┤
│ • Register & Login              │ • Manage all customer accounts            │
│ • Create multiple accounts      │ • Approve/Reject KYC documents            │
│ • Transfer money                │ • Freeze/Activate accounts                │
│ • View transaction history      │ • View all transactions                   │
│ • Upload KYC documents          │ • Monitor system activity                 │
│ • Chat with AI assistant        │ • User management                         │
└─────────────────────────────────┴───────────────────────────────────────────┘
```

---

## ✅ Features

### Core Features

| Feature | Description | Status |
|---------|-------------|:------:|
| User Registration & KYC | Sign up with personal details, upload ID documents | ✓ |
| Account Creation | Create Savings, Current, or FD accounts | ✓ |
| Money Transfer | Transfer between accounts with validation | ✓ |
| Deposit | Add money to accounts | ✓ |
| Transaction History | View all past transactions with filters | ✓ |
| Dashboard | Account summary and quick actions | ✓ |
| Admin Panel | User, account, and transaction management | ✓ |

### Additional Features

| Feature | Description | Status |
|---------|-------------|:------:|
| AI Chatbot | RAG-powered SmartBank Assistant | ✓ |
| KYC Verification | Document upload with Cloudinary | ✓ |
| JWT Authentication | Secure token-based auth | ✓ |
| Rate Limiting | API protection (100 req/15min) | ✓ |
| CI/CD Pipeline | Automated testing & deployment | ✓ |

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Library |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| React Router | Navigation |
| Axios | HTTP Client |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js 20 | Runtime |
| Express.js | Web Framework |
| Prisma | ORM |
| PostgreSQL | Database (Neon) |
| JWT | Authentication |
| Cloudinary | File Storage |

### AI/Chatbot
| Technology | Purpose |
|------------|---------|
| OpenAI API | LLM (via Gateway) |
| Xenova Transformers | Embeddings |
| RAG | Context Retrieval |

### DevOps
| Technology | Purpose |
|------------|---------|
| GitHub Actions | CI/CD |
| Docker | Containerization |
| Vitest/Jest | Testing |

---

## 🏗 Architecture

```
┌────────────────────────────────────────────────────────────────────────────┐
│                           SMARTBANK ARCHITECTURE                           │
└────────────────────────────────────────────────────────────────────────────┘

                              ┌──────────────┐
                              │    Client    │
                              │   Browser    │
                              └──────┬───────┘
                                     │ HTTPS
                                     ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                                FRONTEND                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │  Auth    │  │ Dashboard│  │ Accounts │  │ Transfer │  │  Admin   │     │
│  │  Pages   │  │   Page   │  │   Page   │  │   Page   │  │  Panel   │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
│                         React + Vite + Tailwind                            │
│                              Port: 5173                                    │
└────────────────────────────────────┬───────────────────────────────────────┘
                                     │ REST API
                                     ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                                 BACKEND                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                           EXPRESS SERVER                             │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐   │   │
│  │  │  Auth   │  │ Account │  │  Trans  │  │   KYC   │  │  Admin  │   │   │
│  │  │ Routes  │  │ Routes  │  │ Routes  │  │ Routes  │  │ Routes  │   │   │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                          Node.js + Express + Prisma                        │
│                                Port: 5000                                  │
└───────────┬─────────────────────┬─────────────────────┬────────────────────┘
            │                     │                     │
            ▼                     ▼                     ▼
    ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
    │  PostgreSQL  │      │  Cloudinary  │      │   LLM API    │
    │    (Neon)    │      │   (Files)    │      │  (Chatbot)   │
    └──────────────┘      └──────────────┘      └──────────────┘
```

### Request Flow

```
Client Request
      │
      ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   CORS &    │───▶│    Rate     │───▶│    JWT      │───▶│   Input     │
│   Helmet    │    │   Limiter   │    │   Auth      │    │ Validation  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                                                │
                                                                ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Response   │◀───│   Error     │◀───│  Database   │◀───│ Controller  │
│   Client    │    │  Handler    │    │   Query     │    │   Logic     │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

---

## 📊 Database Schema

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DATABASE SCHEMA                                │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────┐              ┌──────────────────────────┐
│          USERS           │              │        ACCOUNTS          │
├──────────────────────────┤              ├──────────────────────────┤
│ id            UUID    PK │              │ id            UUID    PK │
│ email         VARCHAR UK │◄─────────────│ userId        UUID    FK │
│ password      VARCHAR    │     1:N      │ accountNumber VARCHAR UK │
│ firstName     VARCHAR    │              │ accountType   ENUM       │
│ lastName      VARCHAR    │              │ balance       DECIMAL    │
│ phone         VARCHAR    │              │ dailyLimit    DECIMAL    │
│ address       TEXT       │              │ status        ENUM       │
│ dateOfBirth   DATE       │              │ createdAt     TIMESTAMP  │
│ idType        VARCHAR    │              │ updatedAt     TIMESTAMP  │
│ idNumber      VARCHAR    │              └────────────┬─────────────┘
│ documentUrl   VARCHAR    │                           │
│ kycStatus     ENUM       │                           │
│ kycRejectionReason TEXT  │                           │
│ role          ENUM       │                           │
│ createdAt     TIMESTAMP  │                           │
│ updatedAt     TIMESTAMP  │                           │
└──────────────────────────┘                           │
                                                       │
                           ┌───────────────────────────┴───────────────────┐
                           │                                               │
                           ▼                                               ▼
              ┌──────────────────────────┐                ┌──────────────────────────┐
              │      TRANSACTIONS        │                │      TRANSACTIONS        │
              │      (From Account)      │                │      (To Account)        │
              └──────────────────────────┘                └──────────────────────────┘
                           │
                           ▼
              ┌──────────────────────────┐
              │       TRANSACTIONS       │
              ├──────────────────────────┤
              │ id              UUID  PK │
              │ fromAccountId   UUID  FK │
              │ toAccountId     UUID  FK │
              │ transactionType ENUM     │
              │ amount          DECIMAL  │
              │ balanceAfter    DECIMAL  │
              │ description     TEXT     │
              │ status          ENUM     │
              │ createdAt       TIMESTAMP│
              └──────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ ENUMS                                                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ accountType      : SAVINGS | CURRENT | FD                                   │
│ accountStatus    : ACTIVE | FROZEN | CLOSED                                 │
│ transactionType  : DEPOSIT | WITHDRAWAL | TRANSFER                          │
│ transactionStatus: PENDING | COMPLETED | FAILED                             │
│ kycStatus        : PENDING | VERIFIED | REJECTED                            │
│ userRole         : customer | admin                                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Application Flows

### User Registration & KYC Flow

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│  Visit  │───▶│Register │───▶│ Create  │───▶│ Upload  │───▶│ Pending │
│  Site   │    │  Form   │    │ Account │    │   KYC   │    │ Review  │
└─────────┘    └─────────┘    └─────────┘    └─────────┘    └────┬────┘
                                                                  │
                    ┌─────────────────────────────────────────────┘
                    ▼
              ┌───────────┐
              │   Admin   │
              │  Reviews  │
              └─────┬─────┘
                    │
         ┌─────────┴─────────┐
         ▼                   ▼
   ┌───────────┐       ┌───────────┐
   │  Approve  │       │  Reject   │
   │    KYC    │       │   KYC     │
   └─────┬─────┘       └─────┬─────┘
         │                   │
         ▼                   ▼
   ┌───────────┐       ┌───────────┐
   │  VERIFIED │       │ Re-upload │
   │  STATUS   │       │  Required │
   └───────────┘       └───────────┘
```

### Money Transfer Flow

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                            TRANSFER FLOW                                      │
└──────────────────────────────────────────────────────────────────────────────┘

User Input                         Validation                      Processing
─────────────────────────────────────────────────────────────────────────────────
                                         
┌─────────────┐                   ┌─────────────┐                              
│ Select From │                   │  Balance    │                              
│   Account   │──────────────────▶│  >= Amount  │──┐                          
└─────────────┘                   └─────────────┘  │                          
                                        │         │ FAIL: "Insufficient       
┌─────────────┐                         │         │        balance"           
│  Enter To   │                   ┌─────▼───────┐ │                           
│ Account No. │──────────────────▶│ Daily Limit │◀┘                           
└─────────────┘                   │  <= 50,000  │──┐                          
                                  └─────────────┘  │ FAIL: "Daily limit       
┌─────────────┐                         │         │        exceeded"          
│   Enter     │                   ┌─────▼───────┐ │                           
│   Amount    │──────────────────▶│  Account    │◀┘                           
└─────────────┘                   │  is ACTIVE  │──┐ FAIL: "Account not       
                                  └─────────────┘  │        active"           
                                        │         │                           
                                        ▼         │                           
                               ALL VALIDATIONS PASS                           
                                        │                                      
                                        ▼                                      
                         ┌─────────────────────────────┐                       
                         │    ATOMIC TRANSACTION       │                       
                         │  ┌───────────────────────┐  │                       
                         │  │   Debit Sender Acc    │  │                       
                         │  └───────────────────────┘  │                       
                         │  ┌───────────────────────┐  │                       
                         │  │  Credit Receiver Acc  │  │                       
                         │  └───────────────────────┘  │                       
                         │  ┌───────────────────────┐  │                       
                         │  │   Log Transaction     │  │                       
                         │  └───────────────────────┘  │                       
                         └─────────────────────────────┘                       
                                        │                                      
                                        ▼                                      
                         ┌─────────────────────────────┐                       
                         │      SUCCESS RESPONSE       │                       
                         │  • Transaction ID           │                       
                         │  • Amount Transferred       │                       
                         │  • New Balance              │                       
                         └─────────────────────────────┘                       
```

### Account Creation Flow

```
┌───────────┐     ┌────────────────┐     ┌────────────────┐     ┌───────────┐
│   Click   │────▶│  Select Type   │────▶│ Initial Deposit│────▶│  Account  │
│   "New    │     │                │     │                │     │  Created  │
│  Account" │     │ • SAVINGS      │     │ SAVINGS: ₹500  │     │           │
│           │     │ • CURRENT      │     │ CURRENT: ₹0    │     │ Display   │
│           │     │ • FD           │     │ FD: ₹1000      │     │ Acc No.   │
└───────────┘     └────────────────┘     └────────────────┘     └───────────┘
```

---

## 📡 API Reference

**Base URL:** `http://localhost:5000`

### Authentication
```
Authorization: Bearer <token>
```

### Endpoints

#### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|:----:|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/register-admin` | Register admin | No |
| POST | `/api/auth/login` | Login user | No |

#### Accounts
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|:----:|
| GET | `/api/accounts` | Get user's accounts | Yes |
| POST | `/api/accounts/create` | Create new account | Yes |
| GET | `/api/accounts/:id/balance` | Get account balance | Yes |

#### Transactions
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|:----:|
| POST | `/api/transactions/deposit` | Deposit money | Yes |
| POST | `/api/transactions/transfer` | Transfer money | Yes |
| GET | `/api/transactions/history` | Get transaction history | Yes |

#### KYC
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|:----:|
| POST | `/api/kyc/upload` | Upload KYC document | Yes |
| GET | `/api/kyc/status` | Get KYC status | Yes |

#### Admin
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|:----:|
| GET | `/api/admin/users` | Get all users | Admin |
| GET | `/api/admin/accounts` | Get all accounts | Admin |
| PUT | `/api/admin/accounts/:id/status` | Update account status | Admin |
| GET | `/api/admin/transactions` | Get all transactions | Admin |
| PUT | `/api/admin/kyc/:userId` | Approve/Reject KYC | Admin |

#### Chatbot
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|:----:|
| GET | `/api/chatbot/config` | Get bot config | No |
| POST | `/api/chatbot/chat` | Send message to bot | No |

### Sample Requests

<details>
<summary><b>Register User</b></summary>

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
</details>

<details>
<summary><b>Transfer Money</b></summary>

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
</details>

---

## 🤖 Chatbot

The SmartBank Assistant is an AI-powered RAG (Retrieval Augmented Generation) chatbot.

### Features
- Natural Language Understanding
- Smart Navigation (redirects to relevant pages)
- Knowledge Base (14 banking topics)
- Persistent Chat History

### How It Works

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    User     │───▶│  Determine  │───▶│   Search    │───▶│  Generate   │
│   Query     │    │   Intent    │    │  Knowledge  │    │  Response   │
│             │    │             │    │    Base     │    │  with LLM   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### Intent Types
| Intent | Action | Example |
|--------|--------|---------|
| `NAVIGATE` | Redirect to page | "go to transfer" → `/transfer` |
| `RAG_SEARCH` | Search knowledge base | "How do I transfer money?" |
| `CHAT` | General conversation | "Hello, how are you?" |

---

## 📦 Installation

### Prerequisites
- Node.js 20.x
- npm or yarn
- PostgreSQL (or Neon cloud)

### Clone Repository
```bash
git clone https://github.com/shivanshjoshi08/HCL-Hackathon.git
cd HCL-Hackathon
```

### Backend Setup
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
```

### Frontend Setup
```bash
cd frontend
npm install
```

---

## ⚙ Configuration

### Backend Environment Variables

Create `backend/.env`:

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

## 🚀 Usage

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

| Role | Email | Password |
|------|-------|----------|
| Customer | test@example.com | Password123 |
| Admin | admin@smartbankapp.com | Admin123! |

---

## 🧪 Testing

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
| Module | Coverage Areas |
|--------|----------------|
| Backend | Auth, Account, Transaction logic |
| Frontend | UI Components, Utilities, Validation |

---

## 🔄 CI/CD

### GitHub Actions Workflows

#### CI Pipeline (`.github/workflows/ci.yml`)
Triggers: Push/PR to `main`, `kunal`, `develop`

```
┌──────────────────────────────────────────────────────────────┐
│                        CI PIPELINE                           │
├─────────────────────────────┬────────────────────────────────┤
│      BACKEND CHECK          │       FRONTEND CHECK           │
├─────────────────────────────┼────────────────────────────────┤
│  • npm install              │  • npm install                 │
│  • prisma generate          │  • npm run build               │
│  • syntax check             │  • type check                  │
└─────────────────────────────┴────────────────────────────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │  All Checks Pass  │
                    └───────────────────┘
```

#### CD Pipeline (`.github/workflows/cd.yml`)
Triggers: Push to `main`

- Builds backend and frontend
- Uploads build artifacts
- Ready for deployment (Railway/Vercel/Netlify)

---

## 📁 Project Structure

```
smartbank/
├── .github/
│   └── workflows/
│       ├── ci.yml                 # CI pipeline
│       └── cd.yml                 # CD pipeline
│
├── backend/
│   ├── __tests__/                 # Unit tests
│   │   ├── auth.test.js
│   │   ├── account.test.js
│   │   └── transaction.test.js
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema
│   │   └── migrations/            # DB migrations
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js        # Prisma client
│   │   │   ├── cloudinary.js      # File uploads
│   │   │   └── chatbot.js         # Bot config
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── account.controller.js
│   │   │   ├── transaction.controller.js
│   │   │   ├── kyc.controller.js
│   │   │   ├── admin.controller.js
│   │   │   └── chatbot.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.js            # JWT verification
│   │   │   ├── errorHandler.js
│   │   │   ├── rateLimiter.js
│   │   │   └── validator.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── account.routes.js
│   │   │   ├── transaction.routes.js
│   │   │   ├── kyc.routes.js
│   │   │   ├── admin.routes.js
│   │   │   └── chatbot.routes.js
│   │   └── utils/
│   │       ├── AppError.js
│   │       ├── helpers.js
│   │       └── jwt.js
│   ├── server.js                  # Entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── __tests__/             # Unit tests
│   │   ├── components/
│   │   │   ├── ui/                # Reusable UI
│   │   │   ├── ChatWidget.jsx     # Chatbot
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Accounts.jsx
│   │   │   ├── Transfer.jsx
│   │   │   ├── Deposit.jsx
│   │   │   ├── Transactions.jsx
│   │   │   ├── KycUpload.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminUsers.jsx
│   │   │   ├── AdminAccounts.jsx
│   │   │   └── AdminTransactions.jsx
│   │   ├── services/
│   │   │   ├── api.js             # Axios instance
│   │   │   └── auth.js
│   │   └── App.jsx
│   └── package.json
│
└── README.md
```

---

## 🔒 Security

| Feature | Implementation |
|---------|----------------|
| Authentication | JWT tokens with 24h expiry |
| Password Security | bcrypt hashing (salt rounds: 12) |
| Input Validation | express-validator on all inputs |
| Rate Limiting | 100 requests per 15 minutes per IP |
| CORS | Configured for frontend origin |
| Security Headers | Helmet middleware |
| SQL Injection | Prisma ORM with parameterized queries |

---

## 👥 Team

| Name | Roll No | HCL Application No | Role |
|------|---------|-------------------|------|
| **Shivansh Joshi** | 2K22/EE/254 | HCLTFP1840519 | Full Stack Developer |
| **Karan Singh** | 2K22/EC/124 | HCLTFP1840397 | Full Stack Developer |
| **Kunal Kumar Sharma** | 2K22/EC/135 | HCLTFP1840453 | Full Stack Developer |
| **Prabhjot Singh** | 2K22/EC/168 | HCLTFP1840541 | Full Stack Developer |

---

## 🙏 Acknowledgments

- HCL Hackathon organizers
- Neon for PostgreSQL hosting
- Cloudinary for file storage
- LLM Gateway for chatbot API

---

<div align="center">

**Made with dedication for HCL Hackathon 2026**

Delhi Technological University

</div>
