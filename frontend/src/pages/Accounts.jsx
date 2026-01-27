import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, CreditCard, ArrowLeft } from 'lucide-react';
import api from '../services/api';

function Accounts() {
  const navigate = useNavigate();
  
  // State
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load accounts on page load
  useEffect(() => {
    loadAccounts();
  }, []);

  // Get user's accounts
  async function loadAccounts() {
    try {
      const response = await api.get('/accounts');
      setAccounts(response.data.data.accounts || []);
    } catch (err) {
      console.log('Error loading accounts:', err);
    } finally {
      setLoading(false);
    }
  }

  // Calculate total balance
  const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-10">
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Accounts</h1>
            <p className="text-gray-500 mt-1">View and manage your bank accounts</p>
          </div>
          <Link
            to="/create-account"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            New Account
          </Link>
        </div>

        {/* Summary Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white mb-8">
          <p className="text-blue-100 text-sm mb-2">Total Balance</p>
          <h2 className="text-4xl font-bold mb-2">₹{totalBalance.toLocaleString()}</h2>
          <p className="text-blue-200 text-sm">{accounts.length} account{accounts.length !== 1 ? 's' : ''}</p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading accounts...</p>
          </div>
        ) : accounts.length === 0 ? (
          // Empty State
          <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-4">No accounts yet</p>
            <Link
              to="/create-account"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Create Your First Account
            </Link>
          </div>
        ) : (
          // Accounts Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((account) => (
              <div key={account.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    account.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                    account.status === 'FROZEN' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {account.status}
                  </span>
                </div>

                {/* Account Info */}
                <h3 className="font-semibold text-lg text-gray-900 mb-1">{account.accountType} Account</h3>
                <p className="text-sm text-gray-500 font-mono mb-4">{account.accountNumber}</p>

                {/* Balance */}
                <div className="mb-6">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Current Balance</p>
                  <p className="text-3xl font-bold text-gray-900">
                    ₹{Number(account.balance).toLocaleString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    to="/deposit"
                    className="flex-1 py-2 text-center text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                  >
                    Deposit
                  </Link>
                  <Link
                    to="/transfer"
                    className="flex-1 py-2 text-center text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Transfer
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Accounts;
