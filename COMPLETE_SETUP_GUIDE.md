# 🎉 COMPLETE SETUP GUIDE - SmartBank with Admin Panel

## ✅ What You Have

A **complete full-stack banking system** with:
- ✅ Customer Portal (React Frontend)
- ✅ Admin Panel (Full Management Dashboard)
- ✅ Backend API (Node.js + Express + Prisma)
- ✅ Database (PostgreSQL - Neon)
- ✅ All 5 Core Banking Features
- ✅ Complete Admin Management

---

## 🚀 Step-by-Step Setup

### Step 1: Backend Setup

```bash
# Navigate to backend
cd /home/ksx/Desktop/devrise/backend

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Create admin user
npm run create:admin

# Start backend server
npm run dev
```

**Backend will run on:** `http://localhost:5000`

**Admin Credentials Created:**
- Email: `admin@bankapp.com`
- Password: `admin123`

---

### Step 2: Frontend Setup

```bash
# Navigate to frontend (open new terminal)
cd /home/ksx/Desktop/devrise/frontend

# Install dependencies
npm install

# Start frontend server
npm run dev
```

**Frontend will run on:** `http://localhost:5173`

---

## 👥 Testing the System

### Test 1: Customer Flow

1. **Register Customer:**
   - Go to `http://localhost:5173/register`
   - Email: `customer@test.com`
   - Password: `test123`
   - Name: John Doe
   - Click Register

2. **Login as Customer:**
   - Go to `http://localhost:5173/login`
   - Login with customer credentials
   - View dashboard

3. **Deposit Money:**
   - Click "Deposit" from dashboard
   - Select account
   - Amount: 10000
   - Submit

4. **Transfer Money:**
   - Create another customer account first
   - Go to Transfer page
   - Enter destination account number
   - Amount: 500
   - Submit

5. **View History:**
   - Go to Transactions page
   - See all your transactions

---

### Test 2: Admin Flow

1. **Login as Admin:**
   - Go to `http://localhost:5173/login`
   - Email: `admin@bankapp.com`
   - Password: `admin123`
   - Login

2. **View Dashboard:**
   - You'll see "Admin Panel" button in navbar
   - Click it or go to `/admin/dashboard`
   - See all statistics

3. **Manage Users:**
   - Click "Manage Users" or go to `/admin/users`
   - Search for users
   - View user details
   - See all accounts

4. **Manage Accounts:**
   - Click "Manage Accounts" or go to `/admin/accounts`
   - See all accounts
   - Freeze an account (test it)
   - Activate it back

5. **Monitor Transactions:**
   - Click "View Transactions" or go to `/admin/transactions`
   - See all system transactions
   - Search by account number or type

---

## 🎯 Features Overview

### Customer Features
- ✅ Register & Login
- ✅ View Dashboard
- ✅ Multiple Accounts
- ✅ View Balances
- ✅ Deposit Money
- ✅ Transfer Money
- ✅ Transaction History
- ✅ Account Management

### Admin Features
- ✅ Admin Dashboard with Stats
- ✅ User Management
- ✅ Account Management
- ✅ Freeze/Unfreeze Accounts
- ✅ Close Accounts
- ✅ Transaction Monitoring
- ✅ Search Functionality
- ✅ Real-time Statistics

---

## 📡 API Endpoints

### Customer APIs
```
POST   /api/auth/register              - Register
POST   /api/auth/login                 - Login
GET    /api/accounts                   - Get accounts
GET    /api/accounts/:id/balance       - Get balance
POST   /api/transactions/deposit       - Deposit
POST   /api/transactions/transfer      - Transfer
GET    /api/transactions/history       - History
```

### Admin APIs
```
GET    /api/admin/dashboard/stats      - Dashboard stats
GET    /api/admin/users                - All users
GET    /api/admin/users/:id            - User details
GET    /api/admin/accounts             - All accounts
PATCH  /api/admin/accounts/:id/status  - Update status
GET    /api/admin/transactions         - All transactions
```

---

## 🗄️ Database Schema

### Tables Created

**users**
- id (UUID)
- email (unique)
- password (hashed)
- firstName
- lastName
- role (customer/admin)
- timestamps

**accounts**
- id (UUID)
- accountNumber (unique)
- accountType
- balance
- dailyLimit
- status
- userId (FK)
- timestamps

**transactions**
- id (UUID)
- fromAccountId (FK)
- toAccountId (FK)
- transactionType
- amount
- balanceAfter
- description
- status
- timestamp

---

## 🔐 Security Features

### Backend Security
- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ Role-based access control
- ✅ Input validation
- ✅ SQL injection protection (Prisma)
- ✅ Error sanitization

