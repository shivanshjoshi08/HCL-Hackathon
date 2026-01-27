import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { BankAppLogo } from '../components/BankAppLogo';
import { Shield } from 'lucide-react';

function Register() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    idType: 'Aadhaar',
    idNumber: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register, registerAdmin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters with uppercase, lowercase, and number');
      return;
    }

    // Admin domain validation
    if (isAdminMode && !formData.email.endsWith('@smartbankapp.com')) {
      setError('Admin registration requires @smartbankapp.com email domain');
      return;
    }

    setLoading(true);

    try {
      if (isAdminMode) {
        await registerAdmin({
          email: formData.email,
          password: formData.password,
        });
        alert('Admin account created successfully!');
      } else {
        await register({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: formData.address,
          dateOfBirth: formData.dateOfBirth,
          idType: formData.idType,
          idNumber: formData.idNumber,
        });
      }
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  const toggleAdminMode = () => {
    setIsAdminMode(!isAdminMode);
    setError('');
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      address: '',
      dateOfBirth: '',
      idType: 'Aadhaar',
      idNumber: '',
    });
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-12">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-2">
          <div className="p-4 bg-white rounded-2xl shadow-lg">
            <BankAppLogo className="h-14 w-14" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            SmartBank
          </h1>
        </div>

        <div className="flex w-full max-w-md flex-col items-start gap-y-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
          <div className="flex flex-col items-start gap-y-2 w-full">
            <h2 className="text-2xl font-semibold text-gray-800">
              {isAdminMode ? 'Admin Registration' : 'Create Account'}
            </h2>
            <p className="text-sm text-gray-500">
              {isAdminMode 
                ? 'Register as bank admin (requires @smartbankapp.com email)' 
                : 'Complete KYC to open your bank account'}
            </p>
            <div className="text-sm">
              <span className="text-gray-500">Already have an account? </span>
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
              >
                Log in
              </Link>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
                {error}
              </div>
            )}

            {!isAdminMode && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="h-11"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={isAdminMode ? "admin@smartbankapp.com" : "john@example.com"}
                value={formData.email}
                onChange={handleChange}
                required
                className="h-11"
              />
              {isAdminMode && (
                <p className="text-xs text-muted-foreground">Must use @smartbankapp.com domain</p>
              )}
            </div>

            {!isAdminMode && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="123 Street, City"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="idType">ID Type (KYC)</Label>
                  <select
                    id="idType"
                    name="idType"
                    value={formData.idType}
                    onChange={handleChange}
                    required
                    className="h-11 w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="Aadhaar">Aadhaar Card</option>
                    <option value="PAN">PAN Card</option>
                    <option value="Passport">Passport</option>
                    <option value="Driving License">Driving License</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="idNumber">ID Number</Label>
                  <Input
                    id="idNumber"
                    name="idNumber"
                    type="text"
                    placeholder="Enter ID number"
                    value={formData.idNumber}
                    onChange={handleChange}
                    required
                    className="h-11"
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="At least 8 characters"
                value={formData.password}
                onChange={handleChange}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="h-11"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 font-medium" 
              disabled={loading}
            >
              {loading ? 'Creating account...' : (isAdminMode ? 'Create Admin Account' : 'Create Account')}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full h-11"
              onClick={toggleAdminMode}
            >
              <Shield className="mr-2 h-4 w-4" />
              {isAdminMode ? 'Register as Customer' : 'Register as Admin'}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Register;
