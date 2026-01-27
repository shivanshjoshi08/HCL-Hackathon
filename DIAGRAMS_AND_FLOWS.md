# Banking System - Diagrams & Flows

## Entity-Relationship (ER) Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         ER DIAGRAM                                   │
└─────────────────────────────────────────────────────────────────────┘

                    ┌──────────────────┐
                    │      USER        │
                    │──────────────────│
                    │ PK: id (UUID)    │
                    │    email         │
                    │    password      │
                    │    firstName     │
                    │    lastName      │
                    │    createdAt     │
                    │    updatedAt     │
                    └────────┬─────────┘
                             │
                             │ 1
                             │
                             │ HAS
                             │
                             │ N
                             │
                    ┌────────▼─────────┐
                    │     ACCOUNT      │
                    │──────────────────│
                    │ PK: id (UUID)    │
                    │    accountNumber │◄──────┐
                    │    accountType   │       │
                    │    balance       │       │
                    │ FK: userId       │       │
                    │    createdAt     │       │
                    │    updatedAt     │       │
                    └────┬─────────┬───┘       │
                         │         │           │
                         │ 1       │ 1         │
                         │         │           │
           FROM          │         │  TO       │
         TRANSACTIONS    │         │  TRANSACTIONS
                         │         │           │
                         │ N       │ N         │
                         │         │           │
            ┌────────────▼─────────▼───────────┤
            │       TRANSACTION                 │
            │───────────────────────────────────│
            │ PK: id (UUID)                     │
            │ FK: fromAccountId (nullable)      │
            │ FK: toAccountId (nullable)        │
            │    transactionType                │
            │    amount                         │
            │    balanceAfter                   │
            │    description                    │
            │    createdAt                      │
            └───────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────┐
│                    CARDINALITY EXPLAINED                             │
└─────────────────────────────────────────────────────────────────────┘

  USER (1) ──────── (N) ACCOUNT
    One user can have many accounts
    Each account belongs to one user

  ACCOUNT (1) ──────── (N) TRANSACTION (FROM)
    One account can have many outgoing transactions
    Each transaction has one source account (or none for deposits)

  ACCOUNT (1) ──────── (N) TRANSACTION (TO)
    One account can have many incoming transactions
    Each transaction has one destination account (or none for withdrawals)
