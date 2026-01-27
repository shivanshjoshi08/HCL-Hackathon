import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import api from '../services/api';

function Transfer() {
  const navigate = useNavigate();
  
  // Form state
  const [accounts, setAccounts] = useState([]);
  const [fromAccount, setFromAccount] = useState('');
  const [toAccountNumber, setToAccountNumber] = useState('');
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
        setFromAccount(userAccounts[0].id);
      }
    } catch (err) {
      console.log('Error loading accounts:', err);
    }
  }

  // Handle transfer
  async function handleTransfer(e) {
    e.preventDefault();
    setError('');

    // Validate amount
    if (!amount || Number(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    // Validate recipient account
    if (!toAccountNumber || toAccountNumber.length < 5) {
      setError('Please enter a valid account number');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/transactions/transfer', {
        fromAccountId: fromAccount,
        toAccountNumber: toAccountNumber,
        amount: Number(amount),
        description: description || 'Fund Transfer'
      });

      // Get selected account details
      const account = accounts.find(acc => acc.id === fromAccount);

      // Save transaction details for success screen
      setTransactionDetails({
        amount: Number(amount),
        fromAccountNumber: account?.accountNumber,
        toAccountNumber: toAccountNumber,
        newBalance: response.data.data.newBalance,
        description: description || 'Fund Transfer',
        date: new Date().toLocaleString()
      });

      // Show success screen
      setShowSuccess(true);

    } catch (err) {
      setError(err.response?.data?.error?.message || 'Transfer failed. Please try again.');
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Transfer Successful!</h1>
          <p className="text-gray-500 mb-8">Your money has been sent successfully</p>

          {/* Transaction Details */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
            <h3 className="text-sm font-medium text-gray-500 mb-4">TRANSACTION DETAILS</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Sent</span>
                <span className="font-bold text-red-600 text-lg">-₹{transactionDetails.amount.toLocaleString()}</span>
              </div>

              {/* Transfer Flow */}
              <div className="bg-white rounded-lg p-4 border">
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">From</p>
                    <p className="font-medium text-sm">{transactionDetails.fromAccountNumber}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                  <div className="text-center">
                    <p className="text-xs text-gray-500">To</p>
                    <p className="font-medium text-sm">{transactionDetails.toAccountNumber}</p>
                  </div>
                </div>
              </div>

              {transactionDetails.description && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Description</span>
                  <span className="font-medium">{transactionDetails.description}</span>
                </div>
              )}

              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Your New Balance</span>
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
                setToAccountNumber('');
                setAmount('');
                setDescription('');
                loadAccounts();
              }}
              className="w-full py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
            >
              Make Another Transfer
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Transfer Form
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Transfer Money</h1>
          <p className="text-gray-500 mb-6">Send money to another account</p>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleTransfer} className="space-y-5">
            {/* From Account */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Account
              </label>
              <select
                value={fromAccount}
                onChange={(e) => setFromAccount(e.target.value)}
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

            {/* To Account Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Account Number
              </label>
              <input
                type="text"
                value={toAccountNumber}
                onChange={(e) => setToAccountNumber(e.target.value)}
                placeholder="Enter recipient's account number"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
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
                placeholder="Payment for..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading ? 'Processing...' : 'Transfer Money'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Transfer;
