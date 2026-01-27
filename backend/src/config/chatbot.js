export const botConfig = {
  botName: 'SmartBank Assistant',

  personality: {
    tone: 'helpful, professional and friendly',
    greeting: "Hi! I'm your SmartBank Assistant. I can help you with banking tasks and answer questions about the SmartBank application. How can I help you today?",
  },

  context: {
    business: 'SmartBank',
    services: 'money transfers, deposits, account management, balance checking, transaction history, KYC verification, and codebase questions',
  },

  routes: [
    { name: 'transfer', label: 'Transfer Money', keywords: ['transfer', 'send money', 'pay', 'send'], url: '/transfer' },
    { name: 'deposit', label: 'Deposit', keywords: ['deposit', 'add money', 'add funds', 'credit'], url: '/deposit' },
    { name: 'balance', label: 'Check Balance', keywords: ['balance', 'how much', 'total money', 'dashboard'], url: '/dashboard' },
    { name: 'transactions', label: 'History', keywords: ['history', 'transactions', 'statement', 'recent'], url: '/transactions' },
    { name: 'accounts', label: 'Accounts', keywords: ['accounts', 'my accounts', 'view accounts'], url: '/accounts' },
    { name: 'createAccount', label: 'New Account', keywords: ['open account', 'new account', 'create account'], url: '/create-account' },
    { name: 'kyc', label: 'KYC Upload', keywords: ['kyc', 'verify', 'document', 'upload', 'identity'], url: '/kyc-upload' }
  ]
};

export const knowledge = [
  {
    source: "transfer",
    content: "To transfer money in SmartBank: 1) Go to Dashboard and click 'Transfer' from Quick Actions. 2) Select your account to send from (shows account type, number and balance). 3) Enter the recipient's account number. 4) Enter the amount in rupees. 5) Add an optional description. 6) Click 'Transfer Money'. You'll see a success screen showing amount sent, from/to accounts, new balance, and date/time. You can then go back to Dashboard or make another transfer."
  },
  {
    source: "deposit",
    content: "To deposit money in SmartBank: 1) Go to Dashboard and click 'Deposit' from Quick Actions. 2) Select which account you want to deposit into. 3) Enter the deposit amount in rupees. 4) Add an optional description. 5) Click 'Deposit Money'. You'll see a success screen showing the deposited amount, new balance, and transaction date. There's no maximum limit for deposits."
  },
  {
    source: "balance",
    content: "To check your balance in SmartBank: Go to the Dashboard - you'll see your Total Balance across all accounts displayed prominently in a blue card. Below that, each of your accounts (SAVINGS, CURRENT, FD) shows its individual balance and account number. You can also view detailed balances on the 'Accounts' page."
  },
  {
    source: "accounts",
    content: "SmartBank offers three account types: 1) CURRENT Account - No minimum deposit, ideal for business transactions. 2) SAVINGS Account - Minimum ₹500 initial deposit, for everyday banking. 3) Fixed Deposit (FD) - Minimum ₹1000 deposit, lock money for higher interest. To open a new account, go to Accounts page and click 'New Account' button. Each account shows status (ACTIVE/FROZEN), balance, and has quick Deposit/Transfer buttons."
  },
  {
    source: "createAccount",
    content: "To create a new account in SmartBank: 1) Go to Accounts page. 2) Click 'New Account' button. 3) Select account type - Current (no minimum), Savings (min ₹500), or FD (min ₹1000). 4) Enter initial deposit amount or use 'Mock Deposit' checkbox for testing. 5) Click 'Create Account'. Your new account number will be shown on success."
  },
  {
    source: "transactions",
    content: "To view transaction history in SmartBank: 1) Go to Dashboard and click 'History' from Quick Actions, or click 'View All' under Recent Activity. 2) Select an account from the dropdown to see its transactions. Each transaction shows: type (DEPOSIT/TRANSFER), date, amount (green for deposits, shows +/- sign), and balance after transaction."
  },
  {
    source: "kyc",
    content: "KYC (Know Your Customer) verification in SmartBank: Your Dashboard shows KYC status - VERIFIED (green), PENDING (yellow), or NOT VERIFIED (red). If not verified: 1) Click 'Upload Now' on the alert or go to KYC Upload page. 2) Upload your ID document (Aadhaar, PAN, Passport, or Driving License). 3) Accepted formats: JPG, PNG, PDF (max 5MB). KYC is required to use all banking features."
  },
  {
    source: "registration",
    content: "To register as a SmartBank customer: 1) Click 'Create an account' on login page. 2) Fill in: First Name, Last Name, Email, Phone, Address, Date of Birth. 3) Select ID Type (Aadhaar, PAN, Passport, or Driving License) and enter ID Number. 4) Set password (minimum 8 characters with uppercase, lowercase, and number). 5) Click Register. You'll get a SAVINGS account automatically."
  },
  {
    source: "admin",
    content: "SmartBank Admin Registration: Administrators must use @smartbankapp.com email domain. On register page, click 'Register as Admin' to switch to admin mode. Admin features include: viewing all registered users, managing accounts (freeze/activate/close), approving/rejecting KYC documents, and monitoring all transactions across the system."
  },
  {
    source: "dashboard",
    content: "SmartBank Dashboard shows: 1) Welcome message with your name. 2) KYC status alert if not verified. 3) Total Balance across all accounts in blue card. 4) Your Accounts section showing each account's type, balance, and number. 5) Quick Actions: Transfer, Deposit, History, Accounts buttons. 6) Recent Activity showing last 5 transactions with amount and balance."
  },
  {
    source: "security",
    content: "SmartBank Security: Your password is encrypted and never stored in plain text. We use JWT (JSON Web Token) for secure authentication. Sessions expire automatically for your protection. Tips: Never share your password or account details. Always log out when using shared computers. Contact admin immediately if you notice suspicious activity."
  },
  {
    source: "accountStatus",
    content: "SmartBank Account Status types: ACTIVE (green) - Account working normally, can do all transactions. FROZEN (yellow) - Account temporarily suspended, cannot make transactions, contact admin. CLOSED (red) - Account permanently closed. Check your account status on the Accounts page. Each account card shows the current status badge."
  },
  {
    source: "quickActions",
    content: "SmartBank Quick Actions on Dashboard: Transfer (blue icon) - Send money to another account. Deposit (green icon) - Add money to your account. History (purple icon) - View all past transactions. Accounts (orange icon) - Manage your bank accounts and open new ones. Click any action to go directly to that page."
  },
  {
    source: "support",
    content: "SmartBank Support: Use this chatbot for instant help with common questions. For account issues like frozen accounts or KYC rejection, contact your bank administrator. Common solutions: Forgot password - use login page reset. KYC pending - wait for admin review or re-upload documents. Account frozen - contact admin to unfreeze."
  }
];
