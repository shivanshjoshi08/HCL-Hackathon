# Banking System - Implementation Plan

## Tech Stack
- **Frontend**: React.js
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT

---

## 5 Core Use Cases

### 1. User Registration & Authentication
- User can register with email and password
- User can login and receive JWT token
- Password hashing with bcrypt

### 2. View Account Balance
- Authenticated user can view their account balance
- Display account number and account type

### 3. Money Transfer (Internal)
- User can transfer money to another account
- Validate sufficient balance
- Both accounts updated atomically

### 4. Transaction History
- User can view past transactions
- Show date, type, amount, and balance

### 5. Deposit Money
- User can deposit money into their account
- Balance updated immediately
- Transaction recorded

---

## Database Schema (Prisma)

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  firstName String
  lastName  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  accounts  Account[]
}

model Account {
  id             String   @id @default(uuid())
  accountNumber  String   @unique
  accountType    String   // SAVINGS, CHECKING
  balance        Decimal  @default(0) @db.Decimal(15, 2)
  userId         String
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  
  user           User     @relation(fields: [userId], references: [id])
  
  transactionsFrom Transaction[] @relation("FromAccount")
  transactionsTo   Transaction[] @relation("ToAccount")
}

model Transaction {
  id              String   @id @default(uuid())
  fromAccountId   String?
  toAccountId     String?
  transactionType String   // DEPOSIT, WITHDRAWAL, TRANSFER
  amount          Decimal  @db.Decimal(15, 2)
  balanceAfter    Decimal  @db.Decimal(15, 2)
  description     String?
  createdAt       DateTime @default(now())
  
  fromAccount Account? @relation("FromAccount", fields: [fromAccountId], references: [id])
  toAccount   Account? @relation("ToAccount", fields: [toAccountId], references: [id])
}
```

---

## Backend API Routes

### Authentication Routes (`/api/auth`)

#### 1. POST /api/auth/register
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": "uuid",
    "email": "user@example.com",
    "accountNumber": "1234567890"
  }
}
```

**Business Logic:**
- Validate email format and password strength
- Hash password with bcrypt
- Create user in database
- Automatically create one SAVINGS account with ₹0 balance
- Generate unique 10-digit account number

#### 2. POST /api/auth/login
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

**Business Logic:**
- Validate credentials
- Compare password with bcrypt
- Generate JWT token (expires in 24h)
- Return token and user data

---

### Account Routes (`/api/accounts`)
**All routes require JWT authentication**

#### 3. GET /api/accounts
**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accounts": [
      {
        "id": "uuid",
        "accountNumber": "1234567890",
        "accountType": "SAVINGS",
        "balance": "5000.00",
        "createdAt": "2026-01-27T10:00:00Z"
      }
    ]
  }
}
```

**Business Logic:**
- Extract userId from JWT token
- Fetch all accounts for the user
- Return account details with current balance

#### 4. GET /api/accounts/:accountId/balance
**Response:**
```json
{
  "success": true,
  "data": {
    "accountNumber": "1234567890",
    "balance": "5000.00",
    "accountType": "SAVINGS"
  }
}
```

**Business Logic:**
- Verify account belongs to logged-in user
- Return current balance

---

### Transaction Routes (`/api/transactions`)
**All routes require JWT authentication**

#### 5. POST /api/transactions/deposit
**Request Body:**
```json
{
  "accountId": "uuid",
  "amount": 1000.00,
  "description": "Cash deposit"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Deposit successful",
  "data": {
    "transactionId": "uuid",
    "newBalance": "6000.00",
    "transaction": {
      "type": "DEPOSIT",
      "amount": "1000.00",
      "timestamp": "2026-01-27T10:30:00Z"
    }
  }
}
```

**Business Logic:**
- Verify account belongs to user
- Validate amount > 0
- Start database transaction
- Update account balance: `balance = balance + amount`
- Create transaction record with type="DEPOSIT"
- Record balance after transaction
- Commit database transaction
- Return new balance

#### 6. POST /api/transactions/transfer
**Request Body:**
```json
{
  "fromAccountId": "uuid",
  "toAccountNumber": "0987654321",
  "amount": 500.00,
  "description": "Payment to friend"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Transfer successful",
  "data": {
    "transactionId": "uuid",
    "newBalance": "5500.00"
  }
}
```

**Business Logic:**
- Verify fromAccount belongs to user
- Find toAccount by account number
- Validate toAccount exists and is active
- Validate amount > 0
- Check sufficient balance: `fromAccount.balance >= amount`
- Start database transaction
- Debit from source: `fromAccount.balance = fromAccount.balance - amount`
- Credit to destination: `toAccount.balance = toAccount.balance + amount`
- Create transaction record with both account IDs, type="TRANSFER"
- Record balance after for fromAccount
- Commit database transaction (rollback if any step fails)
- Return new balance

#### 7. GET /api/transactions/history
**Query Parameters:**
- `accountId` (required)
- `limit` (optional, default: 20)
- `offset` (optional, default: 0)

**Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "uuid",
        "type": "TRANSFER",
        "amount": "-500.00",
        "balanceAfter": "5500.00",
        "description": "Payment to friend",
        "timestamp": "2026-01-27T10:30:00Z",
        "otherParty": "Account 0987654321"
      },
      {
        "id": "uuid",
        "type": "DEPOSIT",
        "amount": "+1000.00",
        "balanceAfter": "6000.00",
        "description": "Cash deposit",
        "timestamp": "2026-01-27T09:00:00Z"
      }
    ],
    "total": 15
  }
}
```

