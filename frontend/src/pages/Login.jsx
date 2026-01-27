import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { BankAppLogo } from '../components/BankAppLogo';
import { cn } from '@/lib/utils';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login({ email, password });
      // Redirect based on user role
      if (response.data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-2">
          <div className="p-4 bg-white rounded-2xl shadow-lg">
            <BankAppLogo className="h-16 w-16" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            SmartBank
          </h1>
          <p className="text-gray-500 text-sm">Your Digital Banking Solution</p>
        </div>

        <div className="flex w-full max-w-md flex-col items-start gap-y-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
          <div className="flex flex-col items-start gap-y-2 w-full">
            <h2 className="text-2xl font-semibold text-gray-800">Welcome Back</h2>
            <div className="text-sm">
              <span className="text-gray-500">New to SmartBank? </span>
              <Link
                to="/register"
                className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
              >
                Create an account
              </Link>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-md" 
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </Button>
          </form>
        </div>

        <p className="text-gray-400 text-xs">
          Secure banking powered by SmartBank
        </p>
      </div>
    </section>
  );
}

export default Login;
