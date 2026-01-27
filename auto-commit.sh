#!/bin/bash

# Auto Commit Script - Splits SmartBank project into 20 commits
# Run this script from the devrise directory

set -e

echo "🚀 Starting auto-commit process..."
echo "This will create 20 commits for the SmartBank project"
echo ""

# Reset the last commit to unstage everything
git reset HEAD~1 --soft 2>/dev/null || true
git reset HEAD 2>/dev/null || true

# Commit 1: Project setup files
echo "📦 Commit 1/20: Project setup and configuration"
git add README.md COMPLETE_PROJECT_GUIDE.md fix-all.sh 2>/dev/null || true
git commit -m "chore: Add project documentation and setup scripts" --allow-empty

# Commit 2: Backend package.json and config
echo "📦 Commit 2/20: Backend package configuration"
git add backend/package.json backend/package-lock.json backend/.gitignore
git commit -m "chore: Initialize backend with dependencies"

# Commit 3: Prisma schema and migrations
echo "📦 Commit 3/20: Database schema and migrations"
git add backend/prisma/
git commit -m "feat: Add Prisma schema with User, Account, Transaction models"

# Commit 4: Backend config files
echo "📦 Commit 4/20: Backend configuration"
git add backend/src/config/database.js backend/src/config/cloudinary.js
git commit -m "feat: Add database and cloudinary configuration"

# Commit 5: Backend utilities
echo "📦 Commit 5/20: Backend utilities"
git add backend/src/utils/
git commit -m "feat: Add utility functions (AppError, helpers, JWT)"

# Commit 6: Backend middleware
echo "📦 Commit 6/20: Backend middleware"
git add backend/src/middleware/
git commit -m "feat: Add middleware (auth, errorHandler, rateLimiter, upload, validator)"

# Commit 7: Auth controller and routes
echo "📦 Commit 7/20: Authentication module"
git add backend/src/controllers/auth.controller.js backend/src/routes/auth.routes.js
git commit -m "feat: Add authentication controller and routes (register, login)"

# Commit 8: Account controller and routes
echo "📦 Commit 8/20: Account management module"
git add backend/src/controllers/account.controller.js backend/src/routes/account.routes.js
git commit -m "feat: Add account controller and routes (create, list, balance)"

# Commit 9: Transaction controller and routes
echo "📦 Commit 9/20: Transaction module"
git add backend/src/controllers/transaction.controller.js backend/src/routes/transaction.routes.js
git commit -m "feat: Add transaction controller and routes (deposit, transfer, history)"

# Commit 10: KYC controller and routes
echo "📦 Commit 10/20: KYC verification module"
git add backend/src/controllers/kyc.controller.js backend/src/routes/kyc.routes.js
git commit -m "feat: Add KYC controller and routes (upload, status)"

# Commit 11: Admin controller and routes
echo "📦 Commit 11/20: Admin module"
git add backend/src/controllers/admin.controller.js backend/src/routes/admin.routes.js
git commit -m "feat: Add admin controller and routes (users, accounts, transactions)"

# Commit 12: Backend server and scripts
echo "📦 Commit 12/20: Backend server entry point"
git add backend/server.js backend/setup.sh backend/scripts/ backend/README.md backend/API_DOCUMENTATION.md
git commit -m "feat: Add Express server with all routes and API documentation"

# Commit 13: Frontend package.json and config
echo "📦 Commit 13/20: Frontend package configuration"
git add frontend/package.json frontend/package-lock.json frontend/.gitignore frontend/.dockerignore
git add frontend/vite.config.js frontend/tailwind.config.js frontend/postcss.config.js frontend/index.html
git commit -m "chore: Initialize frontend with Vite, React, and Tailwind CSS"

# Commit 14: Frontend public assets
echo "📦 Commit 14/20: Frontend public assets"
git add frontend/public/ frontend/Dockerfile frontend/setup.sh frontend/README.md frontend/SETUP_GUIDE.md
git commit -m "feat: Add frontend public assets and Docker configuration"

# Commit 15: Frontend base styles and utils
echo "📦 Commit 15/20: Frontend styles and utilities"
git add frontend/src/index.css frontend/src/index.js frontend/src/main.jsx frontend/src/App.css frontend/src/App.jsx
git add frontend/src/styles/ frontend/src/lib/ frontend/src/images/ frontend/src/Context/
git commit -m "feat: Add frontend base styles, utilities, and entry points"

# Commit 16: Frontend UI components
echo "📦 Commit 16/20: Frontend UI components"
git add frontend/src/components/ui/ frontend/src/components/BankAppLogo.jsx frontend/src/components/Card.jsx
git add frontend/src/components/AccountDetails.jsx
git commit -m "feat: Add reusable UI components (Button, Input, Card, Label)"

# Commit 17: Frontend auth and navigation
echo "📦 Commit 17/20: Frontend auth context and navigation"
git add frontend/src/context/AuthContext.jsx frontend/src/components/ProtectedRoute.jsx frontend/src/components/Navbar.jsx
git add frontend/src/services/
git commit -m "feat: Add AuthContext, ProtectedRoute, Navbar, and API services"

# Commit 18: Frontend customer pages
echo "📦 Commit 18/20: Frontend customer pages"
git add frontend/src/pages/Login.jsx frontend/src/pages/Register.jsx frontend/src/pages/Dashboard.jsx
git add frontend/src/pages/Accounts.jsx frontend/src/pages/CreateAccount.jsx
git add frontend/src/pages/Transfer.jsx frontend/src/pages/Deposit.jsx
git add frontend/src/pages/Transactions.jsx frontend/src/pages/Statement.jsx frontend/src/pages/KycUpload.jsx
git commit -m "feat: Add customer pages (Dashboard, Accounts, Transfer, Deposit, Transactions)"

# Commit 19: Frontend admin pages and features
echo "📦 Commit 19/20: Frontend admin pages"
git add frontend/src/pages/Admin*.jsx frontend/src/features/
git commit -m "feat: Add admin pages (Dashboard, Users, Accounts, Transactions, KYC)"

# Commit 20: Chatbot integration
echo "📦 Commit 20/20: RAG Chatbot integration"
git add backend/src/config/chatbot.js backend/src/controllers/chatbot.controller.js backend/src/routes/chatbot.routes.js
git add frontend/src/components/ChatWidget.jsx
git commit -m "feat: Add SmartBank RAG chatbot with knowledge base and navigation"

echo ""
echo "✅ Auto-commit complete! Created 20 commits."
echo ""
echo "📊 Commit history:"
git log --oneline -22