### Frontend Security
- ✅ Protected routes
- ✅ Token storage
- ✅ Auto-logout on invalid token
- ✅ Role-based UI
- ✅ XSS protection

---

## 💼 Business Rules

### Account Rules
- Auto-create SAVINGS on registration
- Unique 10-digit account numbers
- Account types: SAVINGS, CHECKING, CURRENT, FD
- Status: ACTIVE, FROZEN, CLOSED

### Transaction Rules
- Minimum amount: ₹0.01
- Daily transfer limit: ₹50,000
- Balance validation
- Active account required
- ACID transactions

### Admin Rules
- Admin role required for admin panel
- All actions logged
- Confirmation for status changes
- Cannot delete accounts (only close)

---

## 📂 Project Structure

```
devrise/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── scripts/
│   │   └── createAdmin.js
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── account.controller.js
│   │   │   ├── transaction.controller.js
│   │   │   └── admin.controller.js
│   │   ├── middleware/
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── account.routes.js
│   │   │   ├── transaction.routes.js
│   │   │   └── admin.routes.js
│   │   └── utils/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── BankAppLogo.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Transfer.jsx
│   │   │   ├── Deposit.jsx
│   │   │   ├── Transactions.jsx
│   │   │   ├── Accounts.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminUsers.jsx
│   │   │   ├── AdminAccounts.jsx
│   │   │   └── AdminTransactions.jsx
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── Documentation/
    ├── BANKING_PROJECT_PLAN.md
    ├── DIAGRAMS_AND_FLOWS.md
    ├── BACKEND_COMPLETE.md
    ├── API_DOCUMENTATION.md
    ├── ADMIN_GUIDE.md
    └── PROJECT_SUMMARY.md
```

---

## 🐛 Troubleshooting

### Backend Issues

**Database Connection Error:**
```bash
# Check if DATABASE_URL is correct in .env
# Verify Neon database is accessible
```

**Prisma Errors:**
```bash
npx prisma generate
npx prisma migrate dev
```

**Port Already in Use:**
```bash
# Change PORT in backend/.env
# Or kill process using port 5000
```

### Frontend Issues

**Cannot Connect to Backend:**
```bash
# Check VITE_API_URL in frontend/.env
# Should be: http://localhost:5000/api
```

**Compilation Errors:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Admin Issues

**Cannot Access Admin Panel:**
- Ensure admin user is created
- Login with admin credentials
- Check user role in database

**403 Forbidden Error:**
- Token might be expired
- User might not have admin role
- Check JWT_SECRET matches

---

## 🎨 UI Screenshots

### Customer Portal
- Modern login/register
- Gradient dashboard cards
- Clean transaction history
- Beautiful forms

### Admin Panel
- Professional statistics dashboard
- Tabular user/account views
- Real-time transaction monitoring
- Color-coded status indicators

---

## 📊 Database Management

### View Database (Prisma Studio)
```bash
cd backend
npx prisma studio
```
Opens at: `http://localhost:5555`

### Reset Database
```bash
npx prisma migrate reset
# Then recreate admin:
npm run create:admin
```

### Seed Test Data (Optional)
Create multiple test users via frontend registration

---

## 🚀 Production Deployment

### Backend (Node.js)
1. Set environment variables
2. Run `npm start`
3. Deploy to Heroku/Railway/Render

### Frontend (React)
1. Build: `npm run build`
2. Deploy to Vercel/Netlify
3. Update VITE_API_URL

### Database
- Already on Neon (cloud PostgreSQL)
- Production-ready

---

## 📝 Quick Commands

### Backend
```bash
npm run dev          # Start dev server
npm start            # Start production
npm run create:admin # Create admin user
npx prisma studio    # View database
npx prisma migrate dev # Run migrations
```

### Frontend
```bash
npm run dev    # Start dev server
npm run build  # Build for production
npm run preview # Preview production build
```

---

## 🎯 Demo Checklist

Before your demo:
- [ ] Backend running
- [ ] Frontend running
- [ ] Admin user created
- [ ] Test customer created
- [ ] Test deposits done
- [ ] Test transfers done
- [ ] Admin panel tested
- [ ] All pages working

---

## 🎊 You're All Set!

Your complete banking system with admin panel is ready!

### What Works:
✅ Customer registration & login
✅ Account management
✅ Deposits & transfers
✅ Transaction history
✅ Admin dashboard
✅ User management
✅ Account freeze/unfreeze
✅ Transaction monitoring
✅ Search & filters
✅ Real-time statistics
✅ Beautiful UI
✅ Secure backend
✅ Complete documentation

**Good luck with your hackathon! 🚀**
