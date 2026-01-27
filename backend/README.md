# SmartBank Banking Backend System

A secure, scalable backend system for core banking operations built with Node.js, Express, Prisma, and PostgreSQL.

## 🎯 Objective

Build a secure, scalable backend system that supports:
- Account management
- Money transactions
- Fraud detection (optional)
- Complete audit logging

## 🏗️ Architecture

- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Authentication**: JWT
- **Validation**: express-validator

## 📋 Features

### Core Features
1. ✅ User Registration & Authentication
2. ✅ Account Creation (Savings, Checking, Current, FD)
3. ✅ Money Deposit
4. ✅ Money Transfer
5. ✅ Transaction History
6. ✅ Daily Limit Validation
7. ✅ Complete Audit Logging

### Security Features
- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Input validation & sanitization
- ✅ SQL injection protection (Prisma)
- ✅ Error handling
- ✅ Request logging

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- PostgreSQL database
- npm or yarn

### Installation

```bash
# Navigate to backend directory
cd /home/ksx/Desktop/devrise/backend

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Start development server
npm run dev
```

The server will run on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── config/
│   │   └── database.js        # Prisma client
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── account.controller.js
│   │   └── transaction.controller.js
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication
│   │   ├── errorHandler.js    # Error handling
│   │   └── validator.js       # Input validation
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── account.routes.js
│   │   └── transaction.routes.js
│   └── utils/
│       ├── AppError.js        # Custom error class
│       ├── helpers.js         # Utility functions
│       └── jwt.js             # JWT utilities
├── server.js                  # Entry point
├── package.json
└── .env                       # Environment variables
```

## 🔐 Environment Variables

```env
DATABASE_URL="postgresql://user:password@host:5432/database"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="24h"
PORT=5000
NODE_ENV="development"
```

## 📡 API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

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

#### Login
```http
POST /api/auth/login
Content-Type: application/json

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
      "lastName": "Doe",
      "role": "customer"
    }
  }
}
```

### Accounts (Protected)

#### Get All Accounts
```http
GET /api/accounts
Authorization: Bearer {token}
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
        "status": "ACTIVE",
        "createdAt": "2024-01-27T10:00:00Z"
      }
    ]
  }
}
```

#### Get Account Balance
```http
GET /api/accounts/:accountId/balance
Authorization: Bearer {token}
```

### Transactions (Protected)

#### Deposit Money
```http
POST /api/transactions/deposit
Authorization: Bearer {token}
Content-Type: application/json

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
      "timestamp": "2024-01-27T10:30:00Z"
    }
  }
}
```

#### Transfer Money
```http
POST /api/transactions/transfer
Authorization: Bearer {token}
Content-Type: application/json

{
  "fromAccountId": "uuid",
  "toAccountNumber": "0987654321",
  "amount": 500.00,
  "description": "Payment"
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

#### Get Transaction History
```http
GET /api/transactions/history?accountId={uuid}&limit=20&offset=0
Authorization: Bearer {token}
```

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
        "description": "Payment",
        "status": "COMPLETED",
        "createdAt": "2024-01-27T10:30:00Z",
        "otherParty": "Account 0987654321"
      }
    ],
    "total": 15
  }
}
```

## 🔒 Security Features

### Authentication
- JWT-based stateless authentication
- Token expiration (24 hours)
- Password hashing with bcrypt (12 rounds)

### Validation
- Input validation with express-validator
- SQL injection protection (Prisma)
- XSS protection
- Request sanitization

### Error Handling
- Centralized error handling
- Clean error messages in production
- Detailed errors in development
- Logging for debugging

## 🏦 Business Logic

### Account Rules
- Auto-create SAVINGS account on registration
- Account types: SAVINGS, CHECKING, CURRENT, FD
- Account status: ACTIVE, FROZEN, CLOSED
- Unique 10-digit account number

### Transaction Rules
- Minimum deposit: ₹0.01
- Minimum transfer: ₹0.01
- Daily transfer limit: ₹50,000 (configurable)
- Atomic transactions (ACID compliance)
- Balance validation before transfer
- Active account status check

### Daily Limit Validation
- Tracks all transfers for the day (00:00 - 23:59)
- Validates before each transfer
- Returns error if limit exceeded
- Resets at midnight

## 🗄️ Database Schema

### Users Table
- id (UUID, Primary Key)
- email (Unique)
- password (Hashed)
- firstName
- lastName
- role (customer/admin)
- timestamps

### Accounts Table
- id (UUID, Primary Key)
- accountNumber (Unique)
- accountType
- balance (Decimal 15,2)
- dailyLimit (Decimal 15,2)
- status
- userId (Foreign Key)
- timestamps

### Transactions Table
- id (UUID, Primary Key)
- fromAccountId (Foreign Key, Nullable)
- toAccountId (Foreign Key, Nullable)
- transactionType
- amount (Decimal 15,2)
- balanceAfter (Decimal 15,2)
- description
- status
- timestamp

## 🧪 Testing

### Using Postman

1. Register a user
2. Login and copy the token
3. Use token in Authorization header for protected routes

### Prisma Studio

View and manage database:
```bash
npx prisma studio
```

## 📊 Logging

All transactions are logged with:
- Transaction ID
- User ID
- Account IDs
- Amount
- Type
- Timestamp
- Status
- Description

## 🚀 Deployment

### Docker (Optional)
```bash
docker build -t smartbank-api .
docker run -p 5000:5000 smartbank-api
```

### Production Checklist
- [ ] Set strong JWT_SECRET
- [ ] Use production database
- [ ] Enable HTTPS
- [ ] Set NODE_ENV=production
- [ ] Configure CORS properly
- [ ] Set up monitoring
- [ ] Enable rate limiting
- [ ] Add request logging
- [ ] Set up backups

## 📝 Scripts

```bash
npm run dev          # Start development server
npm start            # Start production server
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open Prisma Studio
```

## 🐛 Troubleshooting

### Database Connection Error
- Check DATABASE_URL in .env
- Verify PostgreSQL is running
- Check database credentials

### JWT Error
- Check JWT_SECRET is set
- Verify token format (Bearer {token})
- Check token expiration

### Prisma Errors
- Run `npx prisma generate`
- Run `npx prisma migrate dev`
- Check schema.prisma syntax

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js](https://expressjs.com/)
- [JWT](https://jwt.io/)

## ✅ Completed Features

- [x] User Registration
- [x] User Authentication
- [x] Account Creation
- [x] Money Deposit
- [x] Money Transfer
- [x] Transaction History
- [x] Daily Limit Validation
- [x] Balance Validation
- [x] Error Handling
- [x] Input Validation
- [x] Logging
- [x] JWT Authentication
- [x] ACID Transactions

## 🎉 Ready for Production!

Your banking backend is complete with all 5 core use cases implemented!
