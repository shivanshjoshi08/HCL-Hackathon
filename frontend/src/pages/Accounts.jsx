import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { accountService } from '../services/auth';
import { Button } from '../components/ui/button';
import { Plus, FileText, CreditCard, DollarSign } from 'lucide-react';
import api from '../services/api';

function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingAccount, setProcessingAccount] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await accountService.getAccounts();
      setAccounts(response.data.accounts || []);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMockDeposit = async (accountId) => {
    if (!confirm('Add ₹1000 to this account for testing?')) return;

    try {
      setProcessingAccount(accountId);
      const response = await api.post('/transactions/mock-deposit', {
        accountId,
        amount: 1000,
      });
      alert(`✅ ${response.data.message}\nNew Balance: ₹${parseFloat(response.data.data.newBalance).toLocaleString()}`);
      fetchAccounts(); // Refresh accounts
    } catch (error) {
      alert(error.response?.data?.error?.message || 'Failed to add mock deposit');
    } finally {
      setProcessingAccount(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Accounts</h1>
            <p className="text-gray-600 mt-1">View and manage your bank accounts</p>
          </div>
          <Button onClick={() => navigate('/create-account')} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Account
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading accounts...</div>
        ) : accounts.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow text-center">
            <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No accounts yet</p>
            <Button onClick={() => navigate('/create-account')} className="flex items-center gap-2 mx-auto">
              <Plus className="h-4 w-4" />
              Create Your First Account
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((account) => (
              <div key={account.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                    account.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                    account.status === 'FROZEN' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {account.status}
                  </span>
                </div>

                <h3 className="font-semibold text-lg mb-1">{account.accountType} Account</h3>
                <p className="text-sm text-gray-600 mb-4 font-mono">{account.accountNumber}</p>

                <div className="mb-6">
                  <p className="text-sm text-gray-600">Current Balance</p>
                  <p className="text-3xl font-bold text-blue-600">
                    ₹{parseFloat(account.balance).toLocaleString()}
                  </p>
                </div>

                {/* Mock Deposit Button for Testing */}
                <div className="mb-3">
                  <Button
                    onClick={() => handleMockDeposit(account.id)}
                    disabled={processingAccount === account.id}
                    className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
                  >
                    <DollarSign className="h-4 w-4" />
                    {processingAccount === account.id ? 'Adding...' : 'Add ₹1000 (Test)'}
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate('/deposit')}
                  >
                    Deposit
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate('/transfer')}
                  >
                    Transfer
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(`/statement?accountId=${account.id}`)}
                    title="View Statement"
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
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
