#!/bin/bash

echo "🔧 FIXING ALL ISSUES..."
echo ""

# Step 1: Kill existing server on port 5000
echo "1️⃣ Stopping existing server..."
lsof -ti:5000 | xargs kill -9 2>/dev/null || echo "   No process on port 5000"
sleep 2

# Step 2: Go to backend directory
cd "$(dirname "$0")/backend" || exit 1
echo "   ✓ In backend directory"

# Step 3: Add migration SQL directly to database
echo ""
echo "2️⃣ Adding documentUrl and kycRejectionReason to database..."
echo "   This will update the User table schema..."

# Step 4: Generate Prisma client
echo ""
echo "3️⃣ Generating Prisma client..."
npx prisma generate

# Step 5: Push schema to database
echo ""
echo "4️⃣ Pushing schema to database..."
npx prisma db push --skip-generate

echo ""
echo "✅ SETUP COMPLETE!"
echo ""
echo "📝 Now run these commands:"
echo ""
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "🎯 The server should start without errors!"
