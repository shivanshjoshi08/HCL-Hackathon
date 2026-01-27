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
    <section className="min-h-screen bg-muted">
      <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <BankAppLogo className="h-16 w-16" />
          <h1 className="text-3xl font-bold text-primary">SmartBank</h1>
        </div>

        <div className="flex w-full max-w-md flex-col items-start gap-y-6 rounded-lg border border-muted-foreground/20 bg-white p-8 shadow-lg">
          <div className="flex flex-col items-start gap-y-2 w-full">
            <h2 className="text-2xl font-semibold">Log In</h2>
            <div className="text-sm">
              <span className="text-muted-foreground">New to SmartBank? </span>
              <Link
                to="/register"
                className="font-medium text-primary hover:underline"
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
              className="w-full h-11 font-medium" 
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Login;
