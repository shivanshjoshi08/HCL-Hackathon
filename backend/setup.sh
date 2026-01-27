#!/bin/bash

echo "🚀 Setting up SmartBank Backend..."
echo ""

# Navigate to backend directory
cd /home/ksx/Desktop/devrise/backend

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🗄️  Generating Prisma client..."
npx prisma generate

echo ""
echo "🔄 Running database migrations..."
npx prisma migrate dev --name init

echo ""
echo "✅ Backend setup complete!"
echo ""
echo "To start the development server, run:"
echo "  cd /home/ksx/Desktop/devrise/backend"
echo "  npm run dev"
echo ""
echo "The API will be available at: http://localhost:5000"
echo ""
echo "To view the database, run:"
echo "  npx prisma studio"
