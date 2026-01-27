import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
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
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold mb-8">Account Management</h1>

        {/* Search */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <input
            type="text"
            placeholder="Search by account number, name, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Total</p>
            <p className="text-2xl font-bold">{accounts.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Active</p>
            <p className="text-2xl font-bold text-green-600">{activeCount}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Frozen</p>
            <p className="text-2xl font-bold text-yellow-600">{frozenCount}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Total Balance</p>
            <p className="text-xl font-bold">₹{totalBalance.toLocaleString()}</p>
          </div>
        </div>

        {/* Accounts List */}
        <div className="space-y-4">
          {filteredAccounts.map((account) => (
            <div key={account.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                {/* Account Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <CreditCard className="h-8 w-8 text-blue-500" />
                    <div>
                      <h3 className="font-bold text-lg">{account.accountNumber}</h3>
                      <p className="text-sm text-gray-600">{account.accountType} Account</p>
                    </div>
                    <span className={`ml-auto text-xs px-3 py-1 rounded font-semibold ${
                      account.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                      account.status === 'FROZEN' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {account.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Owner: {account.user.firstName} {account.user.lastName} • {account.user.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    Opened: {new Date(account.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Balance & Actions */}
                <div className="flex flex-col items-end gap-3">
                  <div className="text-right">
                    <p className="text-gray-600 text-sm">Balance</p>
                    <p className="text-3xl font-bold">₹{parseFloat(account.balance).toLocaleString()}</p>
                  </div>
                  
                  {account.status === 'ACTIVE' && (
                    <Button
                      onClick={() => updateStatus(account.id, 'FROZEN')}
                      disabled={updating === account.id}
                      className="bg-yellow-600 hover:bg-yellow-700"
                    >
                      {updating === account.id ? 'Freezing...' : 'Freeze Account'}
                    </Button>
                  )}
                  
                  {account.status === 'FROZEN' && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => updateStatus(account.id, 'ACTIVE')}
                        disabled={updating === account.id}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {updating === account.id ? 'Activating...' : 'Activate'}
                      </Button>
                      <Button
                        onClick={() => updateStatus(account.id, 'CLOSED')}
                        disabled={updating === account.id}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {updating === account.id ? 'Closing...' : 'Close'}
                      </Button>
                    </div>
                  )}
                  
                  {account.status === 'CLOSED' && (
                    <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded">
                      Account Closed
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAccounts.length === 0 && (
          <div className="bg-white p-12 rounded-lg shadow text-center">
            <p className="text-gray-500">No accounts found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminAccounts;