```

---

## Database Schema with Constraints

```
┌────────────────────────────────────────────────────────────────────┐
│                        USER TABLE                                   │
├────────────────────────────────────────────────────────────────────┤
│ id            UUID          PRIMARY KEY                             │
│ email         VARCHAR(255)  UNIQUE, NOT NULL                        │
│ password      VARCHAR(255)  NOT NULL (bcrypt hashed)               │
│ firstName     VARCHAR(100)  NOT NULL                                │
│ lastName      VARCHAR(100)  NOT NULL                                │
│ createdAt     TIMESTAMP     DEFAULT NOW()                           │
│ updatedAt     TIMESTAMP     DEFAULT NOW()                           │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│                       ACCOUNT TABLE                                 │
├────────────────────────────────────────────────────────────────────┤
│ id            UUID          PRIMARY KEY                             │
│ accountNumber VARCHAR(10)   UNIQUE, NOT NULL                        │
│ accountType   VARCHAR(20)   NOT NULL (SAVINGS/CHECKING)            │
│ balance       DECIMAL(15,2) DEFAULT 0.00, CHECK (balance >= 0)     │
│ userId        UUID          FOREIGN KEY → USER(id), NOT NULL       │
│ createdAt     TIMESTAMP     DEFAULT NOW()                           │
│ updatedAt     TIMESTAMP     DEFAULT NOW()                           │
│                                                                      │
│ INDEXES:                                                             │
│   - idx_account_user (userId)                                       │
│   - idx_account_number (accountNumber)                              │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│                     TRANSACTION TABLE                               │
├────────────────────────────────────────────────────────────────────┤
│ id              UUID          PRIMARY KEY                           │
│ fromAccountId   UUID          FOREIGN KEY → ACCOUNT(id), NULLABLE  │
│ toAccountId     UUID          FOREIGN KEY → ACCOUNT(id), NULLABLE  │
│ transactionType VARCHAR(20)   NOT NULL (DEPOSIT/TRANSFER/WITHDRAW) │
│ amount          DECIMAL(15,2) NOT NULL, CHECK (amount > 0)         │
│ balanceAfter    DECIMAL(15,2) NOT NULL                              │
│ description     TEXT          NULLABLE                              │
│ createdAt       TIMESTAMP     DEFAULT NOW()                         │
│                                                                      │
│ INDEXES:                                                             │
│   - idx_transaction_from (fromAccountId)                            │
│   - idx_transaction_to (toAccountId)                                │
│   - idx_transaction_created (createdAt DESC)                        │
│                                                                      │
│ CONSTRAINTS:                                                         │
│   - At least one of fromAccountId or toAccountId must be NOT NULL  │
└────────────────────────────────────────────────────────────────────┘
```

---

## System Architecture Diagram

```
┌───────────────────────────────────────────────────────────────────────┐
│                      SYSTEM ARCHITECTURE                               │
└───────────────────────────────────────────────────────────────────────┘


    ┌─────────────────────────────────────────────┐
    │            CLIENT LAYER                      │
    │                                              │
    │  ┌────────────────────────────────────────┐ │
    │  │   React Application (Vite)             │ │
    │  │   - React Router                       │ │
    │  │   - Axios for API calls                │ │
    │  │   - Context API for state              │ │
    │  │   - JWT stored in localStorage         │ │
    │  └────────────────────────────────────────┘ │
    │                                              │
    └─────────────┬────────────────────────────────┘
                  │
                  │ HTTP/HTTPS
                  │ REST API Calls
                  │
    ┌─────────────▼────────────────────────────────┐
    │         APPLICATION LAYER                     │
    │                                               │
    │  ┌─────────────────────────────────────────┐ │
    │  │   Express.js Server (Node.js)           │ │
    │  │                                         │ │
    │  │   ┌───────────────────────────────┐   │ │
    │  │   │   Middleware                  │   │ │
    │  │   │   - JWT Verification          │   │ │
    │  │   │   - Error Handler             │   │ │
    │  │   │   - CORS                      │   │ │
    │  │   └───────────────────────────────┘   │ │
    │  │                                         │ │
    │  │   ┌───────────────────────────────┐   │ │
    │  │   │   Routes                      │   │ │
    │  │   │   - /api/auth                 │   │ │
    │  │   │   - /api/accounts             │   │ │
    │  │   │   - /api/transactions         │   │ │
    │  │   └───────────────────────────────┘   │ │
    │  │                                         │ │
    │  │   ┌───────────────────────────────┐   │ │
    │  │   │   Controllers                 │   │ │
    │  │   │   - Auth Logic                │   │ │
    │  │   │   - Account Logic             │   │ │
    │  │   │   - Transaction Logic         │   │ │
    │  │   └───────────────────────────────┘   │ │
    │  │                                         │ │
    │  └─────────────────────────────────────────┘ │
    │                                               │
    └─────────────┬─────────────────────────────────┘
                  │
                  │ Prisma Client
                  │
    ┌─────────────▼─────────────────────────────────┐
    │          DATA ACCESS LAYER                     │
    │                                                │
    │  ┌──────────────────────────────────────────┐ │
    │  │   Prisma ORM                             │ │
    │  │   - Type-safe queries                    │ │
    │  │   - Schema management                    │ │
    │  │   - Migrations                           │ │
    │  │   - Transaction support                  │ │
    │  └──────────────────────────────────────────┘ │
    │                                                │
    └─────────────┬──────────────────────────────────┘
                  │
                  │ SQL Queries
                  │
    ┌─────────────▼──────────────────────────────────┐
    │          DATABASE LAYER                         │
    │                                                 │
    │  ┌───────────────────────────────────────────┐ │
    │  │   PostgreSQL Database                     │ │
    │  │                                           │ │
    │  │   Tables:                                 │ │
    │  │   - User                                  │ │
    │  │   - Account                               │ │
    │  │   - Transaction                           │ │
    │  │                                           │ │
    │  └───────────────────────────────────────────┘ │
    │                                                 │
    └─────────────────────────────────────────────────┘
