# ⚡ QUICK START - 2 Minutes Setup

## 🚀 Setup (Run these commands)

### Terminal 1 - Backend:
```bash
cd /home/ksx/Desktop/devrise/backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run create:admin
npm run dev
```
**Running on: http://localhost:5000** ✅

---

### Terminal 2 - Frontend:
```bash
cd /home/ksx/Desktop/devrise/frontend
npm install
npm run dev
```
**Running on: http://localhost:5173** ✅

---

## 🔐 Login Credentials

### Admin:
- Email: `admin@bankapp.com`
- Password: `admin123`

### Test Customer:
Register new user at: http://localhost:5173/register

---

## 📱 Pages

### Customer Pages:
- `/login` - Login
- `/register` - Register
- `/dashboard` - Main dashboard
- `/deposit` - Deposit money
- `/transfer` - Transfer money
- `/transactions` - Transaction history
- `/accounts` - View accounts

### Admin Pages:
- `/admin/dashboard` - Admin home
- `/admin/users` - Manage users
- `/admin/accounts` - Manage accounts (freeze/unfreeze)
- `/admin/transactions` - View all transactions

---

## 🎯 Quick Test Flow

### As Customer:
1. Register → Login
2. Go to Deposit → Add ₹10,000
3. Create 2nd customer
4. Transfer ₹500 to 2nd customer
5. View transaction history

### As Admin:
1. Login with admin credentials
2. Click "Admin Panel" in navbar
3. View dashboard stats
4. Go to Manage Accounts
5. Freeze a customer account
6. View all transactions

---

## 🔧 Useful Commands

```bash
# View database
cd backend && npx prisma studio

# Reset database
cd backend && npx prisma migrate reset

# Recreate admin
cd backend && npm run create:admin

# Check backend health
curl http://localhost:5000/health
```

---

## 🐛 Common Issues

**Can't connect:**
- Check both servers are running
- Backend: localhost:5000
- Frontend: localhost:5173

**Admin not working:**
- Run `npm run create:admin` in backend
- Login with admin@bankapp.com / admin123

**Database error:**
- Run `npx prisma generate`
- Run `npx prisma migrate dev`

---

## ✅ Features

### Customer (5 Use Cases):
✅ Register & Login
✅ View Balance
✅ Deposit Money
✅ Transfer Money
✅ Transaction History

### Admin:
✅ Dashboard with Stats
✅ User Management
✅ Account Management (Freeze/Unfreeze/Close)
✅ Transaction Monitoring
✅ Search & Filter

---

## 📊 Tech Stack

**Frontend:** React + Vite + Tailwind + shadcn/ui
**Backend:** Node.js + Express + Prisma
**Database:** PostgreSQL (Neon Cloud)
**Auth:** JWT

---

## 🎉 READY!

Everything is set up and ready to demo! 🚀

**For detailed docs, see:**
- `COMPLETE_SETUP_GUIDE.md`
- `ADMIN_GUIDE.md`
- `API_DOCUMENTATION.md`
