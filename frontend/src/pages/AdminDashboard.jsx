import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, CreditCard, Activity, DollarSign, FileCheck } from 'lucide-react';
import api from '../services/api';

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/dashboard/stats');
      setStats(response.data.data);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
              </div>
              <Users className="h-10 w-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Accounts</p>
                <p className="text-3xl font-bold">{stats?.totalAccounts || 0}</p>
              </div>
              <CreditCard className="h-10 w-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Balance</p>
                <p className="text-2xl font-bold">₹{parseFloat(stats?.totalBalance || 0).toLocaleString()}</p>
              </div>
              <DollarSign className="h-10 w-10 text-purple-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Today's Transactions</p>
                <p className="text-3xl font-bold">{stats?.todayTransactions || 0}</p>
              </div>
              <Activity className="h-10 w-10 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => navigate('/admin/users')}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-left"
          >
            <Users className="h-8 w-8 text-blue-500 mb-3" />
            <h3 className="font-semibold text-lg mb-2">Manage Users</h3>
            <p className="text-gray-600 text-sm">View and manage customers</p>
          </button>

          <button
            onClick={() => navigate('/admin/accounts')}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-left"
          >
            <CreditCard className="h-8 w-8 text-green-500 mb-3" />
            <h3 className="font-semibold text-lg mb-2">Manage Accounts</h3>
            <p className="text-gray-600 text-sm">Freeze or close accounts</p>
          </button>

          <button
            onClick={() => navigate('/admin/transactions')}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-left"
          >
            <Activity className="h-8 w-8 text-purple-500 mb-3" />
            <h3 className="font-semibold text-lg mb-2">View Transactions</h3>
            <p className="text-gray-600 text-sm">Monitor all activity</p>
          </button>

          <button
            onClick={() => navigate('/admin/kyc')}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-left"
          >
            <FileCheck className="h-8 w-8 text-blue-500 mb-3" />
            <h3 className="font-semibold text-lg mb-2">KYC Verification</h3>
            <p className="text-gray-600 text-sm">Verify customer documents</p>
          </button>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Recent Transactions</h2>
          </div>
          <div className="p-6">
            {stats?.recentTransactions?.length > 0 ? (
              <div className="space-y-3">
                {stats.recentTransactions.map((txn) => (
                  <div key={txn.id} className="flex items-center justify-between p-4 bg-gray-50 rounded">
                    <div>
                      <p className="font-semibold">{txn.transactionType}</p>
                      <p className="text-sm text-gray-600">
                        {txn.fromAccount?.accountNumber || 'N/A'} → {txn.toAccount?.accountNumber || 'N/A'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₹{parseFloat(txn.amount).toLocaleString()}</p>
                      <p className="text-sm text-gray-600">{new Date(txn.createdAt).toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No transactions yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
