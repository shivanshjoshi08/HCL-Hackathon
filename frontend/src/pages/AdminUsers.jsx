import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Calendar, CreditCard, ArrowLeft } from 'lucide-react';
import api from '../services/api';

function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data.data.users);
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

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    user.firstName.toLowerCase().includes(search.toLowerCase()) ||
    user.lastName.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><div>Loading...</div></div>;
  }

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

        <h1 className="text-3xl font-bold text-gray-900 mb-8">User Management</h1>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">{users.length}</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Total Accounts</p>
            <p className="text-2xl font-bold text-gray-900">
              {users.reduce((sum, user) => sum + user.accounts.length, 0)}
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Active Accounts</p>
            <p className="text-2xl font-bold text-green-600">
              {users.reduce((sum, user) => sum + user.accounts.filter(acc => acc.status === 'ACTIVE').length, 0)}
            </p>
          </div>
        </div>

        {/* Users List */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">All Users</h2>
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <div key={user.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{user.firstName} {user.lastName}</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {user.email}
                      </p>
                    </div>
                  </div>
                  {user.phone && (
                    <p className="text-sm text-gray-500 flex items-center gap-2 mb-2">
                      <Phone className="h-4 w-4" />
                      {user.phone}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Accounts */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                    <span className="font-semibold text-gray-700">{user.accounts.length} Account(s)</span>
                  </div>
                  {user.accounts.map((account) => (
                    <div key={account.id} className="bg-gray-50 p-3 rounded-lg mb-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-900">{account.accountNumber}</p>
                          <p className="text-sm text-gray-500">{account.accountType}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">₹{parseFloat(account.balance).toLocaleString()}</p>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            account.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                            account.status === 'FROZEN' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {account.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
            <p className="text-gray-500">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminUsers;
