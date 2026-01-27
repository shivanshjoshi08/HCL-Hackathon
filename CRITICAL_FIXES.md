# 🚨 CRITICAL FIXES NEEDED

## Current Issues (from terminal log):

### 1. Port 5000 Already in Use ❌
```
Error: listen EADDRINUSE: address already in use :::5000
```

**FIX**: Run these commands:

```bash
# Kill the existing server
lsof -ti:5000 | xargs kill -9

# Or use
pkill -f nodemon
```

### 2. Unknown Field `documentUrl` ❌
```
Unknown field `documentUrl` for select statement on model `User`
```

**FIX**: Database schema not migrated!

```bash
cd /home/ksx/Desktop/devrise/backend

# Push schema to database
npx prisma db push

# Generate Prisma client
npx prisma generate
```

### 3. Database Connection Timeouts ⚠️
```
Can't reach database server at ep-round-lake-ahf1dtpd-pooler.c-3.us-east-1.aws.neon.tech:5432
```

**FIX**: Neon database is sleeping

- Wait 30-60 seconds and try again
- OR go to https://console.neon.tech and wake it up

---

## 🎯 COMPLETE FIX (Run These Commands)

### Step 1: Stop Everything
```bash
# Kill any running servers
pkill -f nodemon
lsof -ti:5000 | xargs kill -9

# Wait 3 seconds
sleep 3
```

### Step 2: Fix Database Schema
```bash
cd /home/ksx/Desktop/devrise/backend

# Generate Prisma client first
npx prisma generate

# Push schema to database (adds documentUrl field)
npx prisma db push --accept-data-loss

# This will add:
# - documentUrl (String?)
# - kycRejectionReason (String?)
```

### Step 3: Start Fresh
```bash
# Make sure you're in backend folder
cd /home/ksx/Desktop/devrise/backend

# Start server
npm run dev
```

---

## 📋 Quick One-Liner Fix

Copy and paste this entire command:

```bash
pkill -f nodemon; sleep 2; cd /home/ksx/Desktop/devrise/backend && npx prisma generate && npx prisma db push --accept-data-loss && npm run dev
```

---

## ✅ After Running Fix

You should see:
```
🚀 Server is running on port 5000
📍 Environment: development
🔗 API URL: http://localhost:5000
```

Then test:
1. Go to http://localhost:5173/register
2. Fill all fields (including KYC)
3. Register successfully
4. Login
5. No more `documentUrl` errors!

---

## 🔍 Why This Happened

1. **Port in use**: You tried to start server twice
2. **documentUrl error**: Schema file was updated but database wasn't
3. **Database timeout**: Neon free tier sleeps after 5 minutes

---

## 💡 Pro Tip

To avoid port conflicts in future:

```bash
# Always check port before starting
lsof -ti:5000 && echo "Port 5000 is busy!" || npm run dev
```

Or add to `package.json`:

```json
"scripts": {
  "dev": "pkill -f nodemon || true && nodemon server.js"
}
```

---

## 🎊 After Everything Works

Your app will have:
- ✅ All KYC fields working
- ✅ Document upload ready
- ✅ No schema errors
- ✅ Clean server start

**Run the one-liner fix command now! 🚀**
