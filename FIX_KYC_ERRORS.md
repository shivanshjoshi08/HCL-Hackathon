# 🔧 FIX KYC ERRORS - MANUAL STEPS

## ❌ Current Errors

### 1. Database Schema Not Updated
```
Unknown field `documentUrl` for select statement on model `User`
```

### 2. Registration Not Sending KYC Fields
Registration was only sending: firstName, lastName, email, password
Missing: phone, address, dateOfBirth, idType, idNumber

---

## ✅ FIXES APPLIED

### 1. Frontend Registration Fixed ✅
**File**: `frontend/src/pages/Register.jsx`

**Changes Made**:
- Now sends ALL KYC fields to backend:
  - phone
  - address
  - dateOfBirth
  - idType
  - idNumber
- Updated password validation (8+ chars)

### 2. Schema Already Updated ✅
**File**: `backend/prisma/schema.prisma`

Already has these fields:
```prisma
model User {
  ...
  documentUrl  String?  // Cloudinary URL
  kycRejectionReason String?
  ...
}
```

---

## 🚀 MANUAL STEPS TO FIX

### Step 1: Run Database Migration

Open a NEW terminal and run:

```bash
cd /home/ksx/Desktop/devrise/backend

# Generate Prisma client
npx prisma generate

# Push schema to database (fastest)
npx prisma db push

# OR create a migration (more controlled)
npx prisma migrate dev --name add_kyc_document_fields
```

**Expected Output**:
```
✔ Generated Prisma Client
✔ Database synchronized with Prisma schema
```

### Step 2: Verify Schema

```bash
# Check if fields exist
npx prisma studio
```

This will open Prisma Studio in browser. Check the `User` model has:
- ✅ documentUrl
- ✅ kycRejectionReason

### Step 3: Restart Backend Server

```bash
# If server is running, press Ctrl+C to stop
# Then restart:
npm run dev
```

### Step 4: Test Registration

1. Go to: http://localhost:5173/register
2. Fill ALL fields:
   - First Name: Test
   - Last Name: User
   - Email: test@example.com
   - Password: **Password123** (8+ chars, uppercase, lowercase, number)
   - Confirm Password: Password123
   - Phone: 9876543210
   - Date of Birth: 1990-01-01
   - Address: Test Address
   - ID Type: Aadhaar
   - ID Number: 123456789012
3. Click "Create Account"

**Expected**:
- ✅ Account created
- ✅ KYC status: PENDING
- ✅ All fields saved

### Step 5: Test KYC Upload

1. Login with the new account
2. Go to: http://localhost:5173/kyc-upload
3. Upload Aadhaar/PAN image
4. File uploads to Cloudinary
5. Status changes to PENDING

---

## 🔍 Troubleshooting

### Error: "Can't reach database server"

**Solution**: Check internet connection. Neon DB requires internet.

```bash
# Test connection
ping ep-round-lake-ahf1dtpd-pooler.c-3.us-east-1.aws.neon.tech
```

### Error: "Unknown field documentUrl"

**Solution**: Run `npx prisma db push` or `npx prisma migrate dev`

### Error: "Password must be at least 8 characters"

**Solution**: Use strong password like `Password123`

---

## 📋 Quick Commands

```bash
# 1. Go to backend
cd /home/ksx/Desktop/devrise/backend

# 2. Push schema (fastest)
npx prisma db push

# 3. Generate client
npx prisma generate

# 4. Restart server
npm run dev
```

---

## ✅ What's Fixed

### Frontend
- ✅ Registration now sends ALL KYC fields
- ✅ Password validation updated (8+ chars)
- ✅ All form fields connected properly

### Backend
- ✅ Schema has documentUrl field
- ✅ Schema has kycRejectionReason field
- ✅ Controllers ready for KYC
- ✅ Routes configured

### What You Need to Do
- 🔧 Run `npx prisma db push` to update database
- 🔧 Restart backend server
- ✅ Test registration with all fields

---

## 🎯 After Running Commands

Your app will:
1. ✅ Accept ALL KYC fields during registration
2. ✅ Save user with KYC data
3. ✅ Allow KYC document upload
4. ✅ Store documents in Cloudinary
5. ✅ Admin can verify KYC

**Run the commands and test! 🚀**
