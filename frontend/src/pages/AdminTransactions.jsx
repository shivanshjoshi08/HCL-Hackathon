import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowUpRight, ArrowDownLeft, ArrowLeft } from 'lucide-react';
import api from '../services/api';

function AdminTransactions() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/admin/transactions?limit=100');
      setTransactions(response.data.data.transactions);
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

  const filteredTransactions = transactions.filter(txn =>
    txn.fromAccount?.accountNumber?.includes(search) ||
    txn.toAccount?.accountNumber?.includes(search) ||
    txn.transactionType.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><div>Loading...</div></div>;
  }

  const totalVolume = transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const depositCount = transactions.filter(t => t.transactionType === 'DEPOSIT').length;
  const transferCount = transactions.filter(t => t.transactionType === 'TRANSFER').length;

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

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Transaction Monitor</h1>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by account number or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Total</p>
            <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Volume</p>
            <p className="text-xl font-bold text-gray-900">₹{totalVolume.toLocaleString()}</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Deposits</p>
            <p className="text-2xl font-bold text-green-600">{depositCount}</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Transfers</p>
            <p className="text-2xl font-bold text-blue-600">{transferCount}</p>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">All Transactions ({filteredTransactions.length})</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {filteredTransactions.map((txn) => (
                <div key={txn.id} className="flex flex-col md:flex-row justify-between gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-start gap-4">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                      txn.transactionType === 'DEPOSIT' ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      {txn.transactionType === 'DEPOSIT' ? (
                        <ArrowDownLeft className="h-5 w-5 text-green-600" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900">{txn.transactionType}</p>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          txn.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                          txn.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {txn.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {txn.transactionType === 'DEPOSIT' ? (
                          <p>To: {txn.toAccount?.accountNumber}</p>
                        ) : (
                          <>
                            <p>From: {txn.fromAccount?.accountNumber}</p>
                            <p>To: {txn.toAccount?.accountNumber}</p>
                          </>
                        )}
                      </div>
                      {txn.description && <p className="text-sm text-gray-400 mt-1">{txn.description}</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">₹{parseFloat(txn.amount).toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{new Date(txn.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            {filteredTransactions.length === 0 && (
              <div className="text-center py-12">
                <Activity className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No transactions found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminTransactions;
