# 🚀 QUICK TEST CREDENTIALS

## Admin Login
```
Email: admin@bankapp.com
Password: admin123
```

**Admin can:**
- View all customer data
- Manage accounts (freeze/unfreeze/close)
- Monitor all transactions
- Switch between Admin Panel and Customer View

---

## Customer Login (Create Your Own)

**Register a new customer:**
1. Go to http://localhost:5173/register
2. Use any email (e.g., `customer1@test.com`)
3. Password: `test123` (or your choice)
4. Fill in name

**Customer can:**
- View their accounts
- Deposit money
- Transfer to other accounts
- View transaction history

---

## Test Flow

### 1. Test Admin:
```bash
# Login as admin@bankapp.com / admin123
# You'll see "Admin Panel" button in navbar
# Click it to see:
  - System Overview Dashboard
  - User Management
  - Account Control  
  - Transaction Monitor
```

### 2. Test Customer:
```bash
# Register as customer1@test.com
# Login
# You'll see customer dashboard with:
  - Your accounts
  - Total balance
  - Quick actions (Transfer, Deposit, History)
  - Recent activity
```

### 3. Test Admin Switching:
```bash
# Login as admin
# Click "Customer View" to see customer dashboard
# Click "Admin Panel" to go back to admin
```

---

## Features

✅ **Admin doesn't appear in customer lists**
✅ **Admin accounts don't show in stats**
✅ **Clean responsive navbar**
✅ **Professional UI (no AI slop)**
✅ **Easy switching between views**
✅ **Mobile responsive**

---

## Notes

- Admin has NO bank accounts (admin role only)
- Admin sees ONLY customer data
- Customers can ONLY see their own data
- Clean, modern, professional design
- Fully responsive on all devices