```

---

## Use Case Flow Diagrams

### 1. User Registration Flow

```
┌────────────────────────────────────────────────────────────────────┐
│                   USER REGISTRATION FLOW                            │
└────────────────────────────────────────────────────────────────────┘

    User                Frontend              Backend              Database
     │                     │                     │                     │
     │  Fill Registration  │                     │                     │
     │  Form & Submit      │                     │                     │
     ├────────────────────►│                     │                     │
     │                     │                     │                     │
     │                     │  POST /api/auth/    │                     │
     │                     │  register           │                     │
     │                     ├────────────────────►│                     │
     │                     │                     │                     │
     │                     │                     │  Validate Email     │
     │                     │                     │  (unique check)     │
     │                     │                     ├────────────────────►│
     │                     │                     │                     │
     │                     │                     │◄────────────────────┤
     │                     │                     │  Email Available    │
     │                     │                     │                     │
     │                     │                     │  Hash Password      │
     │                     │                     │  (bcrypt)           │
     │                     │                     │                     │
     │                     │                     │  Create User        │
     │                     │                     ├────────────────────►│
     │                     │                     │                     │
     │                     │                     │◄────────────────────┤
     │                     │                     │  User Created       │
     │                     │                     │                     │
     │                     │                     │  Generate Account   │
     │                     │                     │  Number (10 digits) │
     │                     │                     │                     │
     │                     │                     │  Create SAVINGS     │
     │                     │                     │  Account            │
     │                     │                     ├────────────────────►│
     │                     │                     │                     │
     │                     │                     │◄────────────────────┤
     │                     │                     │  Account Created    │
     │                     │                     │                     │
     │                     │◄────────────────────┤                     │
     │                     │  Success Response   │                     │
     │                     │  (userId, account#) │                     │
     │                     │                     │                     │
     │◄────────────────────┤                     │                     │
     │  Show Success       │                     │                     │
     │  Redirect to Login  │                     │                     │
     │                     │                     │                     │
```

---

### 2. User Login Flow

```
┌────────────────────────────────────────────────────────────────────┐
│                      USER LOGIN FLOW                                │
└────────────────────────────────────────────────────────────────────┘

    User                Frontend              Backend              Database
     │                     │                     │                     │
     │  Enter Email &      │                     │                     │
     │  Password           │                     │                     │
     ├────────────────────►│                     │                     │
     │                     │                     │                     │
     │                     │  POST /api/auth/    │                     │
     │                     │  login              │                     │
     │                     ├────────────────────►│                     │
     │                     │                     │                     │
     │                     │                     │  Find User by Email │
     │                     │                     ├────────────────────►│
     │                     │                     │                     │
     │                     │                     │◄────────────────────┤
     │                     │                     │  User Data          │
     │                     │                     │                     │
     │                     │                     │  Compare Password   │
     │                     │                     │  (bcrypt.compare)   │
     │                     │                     │                     │
     │                     │                     │  ┌─────────────┐   │
     │                     │                     │  │ If Invalid  │   │
     │                     │◄────────────────────┤  │ Return 401  │   │
     │◄────────────────────┤  Error: Invalid     │  └─────────────┘   │
     │  Show Error         │  Credentials        │                     │
     │                     │                     │                     │
     │                     │                     │  Generate JWT Token │
     │                     │                     │  (expires 24h)      │
     │                     │                     │                     │
     │                     │◄────────────────────┤                     │
     │                     │  Success Response   │                     │
     │                     │  { token, user }    │                     │
     │                     │                     │                     │
     │                     │  Store JWT in       │                     │
     │                     │  localStorage       │                     │
     │                     │                     │                     │
     │◄────────────────────┤                     │                     │
     │  Redirect to        │                     │                     │
     │  Dashboard          │                     │                     │
     │                     │                     │                     │
```

---

### 3. View Balance Flow

```
┌────────────────────────────────────────────────────────────────────┐
│                    VIEW BALANCE FLOW                                │
└────────────────────────────────────────────────────────────────────┘

    User                Frontend              Backend              Database
     │                     │                     │                     │
     │  Click View         │                     │                     │
     │  Balance            │                     │                     │
     ├────────────────────►│                     │                     │
     │                     │                     │                     │
     │                     │  GET /api/accounts  │                     │
     │                     │  Header:            │                     │
     │                     │  Authorization:     │                     │
     │                     │  Bearer <token>     │                     │
     │                     ├────────────────────►│                     │
     │                     │                     │                     │
     │                     │                     │  Verify JWT Token   │
     │                     │                     │  Extract userId     │
     │                     │                     │                     │
     │                     │                     │  ┌─────────────┐   │
     │                     │                     │  │ If Invalid  │   │
     │                     │◄────────────────────┤  │ Return 401  │   │
     │◄────────────────────┤  Error: Unauthorized│  └─────────────┘   │
     │  Redirect to Login  │                     │                     │
     │                     │                     │                     │
     │                     │                     │  Query Accounts     │
     │                     │                     │  WHERE userId =     │
     │                     │                     ├────────────────────►│
     │                     │                     │                     │
     │                     │                     │◄────────────────────┤
     │                     │                     │  Account Data       │
     │                     │                     │  (id, number,       │
     │                     │                     │   balance, type)    │
     │                     │                     │                     │
     │                     │◄────────────────────┤                     │
     │                     │  Success Response   │                     │
     │                     │  { accounts: [...] }│                     │
     │                     │                     │                     │
     │◄────────────────────┤                     │                     │
     │  Display Balance    │                     │                     │
     │  on Dashboard       │                     │                     │
     │                     │                     │                     │
```

---

### 4. Money Transfer Flow

```
┌────────────────────────────────────────────────────────────────────┐
│                   MONEY TRANSFER FLOW                               │
└────────────────────────────────────────────────────────────────────┘

    User                Frontend              Backend              Database
     │                     │                     │                     │
     │  Fill Transfer Form │                     │                     │
     │  - To Account#      │                     │                     │
     │  - Amount           │                     │                     │
     ├────────────────────►│                     │                     │
     │                     │                     │                     │
     │                     │  POST /api/         │                     │
     │                     │  transactions/      │                     │
     │                     │  transfer           │                     │
     │                     ├────────────────────►│                     │
     │                     │                     │                     │
     │                     │                     │  Verify JWT         │
     │                     │                     │  Get userId         │
     │                     │                     │                     │
     │                     │                     │  Validate From      │
     │                     │                     │  Account Ownership  │
     │                     │                     ├────────────────────►│
     │                     │                     │                     │
     │                     │                     │◄────────────────────┤
     │                     │                     │  From Account Data  │
     │                     │                     │                     │
     │                     │                     │  Find To Account    │
     │                     │                     │  by accountNumber   │
     │                     │                     ├────────────────────►│
     │                     │                     │                     │
     │                     │                     │◄────────────────────┤
     │                     │                     │  To Account Data    │
     │                     │                     │                     │
     │                     │                     │  ┌─────────────┐   │
     │                     │                     │  │ If Not Found│   │
     │                     │◄────────────────────┤  │ Return 404  │   │
     │◄────────────────────┤  Error: Account     │  └─────────────┘   │
     │  Show Error         │  Not Found          │                     │
     │                     │                     │                     │
     │                     │                     │  Check Balance      │
     │                     │                     │  balance >= amount? │
     │                     │                     │                     │
     │                     │                     │  ┌─────────────┐   │
     │                     │                     │  │ If No       │   │
     │                     │◄────────────────────┤  │ Return 400  │   │
     │◄────────────────────┤  Error: Insufficient│  └─────────────┘   │
     │  Show Error         │  Balance            │                     │
     │                     │                     │                     │
     │                     │                     │  START TRANSACTION  │
     │                     │                     │  ═════════════════  │
     │                     │                     │                     │
     │                     │                     │  1. Debit From Acct │
     │                     │                     │     balance -= amt  │
     │                     │                     ├────────────────────►│
     │                     │                     │                     │
     │                     │                     │  2. Credit To Acct  │
     │                     │                     │     balance += amt  │
     │                     │                     ├────────────────────►│
     │                     │                     │                     │
     │                     │                     │  3. Create Trans    │
     │                     │                     │     Record          │
     │                     │                     ├────────────────────►│
     │                     │                     │                     │
     │                     │                     │  COMMIT TRANSACTION │
     │                     │                     │  ═════════════════  │
     │                     │                     │                     │
     │                     │                     │◄────────────────────┤
     │                     │                     │  Success            │
     │                     │                     │                     │
     │                     │◄────────────────────┤                     │
     │                     │  Success Response   │                     │
     │                     │  { newBalance }     │                     │
     │                     │                     │                     │
     │◄────────────────────┤                     │                     │
     │  Show Success       │                     │                     │
     │  Display New Balance│                     │                     │
     │                     │                     │                     │
```

---

### 5. Deposit Money Flow

```
┌────────────────────────────────────────────────────────────────────┐
│                    DEPOSIT MONEY FLOW                               │
└────────────────────────────────────────────────────────────────────┘

    User                Frontend              Backend              Database
     │                     │                     │                     │
     │  Fill Deposit Form  │                     │                     │
     │  - Account ID       │                     │                     │
     │  - Amount           │                     │                     │
     ├────────────────────►│                     │                     │
     │                     │                     │                     │
     │                     │  POST /api/         │                     │
     │                     │  transactions/      │                     │
     │                     │  deposit            │                     │
     │                     ├────────────────────►│                     │
     │                     │                     │                     │
     │                     │                     │  Verify JWT         │
     │                     │                     │  Get userId         │
     │                     │                     │                     │
     │                     │                     │  Validate Account   │
     │                     │                     │  Ownership          │
     │                     │                     ├────────────────────►│
     │                     │                     │                     │
     │                     │                     │◄────────────────────┤
     │                     │                     │  Account Data       │
     │                     │                     │                     │
     │                     │                     │  ┌─────────────┐   │
     │                     │                     │  │ If Not Owner│   │
     │                     │◄────────────────────┤  │ Return 403  │   │
     │◄────────────────────┤  Error: Forbidden   │  └─────────────┘   │
     │  Show Error         │                     │                     │
     │                     │                     │                     │
     │                     │                     │  Validate Amount > 0│
     │                     │                     │                     │
     │                     │                     │  START TRANSACTION  │
     │                     │                     │  ═════════════════  │
     │                     │                     │                     │
     │                     │                     │  1. Update Balance  │
     │                     │                     │     balance += amt  │
     │                     │                     ├────────────────────►│
     │                     │                     │                     │
     │                     │                     │  2. Create Trans    │
     │                     │                     │     Record          │
     │                     │                     │     type: DEPOSIT   │
     │                     │                     ├────────────────────►│
     │                     │                     │                     │
     │                     │                     │  COMMIT TRANSACTION │
     │                     │                     │  ═════════════════  │
     │                     │                     │                     │
     │                     │                     │◄────────────────────┤
     │                     │                     │  Success            │
     │                     │                     │  newBalance         │
     │                     │                     │                     │
     │                     │◄────────────────────┤                     │
     │                     │  Success Response   │                     │
     │                     │  { transactionId,   │                     │
     │                     │    newBalance }     │                     │
     │                     │                     │                     │
     │◄────────────────────┤                     │                     │
     │  Show Success       │                     │                     │
     │  Display New Balance│                     │                     │
     │                     │                     │                     │
```

---

### 6. View Transaction History Flow

```
┌────────────────────────────────────────────────────────────────────┐
│                 TRANSACTION HISTORY FLOW                            │
└────────────────────────────────────────────────────────────────────┘

    User                Frontend              Backend              Database
     │                     │                     │                     │
     │  Navigate to        │                     │                     │
     │  Transaction History│                     │                     │
     ├────────────────────►│                     │                     │
     │                     │                     │                     │
     │                     │  GET /api/          │                     │
     │                     │  transactions/      │                     │
     │                     │  history?           │                     │
     │                     │  accountId=xxx&     │                     │
     │                     │  limit=20&offset=0  │                     │
     │                     ├────────────────────►│                     │
     │                     │                     │                     │
     │                     │                     │  Verify JWT         │
     │                     │                     │  Get userId         │
     │                     │                     │                     │
     │                     │                     │  Validate Account   │
     │                     │                     │  Ownership          │
     │                     │                     ├────────────────────►│
     │                     │                     │                     │
     │                     │                     │◄────────────────────┤
     │                     │                     │  Verified           │
     │                     │                     │                     │
     │                     │                     │  Query Transactions │
     │                     │                     │  WHERE              │
     │                     │                     │    fromAccountId OR │
     │                     │                     │    toAccountId =    │
     │                     │                     │    accountId        │
     │                     │                     │  ORDER BY createdAt │
     │                     │                     │  DESC               │
     │                     │                     │  LIMIT 20 OFFSET 0  │
     │                     │                     ├────────────────────►│
     │                     │                     │                     │
     │                     │                     │◄────────────────────┤
     │                     │                     │  Transaction List   │
     │                     │                     │  + Total Count      │
     │                     │                     │                     │
     │                     │                     │  Format Response    │
     │                     │                     │  - Add +/- to amount│
     │                     │                     │  - Include other    │
     │                     │                     │    party info       │
     │                     │                     │                     │
     │                     │◄────────────────────┤                     │
     │                     │  Success Response   │                     │
     │                     │  { transactions,    │                     │
     │                     │    total }          │                     │
     │                     │                     │                     │
     │◄────────────────────┤                     │                     │
     │  Display Transaction│                     │                     │
     │  List               │                     │                     │
     │                     │                     │                     │
```

---

## Transaction State Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│                  TRANSACTION STATE DIAGRAM                          │
└────────────────────────────────────────────────────────────────────┘


                         ┌─────────────┐
                         │   REQUEST   │
                         │   RECEIVED  │
                         └──────┬──────┘
                                │
                                │ Validate Request
                                │ (account, amount, etc.)
                                │
                          ┌─────▼─────┐
                    ┌─────┤ VALIDATION├─────┐
                    │     └───────────┘     │
                    │                       │
            Valid   │                       │ Invalid
                    │                       │
                    │                       │
          ┌─────────▼──────────┐   ┌───────▼────────┐
          │   START DATABASE   │   │     REJECT     │
          │    TRANSACTION     │   │  Return Error  │
          └─────────┬──────────┘   └────────────────┘
                    │
                    │
          ┌─────────▼──────────┐
          │  UPDATE BALANCES   │
          │  - Debit Source    │
          │  - Credit Dest     │
          └─────────┬──────────┘
                    │
                    │
          ┌─────────▼──────────┐
          │ CREATE TRANSACTION │
          │      RECORD        │
          └─────────┬──────────┘
                    │
                    │
                    │     ┌──────────────┐
                    ├────►│   SUCCESS?   │
                    │     └──────┬───────┘
                    │            │
                    │    Yes     │        No
                    │            │
          ┌─────────▼────┐       │     ┌──────────┐
          │    COMMIT    │       └────►│ ROLLBACK │
          │ TRANSACTION  │             │   ALL    │
          └─────────┬────┘             └────┬─────┘
                    │                       │
                    │                       │
          ┌─────────▼──────────┐   ┌────────▼──────┐
          │    COMPLETED       │   │     FAILED    │
          │  Return Success    │   │  Return Error │
          └────────────────────┘   └───────────────┘
```

---

## Data Flow Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│                      DATA FLOW DIAGRAM                              │
└────────────────────────────────────────────────────────────────────┘


           ┌─────────────────────────────────────────┐
           │              USER                        │
           └───┬──────────────────────────────────┬──┘
               │                                  │
               │ Login Credentials                │ Registration Data
               │                                  │
               │                                  │
    ┌──────────▼──────────┐          ┌───────────▼───────────┐
    │  1.0                │          │  2.0                  │
    │  Authenticate       │          │  Create Account       │
    │  User               │          │                       │
    └──────────┬──────────┘          └───────────┬───────────┘
               │                                  │
               │ JWT Token                        │ Account Info
               │                                  │
               ▼                                  ▼
           ┌───────────────────────────────────────────┐
           │         User Profile Data                  │
           └───┬──────────────────────────────────┬────┘
               │                                  │
               │ View Balance Request             │ Transaction Request
               │                                  │
               │                                  │
    ┌──────────▼──────────┐          ┌───────────▼───────────┐
    │  3.0                │          │  4.0                  │
    │  Retrieve           │          │  Process              │
    │  Account Info       │          │  Transaction          │
    └──────────┬──────────┘          └───────────┬───────────┘
               │                                  │
               │ Balance Data                     │ Transaction Data
               │                                  │ Update Balances
               │                                  │
               │         ┌────────────────────────┘
               │         │
               ▼         ▼
           ┌─────────────────────────┐
           │  5.0                    │
           │  Store/Retrieve         │
           │  From Database          │
           └─────────────────────────┘
                       │
                       │ Persistent Storage
                       │
                       ▼
           ┌─────────────────────────┐
           │    PostgreSQL           │
           │    Database             │
           │  - Users                │
           │  - Accounts             │
           │  - Transactions         │
           └─────────────────────────┘
```

---

## Authentication Flow Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│                  JWT AUTHENTICATION FLOW                            │
└────────────────────────────────────────────────────────────────────┘


  ┌─────────┐                                              ┌──────────┐
  │  User   │                                              │  Server  │
  └────┬────┘                                              └────┬─────┘
       │                                                        │
       │  1. POST /api/auth/login                              │
       │     { email, password }                               │
       ├──────────────────────────────────────────────────────►│
       │                                                        │
       │                                          2. Validate   │
       │                                             Credentials│
       │                                             in DB      │
       │                                                        │
       │                                          3. Generate   │
       │                                             JWT Token  │
       │                                             (expires   │
       │                                              24h)      │
       │                                                        │
       │  4. Return JWT Token                                  │
       │◄──────────────────────────────────────────────────────┤
       │     { token: "eyJhbGc..." }                           │
       │                                                        │
       │  5. Store token in localStorage                       │
       │                                                        │
       │                                                        │
       │  6. GET /api/accounts                                 │
       │     Header: Authorization: Bearer <token>             │
       ├──────────────────────────────────────────────────────►│
       │                                                        │
       │                                          7. Verify JWT │
       │                                             Signature  │
       │                                             Check      │
       │                                             Expiry     │
       │                                                        │
       │                                          8. If Valid,  │
       │                                             Extract    │
       │                                             userId     │
       │                                                        │
       │                                          9. Execute    │
       │                                             Request    │
       │                                                        │
       │  10. Return Protected Data                            │
       │◄──────────────────────────────────────────────────────┤
       │     { accounts: [...] }                               │
       │                                                        │
       │                                                        │
       │  If Token Expired or Invalid:                         │
       │◄──────────────────────────────────────────────────────┤
       │     401 Unauthorized                                  │
       │                                                        │
       │  11. Clear localStorage                               │
       │      Redirect to /login                               │
       │                                                        │
```

---

## Component Hierarchy (Frontend)

```
┌────────────────────────────────────────────────────────────────────┐
│              REACT COMPONENT HIERARCHY                              │
└────────────────────────────────────────────────────────────────────┘


                           App.jsx
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              │               │               │
        AuthProvider    Router Layout    Navbar
              │               │
              │               │
              │      ┌────────┴─────────┐
              │      │                  │
              │   Public            Protected
              │   Routes            Routes
              │      │              (RequireAuth)
              │      │                  │
              │      │                  │
        ┌─────┴──────┴──────┐     ┌─────┴──────────────────┐
        │                   │     │                        │
    ┌───▼───┐         ┌────▼───┐ │                        │
    │ Login │         │Register│ │                        │
    │ Page  │         │  Page  │ │                        │
    └───────┘         └────────┘ │                        │
                                 │                        │
              ┌──────────────────┼──────────────────┐     │
              │                  │                  │     │
        ┌─────▼────────┐  ┌──────▼──────┐  ┌───────▼────┐│
        │  Dashboard   │  │   Transfer  │  │  Deposit   ││
        │    Page      │  │     Page    │  │    Page    ││
        └─────┬────────┘  └──────┬──────┘  └───────┬────┘│
              │                  │                  │     │
     ┌────────┴────────┐         │                  │     │
     │                 │         │                  │     │
┌────▼────┐    ┌──────▼──────┐  │                  │     │
│ Account │    │ Recent Trans│  │                  │     │
│  Card   │    │    List     │  │                  │     │
└─────────┘    └─────────────┘  │                  │     │
                                │                  │     │
        ┌───────────────────────┼──────────────────┘     │
        │                       │                        │
  ┌─────▼────────┐      ┌───────▼────────┐              │
  │ Transaction  │      │   Accounts     │              │
  │   History    │      │     Page       │              │
  │     Page     │      └────────┬───────┘              │
  └──────┬───────┘               │                      │
         │                       │                      │
   ┌─────▼───────┐      ┌────────▼──────┐              │
   │Transaction  │      │  AccountCard  │              │
   │    Item     │      │  Component    │              │
   └─────────────┘      └───────────────┘              │
                                                        │
                        ┌───────────────────────────────┘
                        │
                 ┌──────▼─────────┐
                 │  Common        │
                 │  Components    │
                 └────────────────┘
                        │
         ┌──────────────┼──────────────┐
         │              │              │
    ┌────▼────┐    ┌────▼────┐   ┌────▼────┐
    │ Button  │    │  Input  │   │  Card   │
    └─────────┘    └─────────┘   └─────────┘
```

This comprehensive diagram document includes all the visual representations needed for your hackathon project presentation and implementation!

