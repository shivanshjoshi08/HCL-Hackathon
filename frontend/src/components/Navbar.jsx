import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { LogOut, Shield, LayoutDashboard } from 'lucide-react';
import { BankAppLogo } from './BankAppLogo';

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  const isAdmin = user?.role === 'admin';
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link 
            to={isAdmin ? '/admin/dashboard' : '/dashboard'} 
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <BankAppLogo className="h-8 w-8" />
            <span className="text-xl sm:text-2xl font-bold text-primary">SmartBank</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium truncate max-w-[120px] sm:max-w-none">
                {user?.firstName}
              </span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
