# SmartBank API Documentation

## Base URL
```
http://localhost:5000
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer {your_jwt_token}
```

---

## Endpoints

### 1. Health Check

#### GET /
Check if API is running

**Response:**
```json
{
  "success": true,
  "message": "SmartBank API is running",
  "version": "1.0.0"
}
```

#### GET /health
Server health status

**Response:**
```json
{
  "success": true,
  "message": "Server is healthy",
  "timestamp": "2024-01-27T10:00:00.000Z"
}
```

---

## Authentication Endpoints

### 2. Register User

#### POST /api/auth/register

Register a new user and create a default savings account.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Validation:**
- `email`: Must be valid email format
- `password`: Minimum 6 characters
- `firstName`: Required
- `lastName`: Required

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john@example.com",
    "accountNumber": "1234567890"
  }
}
```

**Error Responses:**
- `400`: User already exists
- `400`: Validation error

---

### 3. Login

#### POST /api/auth/login

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer"
    }
  }
}
```

**Error Responses:**
- `401`: Invalid email or password

---

## Account Endpoints (Protected)

### 4. Get All Accounts

#### GET /api/accounts

Get all accounts for the authenticated user.

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "accounts": [
      {
        "id": "660e8400-e29b-41d4-a716-446655440000",
        "accountNumber": "1234567890",
        "accountType": "SAVINGS",
        "balance": "5000.00",
        "status": "ACTIVE",
        "createdAt": "2024-01-27T10:00:00.000Z"
      },
      {
        "id": "770e8400-e29b-41d4-a716-446655440000",
        "accountNumber": "0987654321",
        "accountType": "CHECKING",
        "balance": "3000.00",
        "status": "ACTIVE",
        "createdAt": "2024-01-28T10:00:00.000Z"
      }
    ]
  }
}
```

**Error Responses:**
- `401`: Unauthorized (invalid/missing token)

---

### 5. Get Account Balance

#### GET /api/accounts/:accountId/balance

Get balance for a specific account.

**Headers:**
```
Authorization: Bearer {token}
```

**URL Parameters:**
- `accountId`: Account UUID

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "accountNumber": "1234567890",
    "accountType": "SAVINGS",
    "balance": "5000.00"
  }
}
```

**Error Responses:**
- `404`: Account not found
- `403`: You do not have access to this account
- `401`: Unauthorized

---

## Transaction Endpoints (Protected)

### 6. Deposit Money

#### POST /api/transactions/deposit

Deposit money into an account.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "accountId": "660e8400-e29b-41d4-a716-446655440000",
  "amount": 1000.00,
  "description": "Cash deposit"
}
```

**Validation:**
- `accountId`: Required, must be valid UUID
- `amount`: Required, must be greater than 0
- `description`: Optional

**Success Response (200):**
```json
{
  "success": true,
  "message": "Deposit successful",
  "data": {
    "transactionId": "880e8400-e29b-41d4-a716-446655440000",
    "newBalance": "6000.00",
    "transaction": {
      "type": "DEPOSIT",
      "amount": "1000.00",
      "timestamp": "2024-01-27T10:30:00.000Z"
    }
  }
}
```

**Error Responses:**
- `400`: Amount must be greater than 0
- `400`: Account is not active
- `404`: Account not found
- `401`: Unauthorized

**Business Rules:**
- Amount must be positive
- Account must be ACTIVE
- Account must belong to authenticated user
- Transaction is atomic

---

### 7. Transfer Money

#### POST /api/transactions/transfer

Transfer money from one account to another.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "fromAccountId": "660e8400-e29b-41d4-a716-446655440000",
  "toAccountNumber": "0987654321",
  "amount": 500.00,
  "description": "Payment to friend"
}
```

**Validation:**
- `fromAccountId`: Required, must be valid UUID
- `toAccountNumber`: Required, 10-digit account number
- `amount`: Required, must be greater than 0
- `description`: Optional

**Success Response (200):**
```json
{
  "success": true,
  "message": "Transfer successful",
  "data": {
    "transactionId": "990e8400-e29b-41d4-a716-446655440000",
    "newBalance": "5500.00"
  }
}
```

