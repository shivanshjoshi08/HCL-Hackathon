import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, ArrowLeft } from 'lucide-react';
import api from '../services/api';

function AdminAccounts() {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await api.get('/admin/accounts');
      setAccounts(response.data.data.accounts);
    } catch (error) {
      console.error('Error:', error);
      if (error.response?.status === 403) {
        alert('Access denied');
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (accountId, newStatus) => {
    if (!confirm(`Are you sure you want to ${newStatus.toLowerCase()} this account?`)) return;

    try {
      setUpdating(accountId);
      await api.patch(`/admin/accounts/${accountId}/status`, { status: newStatus });
      alert(`Account ${newStatus.toLowerCase()} successfully!`);
      fetchAccounts();
    } catch (error) {
      alert(error.response?.data?.error?.message || 'Failed to update');
    } finally {
      setUpdating(null);
    }
  };

  const filteredAccounts = accounts.filter(acc =>
    acc.accountNumber.includes(search) ||
    acc.user.email.toLowerCase().includes(search.toLowerCase()) ||
    acc.user.firstName.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><div>Loading...</div></div>;
  }

  const activeCount = accounts.filter(a => a.status === 'ACTIVE').length;
  const frozenCount = accounts.filter(a => a.status === 'FROZEN').length;
  const totalBalance = accounts.reduce((sum, a) => sum + parseFloat(a.balance), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-10">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Account Management</h1>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by account number, name, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Total</p>
            <p className="text-2xl font-bold text-gray-900">{accounts.length}</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Active</p>
            <p className="text-2xl font-bold text-green-600">{activeCount}</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Frozen</p>
            <p className="text-2xl font-bold text-yellow-600">{frozenCount}</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Total Balance</p>
            <p className="text-xl font-bold text-gray-900">₹{totalBalance.toLocaleString()}</p>
          </div>
        </div>

        {/* Accounts List */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">All Accounts</h2>
        <div className="space-y-4">
          {filteredAccounts.map((account) => (
            <div key={account.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                {/* Account Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{account.accountNumber}</h3>
                      <p className="text-sm text-gray-500">{account.accountType} Account</p>
                    </div>
                    <span className={`ml-auto text-xs px-3 py-1 rounded-full font-medium ${
                      account.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                      account.status === 'FROZEN' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {account.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    Owner: {account.user.firstName} {account.user.lastName} • {account.user.email}
                  </p>
                  <p className="text-sm text-gray-500">
                    Opened: {new Date(account.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Balance & Actions */}
                <div className="flex flex-col items-end gap-4">
                  <div className="text-right">
                    <p className="text-gray-500 text-xs uppercase tracking-wide">Balance</p>
                    <p className="text-2xl font-bold text-gray-900">₹{parseFloat(account.balance).toLocaleString()}</p>
                  </div>
                  
                  {account.status === 'ACTIVE' && (
                    <button
                      onClick={() => updateStatus(account.id, 'FROZEN')}
                      disabled={updating === account.id}
                      className="px-4 py-2 text-sm font-medium text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors disabled:opacity-50"
                    >
                      {updating === account.id ? 'Freezing...' : 'Freeze Account'}
                    </button>
                  )}
                  
                  {account.status === 'FROZEN' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateStatus(account.id, 'ACTIVE')}
                        disabled={updating === account.id}
                        className="px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                      >
                        {updating === account.id ? 'Activating...' : 'Activate'}
                      </button>
                      <button
                        onClick={() => updateStatus(account.id, 'CLOSED')}
                        disabled={updating === account.id}
                        className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                      >
                        {updating === account.id ? 'Closing...' : 'Close'}
                      </button>
                    </div>
                  )}
                  
                  {account.status === 'CLOSED' && (
                    <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-lg">
                      Account Closed
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAccounts.length === 0 && (
          <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
            <p className="text-gray-500">No accounts found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminAccounts;
