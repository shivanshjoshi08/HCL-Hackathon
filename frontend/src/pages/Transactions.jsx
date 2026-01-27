import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { accountService, transactionService } from '../services/auth';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

function Transactions() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (selectedAccountId) {
      fetchTransactions();
    }
  }, [selectedAccountId]);

  const fetchAccounts = async () => {
    try {
      const response = await accountService.getAccounts();
      setAccounts(response.data.accounts || []);
      if (response.data.accounts && response.data.accounts.length > 0) {
        setSelectedAccountId(response.data.accounts[0].id);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await transactionService.getHistory(selectedAccountId, 50, 0);
      setTransactions(response.data.transactions || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard')}
          className="mb-4"
        >
          ← Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              View all your account transactions
            </CardDescription>
            
            <div className="mt-4">
              <select
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                className="flex h-10 w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.accountType} - {account.accountNumber}
                  </option>
                ))}
              </select>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-8">Loading transactions...</p>
            ) : transactions.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No transactions found
              </p>
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-full ${
                        transaction.type === 'DEPOSIT' 
                          ? 'bg-green-100' 
                          : transaction.type === 'TRANSFER'
                          ? 'bg-blue-100'
                          : 'bg-orange-100'
                      }`}>
                        {transaction.type === 'DEPOSIT' ? (
                          <ArrowDownLeft className="h-5 w-5 text-green-600" />
                        ) : (
                          <ArrowUpRight className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transaction.createdAt).toLocaleString()}
                        </p>
                        {transaction.description && (
                          <p className="text-sm text-muted-foreground">
                            {transaction.description}
                          </p>
                        )}
                        {transaction.otherParty && (
                          <p className="text-sm text-muted-foreground">
                            {transaction.otherParty}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-lg ${
                        parseFloat(transaction.amount) > 0 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {parseFloat(transaction.amount) > 0 ? '+' : ''}
                        ₹{Math.abs(parseFloat(transaction.amount)).toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Balance: ₹{parseFloat(transaction.balanceAfter).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Transactions;