**Business Logic:**
- Verify account belongs to user
- Fetch transactions where account is either sender or receiver
- Order by timestamp DESC
- Apply pagination (limit, offset)
- Format amounts with +/- based on debit/credit
- Return transaction list

---

## Frontend Routes (React)

### Public Routes
- `/` - Landing page
- `/login` - Login page
- `/register` - Registration page

### Protected Routes (Require Authentication)
- `/dashboard` - Main dashboard (shows balance, recent transactions)
- `/accounts` - List all accounts
- `/transfer` - Money transfer form
- `/deposit` - Deposit money form
- `/transactions` - Full transaction history

---

## Frontend Components Structure

```
src/
├── App.jsx
├── main.jsx
├── components/
│   ├── Navbar.jsx
│   ├── ProtectedRoute.jsx
│   ├── AccountCard.jsx
│   ├── TransactionItem.jsx
│   └── TransferForm.jsx
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── Accounts.jsx
│   ├── Transfer.jsx
│   ├── Deposit.jsx
│   └── TransactionHistory.jsx
├── services/
│   ├── api.js (axios instance)
│   └── auth.js (auth helpers)
└── context/
    └── AuthContext.jsx
```

---

## Backend Folder Structure

```
backend/
├── server.js
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── account.routes.js
│   │   └── transaction.routes.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── account.controller.js
│   │   └── transaction.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── errorHandler.js
│   ├── utils/
│   │   ├── generateAccountNumber.js
│   │   └── validation.js
│   └── config/
│       └── jwt.config.js
└── package.json
```

---

## Environment Variables

### Backend (.env)
```
DATABASE_URL="postgresql://user:password@localhost:5432/banking_db"
JWT_SECRET="your_secret_key_here"
JWT_EXPIRES_IN="24h"
PORT=5000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

---

## Key Business Logic Rules

### 1. Account Creation
- Auto-create SAVINGS account on user registration
- Generate unique 10-digit account number
- Initial balance = 0

### 2. Balance Validation
- Cannot transfer more than available balance
- Minimum transfer amount: ₹1
- Balance cannot be negative

### 3. Transaction Atomicity
- Use Prisma transactions for transfers
- Both debit and credit must succeed together
- Rollback if any operation fails

### 4. Security
- All routes except /auth/* require JWT
- Passwords hashed with bcrypt (10 rounds)
- Users can only access their own accounts
- Validate account ownership before operations

### 5. Transaction Recording
- Every transaction must record the balance after
- Transaction type: DEPOSIT, WITHDRAWAL, TRANSFER
- Store timestamp for audit trail

---

## API Error Responses

### Standard Error Format
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

### Common Error Codes
- `INVALID_CREDENTIALS` - Wrong email/password
- `INSUFFICIENT_BALANCE` - Not enough funds
- `ACCOUNT_NOT_FOUND` - Invalid account number
- `UNAUTHORIZED` - Missing or invalid JWT
- `VALIDATION_ERROR` - Invalid input data

---

## Implementation Priority

### Day 1-2: Backend Setup
1. Initialize Node.js project
2. Set up Prisma with PostgreSQL
3. Create database schema and migrations
4. Implement auth routes (register, login)
5. Implement JWT middleware

### Day 3-4: Core Features
1. Account routes (get accounts, get balance)
2. Transaction routes (deposit, transfer, history)
3. Test all APIs with Postman

### Day 5-6: Frontend
1. Set up React project with Vite
2. Create auth pages (login, register)
3. Implement protected routes
4. Create dashboard with balance display
5. Build transfer and deposit forms
6. Display transaction history

### Day 7: Testing & Polish
1. End-to-end testing
2. Error handling improvements
3. UI/UX improvements
4. Documentation

---

## Testing Checklist

- [ ] User can register successfully
- [ ] User can login and receive token
- [ ] Token is validated on protected routes
- [ ] User can view account balance
- [ ] User can deposit money
- [ ] Balance updates correctly after deposit
- [ ] User can transfer money to valid account
- [ ] Transfer fails with insufficient balance
- [ ] Transfer fails with invalid account number
- [ ] Both accounts updated correctly in transfer
- [ ] Transaction history displays correctly
- [ ] User cannot access other users' accounts
- [ ] Proper error messages displayed

---

## Deployment

### Database
- Use PostgreSQL on Railway/Supabase/Neon

### Backend
- Deploy on Render/Railway/Heroku
- Set environment variables
- Run `prisma migrate deploy`

### Frontend
- Deploy on Vercel/Netlify
- Update API_URL environment variable
