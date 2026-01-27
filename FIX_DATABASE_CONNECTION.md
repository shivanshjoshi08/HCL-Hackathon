# 🔧 FIX DATABASE CONNECTION ERROR

## ❌ Current Error
```
Can't reach database server at ep-round-lake-ahf1dtpd-pooler.c-3.us-east-1.aws.neon.tech:5432
```

---

## 🚀 QUICK SOLUTIONS

### Solution 1: Wake Up Neon Database (Most Common)

Neon free tier databases sleep after 5 minutes of inactivity.

**Steps:**
1. Go to: https://console.neon.tech
2. Login to your account
3. Find your project: `neondb`
4. Click on the database
5. Click **"Wake up"** or wait 30 seconds for auto-wake

**Then try again:**
```bash
cd /home/ksx/Desktop/devrise/backend
npm run dev
```

---

### Solution 2: Get New Connection String

If the database URL changed:

1. Go to: https://console.neon.tech
2. Login to your account
3. Select your project
4. Go to **Dashboard** → **Connection Details**
5. Copy the **Connection string** (Pooled)
6. Update `.env` file:

```env
DATABASE_URL="your_new_connection_string_here"
```

---

### Solution 3: Test Connection

Run this command to test:

```bash
cd /home/ksx/Desktop/devrise/backend

# Test connection
npx prisma db pull
```

**If successful:**
```
✔ Introspected 3 models and wrote them into prisma/schema.prisma
```

**If failed:**
- Database is sleeping → Wait 30 seconds
- Wrong credentials → Get new connection string
- Network issue → Check internet

---

### Solution 4: Use Direct Connection String

Neon has two types of connections:
1. **Pooled** (recommended): `ep-round-lake-ahf1dtpd-pooler.c-3.us-east-1.aws.neon.tech`
2. **Direct**: `ep-round-lake-ahf1dtpd.c-3.us-east-1.aws.neon.tech`

Try the direct connection:

```env
# In .env file - remove "-pooler" from URL
DATABASE_URL="postgresql://neondb_owner:npg_7txgeaMnJD8H@ep-round-lake-ahf1dtpd.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

---

## 🎯 RECOMMENDED FIX (Do This First)

### Step 1: Wake Up Database
1. Go to https://console.neon.tech
2. Login
3. Open your project
4. Database should wake up automatically

### Step 2: Wait 30 Seconds
The database takes ~30 seconds to wake from sleep mode.

### Step 3: Test Backend
```bash
cd /home/ksx/Desktop/devrise/backend
npm run dev
```

### Step 4: Try Login Again
Go to: http://localhost:5173/login

---

## 📋 Alternative: Use SQLite for Development

If Neon keeps timing out, switch to local SQLite:

### Update `schema.prisma`:
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

### Update `.env`:
```env
DATABASE_URL="file:./dev.db"
```

### Run migrations:
```bash
npx prisma migrate dev --name init
npx prisma generate
npm run dev
```

**Pros**: No network issues, faster
**Cons**: Local only, not shared

---

## ✅ Quick Test Commands

```bash
# 1. Test if Neon is awake
curl https://ep-round-lake-ahf1dtpd-pooler.c-3.us-east-1.aws.neon.tech:5432

# 2. Test database connection
cd /home/ksx/Desktop/devrise/backend
npx prisma db pull

# 3. Restart backend
npm run dev

# 4. Try login
# Go to http://localhost:5173/login
```

---

## 🔍 Understanding Neon Sleep

**Neon Free Tier:**
- Database sleeps after **5 minutes** of inactivity
- Takes **10-30 seconds** to wake up
- First request after sleep will timeout
- Subsequent requests work fine

**Solution:**
- Keep browser tab open to keep connection alive
- OR upgrade to Neon paid plan (no sleep)
- OR use local SQLite for development

---

## 🎊 Most Likely Fix

**Your database is just sleeping!**

1. Wait 30-60 seconds
2. Try login again
3. Should work!

If still not working, go to Neon console and manually wake it up.

**Neon Console**: https://console.neon.tech