**Error Responses:**
- `400`: Amount must be greater than 0
- `400`: Insufficient balance
- `400`: Daily transfer limit exceeded
- `400`: Source account is not active
- `400`: Destination account is not active
- `400`: Cannot transfer to the same account
- `404`: Source account not found
- `404`: Destination account not found
- `401`: Unauthorized

**Business Rules:**
- Amount must be positive
- Source account must have sufficient balance
- Daily limit: ₹50,000 (aggregated from 00:00 to 23:59)
- Both accounts must be ACTIVE
- Source account must belong to authenticated user
- Transaction is atomic (both debit and credit succeed or both fail)

---

### 8. Get Transaction History

#### GET /api/transactions/history

Get transaction history for an account.

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `accountId`: Required, Account UUID
- `limit`: Optional, default 20, max results
- `offset`: Optional, default 0, pagination offset

**Example:**
```
GET /api/transactions/history?accountId=660e8400-e29b-41d4-a716-446655440000&limit=20&offset=0
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "aa0e8400-e29b-41d4-a716-446655440000",
        "type": "TRANSFER",
        "amount": "-500.00",
        "balanceAfter": "5500.00",
        "description": "Payment to friend",
        "status": "COMPLETED",
        "createdAt": "2024-01-27T10:30:00.000Z",
        "otherParty": "Account 0987654321"
      },
      {
        "id": "bb0e8400-e29b-41d4-a716-446655440000",
        "type": "DEPOSIT",
        "amount": "1000.00",
        "balanceAfter": "6000.00",
        "description": "Cash deposit",
        "status": "COMPLETED",
        "createdAt": "2024-01-27T10:00:00.000Z",
        "otherParty": "Account N/A"
      }
    ],
    "total": 15
  }
}
```

**Error Responses:**
- `400`: Account ID is required
- `404`: Account not found
- `401`: Unauthorized

**Notes:**
- Transactions are sorted by date (newest first)
- Debit transactions show negative amounts
- Credit transactions show positive amounts
- `balanceAfter` shows account balance after the transaction

---

## Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "error": {
    "message": "Error description"
  }
}
```

### Development Environment
Includes additional error details:
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "stack": "Error stack trace...",
    "error": { /* full error object */ }
  }
}
```

---

## HTTP Status Codes

- `200`: Success
- `201`: Created (registration)
- `400`: Bad Request (validation error, business logic error)
- `401`: Unauthorized (invalid/missing token)
- `403`: Forbidden (no permission)
- `404`: Not Found
- `500`: Internal Server Error

---

## Testing with Postman

### 1. Register
```
POST http://localhost:5000/api/auth/register
Body (JSON):
{
  "email": "test@example.com",
  "password": "test123",
  "firstName": "Test",
  "lastName": "User"
}
```

### 2. Login
```
POST http://localhost:5000/api/auth/login
Body (JSON):
{
  "email": "test@example.com",
  "password": "test123"
}

Save the token from response
```

### 3. Get Accounts
```
GET http://localhost:5000/api/accounts
Headers:
Authorization: Bearer {your_token}
```

### 4. Deposit
```
POST http://localhost:5000/api/transactions/deposit
Headers:
Authorization: Bearer {your_token}
Body (JSON):
{
  "accountId": "{account_id_from_step_3}",
  "amount": 5000,
  "description": "Initial deposit"
}
```

### 5. Transfer
```
POST http://localhost:5000/api/transactions/transfer
Headers:
Authorization: Bearer {your_token}
Body (JSON):
{
  "fromAccountId": "{your_account_id}",
  "toAccountNumber": "{destination_account_number}",
  "amount": 500,
  "description": "Test transfer"
}
```

### 6. Transaction History
```
GET http://localhost:5000/api/transactions/history?accountId={account_id}&limit=20
Headers:
Authorization: Bearer {your_token}
```

---

## Rate Limiting (Future Enhancement)

Recommended limits:
- `/api/auth/login`: 5 requests per 15 minutes
- `/api/auth/register`: 3 requests per hour
- All other endpoints: 100 requests per 15 minutes

---

## Notes

- All monetary amounts are in Decimal format (15,2)
- All timestamps are in ISO 8601 format
- Account numbers are 10-digit strings
- UUIDs are used for all IDs
- Transactions are ACID compliant
- Daily limits reset at midnight (00:00)
