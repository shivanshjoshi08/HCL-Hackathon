import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { accountService, transactionService } from '../services/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ArrowUpRight, ArrowDownLeft, History, Wallet, TrendingUp, CreditCard, FileText, AlertCircle } from 'lucide-react';

function Dashboard() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalBalance, setTotalBalance] = useState(0);
  const [kycStatus, setKycStatus] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const accountsResponse = await accountService.getAccounts();
      const accountsData = accountsResponse.data.accounts || [];
      setAccounts(accountsData);

      // Calculate total balance
      const total = accountsData.reduce((sum, acc) => sum + parseFloat(acc.balance), 0);
      setTotalBalance(total);

      if (accountsData.length > 0) {
        const transResponse = await transactionService.getHistory(
          accountsData[0].id,
          5,
          0
        );
        setTransactions(transResponse.data.transactions || []);
      }

      // Fetch KYC status
      try {
        const kycResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/kyc/status`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const kycData = await kycResponse.json();
        if (kycData.success) {
          setKycStatus(kycData.data.kycStatus);
        }
      } catch (error) {
        console.error('Error fetching KYC:', error);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-lg text-muted-foreground">Loading your accounts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Welcome Header */}
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600">
            Here's your financial overview
          </p>
        </div>

        {/* KYC Alert */}
        {kycStatus && kycStatus !== 'VERIFIED' && (
          <div className={`p-4 rounded-lg border-2 flex items-center justify-between ${
            kycStatus === 'PENDING' ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-3">
              <AlertCircle className={`h-6 w-6 ${
                kycStatus === 'PENDING' ? 'text-yellow-600' : 'text-red-600'
              }`} />
              <div>
                <p className={`font-semibold ${
                  kycStatus === 'PENDING' ? 'text-yellow-900' : 'text-red-900'
                }`}>
                  {kycStatus === 'PENDING' ? 'KYC Verification Pending' : 'KYC Not Verified'}
                </p>
                <p className={`text-sm ${
                  kycStatus === 'PENDING' ? 'text-yellow-700' : 'text-red-700'
                }`}>
                  {kycStatus === 'PENDING' 
                    ? 'Your KYC is under review. We\'ll notify you once verified.' 
                    : 'Please upload your KYC document to use all features.'}
                </p>
              </div>
            </div>
            <Link to="/kyc-upload">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {kycStatus === 'PENDING' ? 'View Status' : 'Upload Now'}
              </Button>
            </Link>
          </div>
        )}

        {/* Total Balance Card - Featured */}
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-white border-0 shadow-xl">
          <CardHeader>
            <CardDescription className="text-white/80">Total Balance</CardDescription>
            <CardTitle className="text-4xl sm:text-5xl font-bold">
              ₹{totalBalance.toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-white/90">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">Across {accounts.length} account{accounts.length !== 1 ? 's' : ''}</span>
            </div>
          </CardContent>
        </Card>

        {/* Account Cards */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Your Accounts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map((account) => (
              <Card key={account.id} className="hover:shadow-lg transition-shadow border-2">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardDescription className="font-medium">{account.accountType}</CardDescription>
                    <div className="p-2 rounded-full bg-primary/10">
                      <Wallet className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <CardTitle className="text-3xl">
                    ₹{parseFloat(account.balance).toFixed(2)}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground font-mono">
                    {account.accountNumber}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>What would you like to do today?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Link to="/transfer" className="block">
                <Button variant="outline" className="w-full h-auto py-6 flex flex-col items-center gap-3 hover:bg-primary hover:text-white transition-colors">
                  <div className="p-3 rounded-full bg-blue-100">
                    <ArrowUpRight className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="font-medium">Transfer</span>
                </Button>
              </Link>
              <Link to="/deposit" className="block">
                <Button variant="outline" className="w-full h-auto py-6 flex flex-col items-center gap-3 hover:bg-primary hover:text-white transition-colors">
                  <div className="p-3 rounded-full bg-green-100">
                    <ArrowDownLeft className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="font-medium">Deposit</span>
                </Button>
              </Link>
              <Link to="/transactions" className="block">
                <Button variant="outline" className="w-full h-auto py-6 flex flex-col items-center gap-3 hover:bg-primary hover:text-white transition-colors">
                  <div className="p-3 rounded-full bg-purple-100">
                    <History className="h-6 w-6 text-purple-600" />
                  </div>
                  <span className="font-medium">History</span>
                </Button>
              </Link>
              <Link to="/accounts" className="block">
                <Button variant="outline" className="w-full h-auto py-6 flex flex-col items-center gap-3 hover:bg-primary hover:text-white transition-colors">
                  <div className="p-3 rounded-full bg-orange-100">
                    <CreditCard className="h-6 w-6 text-orange-600" />
                  </div>
                  <span className="font-medium">Accounts</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest transactions</CardDescription>
              </div>
              <Link to="/transactions">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <History className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No transactions yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Start by making a deposit or transfer
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${
                        transaction.type === 'DEPOSIT' 
                          ? 'bg-green-100' 
                          : 'bg-blue-100'
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
                          {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-lg ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}₹{Math.abs(parseFloat(transaction.amount)).toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ₹{parseFloat(transaction.balanceAfter).toFixed(2)}
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

export default Dashboard;
