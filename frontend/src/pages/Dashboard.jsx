import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowUpRight, ArrowDownLeft, History, CreditCard, AlertCircle } from 'lucide-react';
import api from '../services/api';

function Dashboard() {
  const { user } = useAuth();
  
  // State
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [kycStatus, setKycStatus] = useState('VERIFIED');

  // Load data when page loads
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Fetch all dashboard data
  async function loadDashboardData() {
    try {
      // Get accounts
      const accountsRes = await api.get('/accounts');
      const userAccounts = accountsRes.data.data.accounts || [];
      setAccounts(userAccounts);

      // Get recent transactions (for first account)
      if (userAccounts.length > 0) {
        const txnRes = await api.get(`/transactions/history?accountId=${userAccounts[0].id}&limit=5`);
        setTransactions(txnRes.data.data.transactions || []);
      }

      // Get KYC status
      const kycRes = await api.get('/kyc/status');
      setKycStatus(kycRes.data.data.kycStatus);

    } catch (err) {
      console.log('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  }

  // Calculate total balance
  const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your accounts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-10">
        
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.firstName}!</h1>
          <p className="text-gray-500 mt-1">Here's your financial overview</p>
        </div>

        {/* KYC Alert */}
        {kycStatus !== 'VERIFIED' && (
          <div className={`p-4 rounded-xl mb-8 flex items-center justify-between ${
            kycStatus === 'PENDING' ? 'bg-yellow-50 border border-yellow-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center gap-3">
              <AlertCircle className={`h-5 w-5 ${kycStatus === 'PENDING' ? 'text-yellow-600' : 'text-red-600'}`} />
              <div>
                <p className={`font-medium ${kycStatus === 'PENDING' ? 'text-yellow-800' : 'text-red-800'}`}>
                  {kycStatus === 'PENDING' ? 'KYC Verification Pending' : 'KYC Not Verified'}
                </p>
                <p className={`text-sm ${kycStatus === 'PENDING' ? 'text-yellow-600' : 'text-red-600'}`}>
                  {kycStatus === 'PENDING' ? 'Your documents are under review' : 'Please upload your documents'}
                </p>
              </div>
            </div>
            <Link 
              to="/kyc-upload"
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                kycStatus === 'PENDING' 
                  ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                  : 'bg-red-100 text-red-700 hover:bg-red-200'
              }`}
            >
              {kycStatus === 'PENDING' ? 'View Status' : 'Upload Now'}
            </Link>
          </div>
        )}

        {/* Total Balance */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white mb-8">
          <p className="text-blue-100 text-sm mb-2">Total Balance</p>
          <h2 className="text-4xl font-bold mb-2">₹{totalBalance.toLocaleString()}</h2>
          <p className="text-blue-200 text-sm">Across {accounts.length} account{accounts.length !== 1 ? 's' : ''}</p>
        </div>

        {/* Accounts */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Accounts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map((account) => (
              <div key={account.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {account.accountType}
                  </span>
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  ₹{Number(account.balance).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 font-mono">{account.accountNumber}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <p className="text-gray-500 text-sm mb-4">What would you like to do today?</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/transfer" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <ArrowUpRight className="w-6 h-6 text-blue-600" />
              </div>
              <p className="font-medium text-gray-900">Transfer</p>
            </Link>
            
            <Link to="/deposit" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition-all text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <ArrowDownLeft className="w-6 h-6 text-green-600" />
              </div>
              <p className="font-medium text-gray-900">Deposit</p>
            </Link>
            
            <Link to="/transactions" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-200 transition-all text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <History className="w-6 h-6 text-purple-600" />
              </div>
              <p className="font-medium text-gray-900">History</p>
            </Link>
            
            <Link to="/accounts" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-orange-200 transition-all text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <CreditCard className="w-6 h-6 text-orange-600" />
              </div>
              <p className="font-medium text-gray-900">Accounts</p>
            </Link>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <p className="text-sm text-gray-500">Your latest transactions</p>
            </div>
            <Link to="/transactions" className="text-blue-600 text-sm font-medium hover:text-blue-700">
              View All
            </Link>
          </div>
          
          <div className="p-6">
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <History className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">No transactions yet</p>
                <p className="text-sm text-gray-400 mt-1">Start by making a deposit or transfer</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((txn) => (
                  <div key={txn.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        txn.transactionType === 'DEPOSIT' ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        {txn.transactionType === 'DEPOSIT' ? (
                          <ArrowDownLeft className="w-5 h-5 text-green-600" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{txn.transactionType}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(txn.createdAt).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        txn.transactionType === 'DEPOSIT' ? 'text-green-600' : 'text-gray-900'
                      }`}>
                        {txn.transactionType === 'DEPOSIT' ? '+' : '-'}₹{Number(txn.amount).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">₹{Number(txn.balanceAfter).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
