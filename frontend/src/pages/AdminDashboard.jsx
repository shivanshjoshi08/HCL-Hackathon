import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, CreditCard, Activity, DollarSign } from 'lucide-react';
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
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-10">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Total Accounts</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.totalAccounts || 0}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Total Balance</p>
                <p className="text-2xl font-bold text-gray-900">₹{parseFloat(stats?.totalBalance || 0).toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Today's Transactions</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.todayTransactions || 0}</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                <Activity className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <button
            onClick={() => navigate('/admin/users')}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-left border border-gray-100 hover:border-blue-300"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Manage Users</h3>
            <p className="text-gray-500 text-sm">View and manage customers</p>
          </button>

          <button
            onClick={() => navigate('/admin/accounts')}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-left border border-gray-100 hover:border-green-300"
          >
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Manage Accounts</h3>
            <p className="text-gray-500 text-sm">Freeze or close accounts</p>
          </button>

          <button
            onClick={() => navigate('/admin/transactions')}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-left border border-gray-100 hover:border-purple-300"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">View Transactions</h3>
            <p className="text-gray-500 text-sm">Monitor all activity</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
