import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import api from '../services/api';

function Deposit() {
  const navigate = useNavigate();
  
  // Form state
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Success state
  const [showSuccess, setShowSuccess] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState(null);

  // Load accounts when page loads
  useEffect(() => {
    loadAccounts();
  }, []);

  // Get user's accounts
  async function loadAccounts() {
    try {
      const response = await api.get('/accounts');
      const userAccounts = response.data.data.accounts || [];
      setAccounts(userAccounts);
      
      // Auto-select first account
      if (userAccounts.length > 0) {
        setSelectedAccount(userAccounts[0].id);
      }
    } catch (err) {
      console.log('Error loading accounts:', err);
    }
  }

  // Handle deposit
  async function handleDeposit(e) {
    e.preventDefault();
    setError('');

    // Validate amount
    if (!amount || Number(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/transactions/deposit', {
        accountId: selectedAccount,
        amount: Number(amount),
        description: description || 'Cash Deposit'
      });

      // Get selected account details
      const account = accounts.find(acc => acc.id === selectedAccount);

      // Save transaction details for success screen
      setTransactionDetails({
        amount: Number(amount),
        accountNumber: account?.accountNumber,
        accountType: account?.accountType,
        newBalance: response.data.data.newBalance,
        date: new Date().toLocaleString()
      });

      // Show success screen
      setShowSuccess(true);

    } catch (err) {
      setError(err.response?.data?.error?.message || 'Deposit failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // Success Screen
  if (showSuccess && transactionDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Deposit Successful!</h1>
          <p className="text-gray-500 mb-8">Your money has been added to your account</p>

          {/* Transaction Details */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
            <h3 className="text-sm font-medium text-gray-500 mb-4">TRANSACTION DETAILS</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount</span>
                <span className="font-bold text-green-600 text-lg">+₹{transactionDetails.amount.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Account</span>
                <span className="font-medium">{transactionDetails.accountNumber}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Type</span>
                <span className="font-medium">{transactionDetails.accountType}</span>
              </div>

              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">New Balance</span>
                  <span className="font-bold text-xl">₹{Number(transactionDetails.newBalance).toLocaleString()}</span>
                </div>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Date & Time</span>
                <span className="text-gray-500">{transactionDetails.date}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => {
                setShowSuccess(false);
                setAmount('');
                setDescription('');
                loadAccounts();
              }}
              className="w-full py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
            >
              Make Another Deposit
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Deposit Form
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-lg mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Deposit Money</h1>
          <p className="text-gray-500 mb-6">Add funds to your account</p>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleDeposit} className="space-y-5">
            {/* Account Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Account
              </label>
              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.accountType} - {account.accountNumber} (₹{Number(account.balance).toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (₹)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                min="1"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                required
              />
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Cash deposit, salary, etc."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading ? 'Processing...' : 'Deposit Money'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Deposit;
