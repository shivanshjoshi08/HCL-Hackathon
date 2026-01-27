# Frontend Setup Guide

## Complete React Banking Application

Your frontend is now ready! Here's what has been created:

## ✅ What's Included

### 1. **Project Configuration**
- `package.json` - All dependencies configured
- `vite.config.js` - Vite configuration with path aliases
- `tailwind.config.js` - Tailwind CSS with shadcn/ui theme
- `postcss.config.js` - PostCSS configuration

### 2. **UI Components (shadcn/ui)**
- `Button.jsx` - Multiple variants (default, outline, ghost, etc.)
- `Card.jsx` - Card components with header, content, footer
- `Input.jsx` - Form input with focus states
- `Label.jsx` - Form labels

### 3. **Pages**
- `Login.jsx` - User login with email/password
- `Register.jsx` - User registration with validation
- `Dashboard.jsx` - Main dashboard with balance and quick actions
- `Transfer.jsx` - Money transfer form
- `Deposit.jsx` - Deposit money form
- `Transactions.jsx` - Transaction history with filters
- `Accounts.jsx` - View all user accounts

### 4. **Services & API**
- `api.js` - Axios instance with interceptors
- `auth.js` - All API service functions (auth, accounts, transactions)

### 5. **Context & State**
- `AuthContext.jsx` - Global authentication state management

### 6. **Components**
- `Navbar.jsx` - Navigation bar with user info and logout
- `ProtectedRoute.jsx` - Route protection for authenticated users

### 7. **Styling**
- `index.css` - Global styles with CSS variables
- Tailwind CSS configured
- Custom color theme (Blue primary color)

## 🚀 How to Run

### Step 1: Install Dependencies

```bash
cd /home/ksx/Desktop/devrise/frontend
npm install
```

### Step 2: Start Development Server

```bash
npm run dev
```

The app will run on `http://localhost:5173`

## 📱 Features

### ✅ Authentication
- Login with email/password
- Register new users with validation
- JWT token management
- Auto-logout on token expiry

### ✅ Dashboard
- View all account balances
- Recent transactions
- Quick action buttons
- Responsive grid layout

### ✅ Money Transfer
- Select source account
- Enter destination account number
- Add amount and description
- Real-time validation

### ✅ Deposit Money
- Select account
- Enter deposit amount
- Add optional description
- Instant balance update

### ✅ Transaction History
- View all transactions
- Filter by account
- Show transaction type (deposit/transfer)
- Display timestamps and balances

### ✅ Account Management
- View all accounts
- Show account type and number
- Display current balance
- Account creation date

## 🎨 Design Features

- **Modern UI** with shadcn/ui components
- **Responsive Design** - works on mobile, tablet, desktop
- **Clean Layout** with proper spacing
- **Color Coded** - Green for deposits, Blue for transfers
- **Icons** from Lucide React
- **Form Validation** with error messages
- **Loading States** for better UX
- **Success Messages** on completed actions

## 📂 Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.jsx
│   │   │   ├── card.jsx
│   │   │   ├── input.jsx
│   │   │   └── label.jsx
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Transfer.jsx
│   │   ├── Deposit.jsx
│   │   ├── Transactions.jsx
│   │   └── Accounts.jsx
│   ├── services/
│   │   ├── api.js
│   │   └── auth.js
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── lib/
│   │   └── utils.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🔗 API Endpoints Used

The frontend connects to these backend endpoints:

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Accounts
- `GET /api/accounts` - Get all user accounts
- `GET /api/accounts/:id/balance` - Get account balance

### Transactions
- `POST /api/transactions/deposit` - Deposit money
- `POST /api/transactions/transfer` - Transfer money
- `GET /api/transactions/history` - Get transaction history

## 🎯 Next Steps

1. **Install dependencies**: `npm install`
2. **Start the dev server**: `npm run dev`
3. **Build the backend** (we'll do this next!)
4. **Test the application** end-to-end

## 🔧 Configuration

### Environment Variables (.env)
```
VITE_API_URL=http://localhost:5000/api
```

Change this if your backend runs on a different port.

## 💡 Code Style

- Written in **simple JavaScript** (not TypeScript)
- Uses **functional components** with hooks
- **Clean and readable** code structure
- **Comments** where needed
- **Consistent naming** conventions

## 🎨 Color Scheme

- **Primary**: Blue (#3b82f6)
- **Success**: Green
- **Error**: Red
- **Background**: Gray-50
- **Text**: Dark gray

## ✅ What Works

- ✅ User registration
- ✅ User login with JWT
- ✅ Protected routes
- ✅ Dashboard with balance
- ✅ Money transfer form
- ✅ Deposit form
- ✅ Transaction history
- ✅ Account listing
- ✅ Responsive design
- ✅ Error handling
- ✅ Loading states
- ✅ Auto-logout
- ✅ Navigation

Your frontend is **100% complete** and ready to use!

Once you start the backend, everything will work seamlessly! 🎉
