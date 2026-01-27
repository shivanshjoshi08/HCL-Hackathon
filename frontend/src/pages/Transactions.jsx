import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, ArrowDownLeft, ArrowLeft, History } from 'lucide-react';
import api from '../services/api';

function Transactions() {
  const navigate = useNavigate();
  
  // State
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load accounts on page load
  useEffect(() => {
    loadAccounts();
  }, []);

  // Load transactions when account changes
  useEffect(() => {
    if (selectedAccount) {
      loadTransactions();
    }
  }, [selectedAccount]);

  // Get user's accounts
  async function loadAccounts() {
    try {
      const response = await api.get('/accounts');
      const userAccounts = response.data.data.accounts || [];
      setAccounts(userAccounts);
      
      if (userAccounts.length > 0) {
        setSelectedAccount(userAccounts[0].id);
      }
    } catch (err) {
      console.log('Error loading accounts:', err);
    } finally {
      setLoading(false);
    }
  }

  // Get transactions for selected account
  async function loadTransactions() {
    setLoading(true);
    try {
      const response = await api.get(`/transactions/history?accountId=${selectedAccount}&limit=50`);
      setTransactions(response.data.data.transactions || []);
    } catch (err) {
      console.log('Error loading transactions:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-10">
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
          <p className="text-gray-500 mt-1">View all your account transactions</p>
        </div>

        {/* Account Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Account</label>
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="w-full max-w-md px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.accountType} - {account.accountNumber} (₹{Number(account.balance).toLocaleString()})
              </option>
            ))}
          </select>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">Loading transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <History className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">No transactions found</p>
              <p className="text-sm text-gray-400 mt-1">Transactions will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {transactions.map((txn) => (
                <div key={txn.id} className="p-5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        txn.transactionType === 'DEPOSIT' ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        {txn.transactionType === 'DEPOSIT' ? (
                          <ArrowDownLeft className="w-6 h-6 text-green-600" />
                        ) : (
                          <ArrowUpRight className="w-6 h-6 text-blue-600" />
                        )}
                      </div>
                      
                      {/* Details */}
                      <div>
                        <p className="font-semibold text-gray-900">{txn.transactionType}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(txn.createdAt).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        {txn.description && (
                          <p className="text-sm text-gray-400 mt-1">{txn.description}</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Amount */}
                    <div className="text-right">
                      <p className={`text-lg font-bold ${
                        txn.transactionType === 'DEPOSIT' ? 'text-green-600' : 'text-gray-900'
                      }`}>
                        {txn.transactionType === 'DEPOSIT' ? '+' : '-'}₹{Number(txn.amount).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Balance: ₹{Number(txn.balanceAfter).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Transactions;
