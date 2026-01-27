import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FileText, Download, ArrowLeft, Calendar } from 'lucide-react';
import { Button } from '../components/ui/button';
import api from '../services/api';

function Statement() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accountId = searchParams.get('accountId');
  
  const [statement, setStatement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    if (accountId) {
      fetchStatement();
    }
  }, [accountId]);

  const fetchStatement = async () => {
    try {
      setLoading(true);
      let url = `/transactions/statement/${accountId}`;
      if (dateRange.startDate && dateRange.endDate) {
        url += `?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`;
      }
      const response = await api.get(url);
      setStatement(response.data.data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to fetch statement');
    } finally {
      setLoading(false);
    }
  };

  const handleDateFilter = () => {
    fetchStatement();
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading statement...</div>
      </div>
    );
  }

  if (!statement) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>No statement found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="no-print mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate('/accounts')}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Accounts
          </button>
          <Button onClick={handlePrint} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>

        {/* Date Filter */}
        <div className="no-print bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm text-gray-600">From Date</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="w-full px-3 py-2 border rounded mt-1"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm text-gray-600">To Date</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="w-full px-3 py-2 border rounded mt-1"
              />
            </div>
            <Button onClick={handleDateFilter} className="mt-6">
              Filter
            </Button>
          </div>
        </div>

        {/* Statement */}
        <div className="bg-white rounded-lg shadow p-8 print:shadow-none">
          {/* Header */}
          <div className="text-center mb-8 border-b pb-6">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">SmartBank</h1>
            <h2 className="text-xl font-semibold">Account Statement</h2>
          </div>

          {/* Account Info */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="font-semibold mb-3">Account Information</h3>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-600">Account Number:</span> <span className="font-semibold">{statement.accountInfo.accountNumber}</span></p>
                <p><span className="text-gray-600">Account Type:</span> {statement.accountInfo.accountType}</p>
                <p><span className="text-gray-600">Status:</span> <span className={`px-2 py-1 rounded text-xs ${
                  statement.accountInfo.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100'
                }`}>{statement.accountInfo.status}</span></p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Account Holder</h3>
              <div className="space-y-1 text-sm">
                <p className="font-semibold">{statement.accountInfo.accountHolder}</p>
                <p className="text-gray-600">{statement.accountInfo.email}</p>
                {statement.accountInfo.phone && <p className="text-gray-600">{statement.accountInfo.phone}</p>}
                {statement.accountInfo.address && <p className="text-gray-600">{statement.accountInfo.address}</p>}
              </div>
            </div>
          </div>

          {/* Period */}
          <div className="bg-gray-50 p-4 rounded mb-6">
            <p className="text-sm text-gray-600">Statement Period: {' '}
              <span className="font-semibold">
                {new Date(statement.period.from).toLocaleDateString()} to {new Date(statement.period.to).toLocaleDateString()}
              </span>
            </p>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-sm text-gray-600">Opening Balance</p>
              <p className="text-xl font-bold">₹{parseFloat(statement.summary.openingBalance).toLocaleString()}</p>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <p className="text-sm text-gray-600">Total Credits</p>
              <p className="text-xl font-bold text-green-600">₹{parseFloat(statement.summary.totalDeposits).toLocaleString()}</p>
            </div>
            <div className="bg-red-50 p-4 rounded">
              <p className="text-sm text-gray-600">Total Debits</p>
              <p className="text-xl font-bold text-red-600">₹{parseFloat(statement.summary.totalWithdrawals).toLocaleString()}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded">
              <p className="text-sm text-gray-600">Closing Balance</p>
              <p className="text-xl font-bold text-purple-600">₹{parseFloat(statement.summary.closingBalance).toLocaleString()}</p>
            </div>
          </div>

          {/* Transactions */}
          <div>
            <h3 className="font-semibold mb-4">Transaction History ({statement.summary.transactionCount} transactions)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2">
                    <th className="text-left py-3">Date</th>
                    <th className="text-left py-3">Description</th>
                    <th className="text-right py-3">Debit</th>
                    <th className="text-right py-3">Credit</th>
                    <th className="text-right py-3">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {statement.transactions.map((txn) => (
                    <tr key={txn.reference} className="border-b">
                      <td className="py-3">{new Date(txn.date).toLocaleDateString()}</td>
                      <td className="py-3">{txn.description}</td>
                      <td className="py-3 text-right text-red-600">
                        {parseFloat(txn.debit) > 0 ? `₹${parseFloat(txn.debit).toLocaleString()}` : '-'}
                      </td>
                      <td className="py-3 text-right text-green-600">
                        {parseFloat(txn.credit) > 0 ? `₹${parseFloat(txn.credit).toLocaleString()}` : '-'}
                      </td>
                      <td className="py-3 text-right font-semibold">₹{parseFloat(txn.balance).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t text-center text-sm text-gray-600">
            <p>This is a computer-generated statement and does not require a signature.</p>
            <p className="mt-1">Generated on: {new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white;
          }
        }
      `}</style>
    </div>
  );
}

export default Statement;
