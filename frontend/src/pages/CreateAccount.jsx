import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import api from '../services/api';

function CreateAccount() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    accountType: 'CURRENT',
    initialDeposit: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [useMockDeposit, setUseMockDeposit] = useState(false);

  const accountTypes = [
    { value: 'CURRENT', label: 'Current Account', minDeposit: 0, description: 'For business transactions with no minimum deposit' },
    { value: 'SAVINGS', label: 'Savings Account', minDeposit: 500, description: 'For everyday banking and savings' },
    { value: 'FD', label: 'Fixed Deposit', minDeposit: 1000, description: 'Lock your money for higher interest' },
  ];

  const selectedType = accountTypes.find(t => t.value === formData.accountType);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // If using mock deposit, set amount to minimum required
    let depositAmount = parseFloat(formData.initialDeposit);
    
    if (useMockDeposit) {
      depositAmount = selectedType.minDeposit;
    }

    if (depositAmount < selectedType.minDeposit) {
      setError(`Minimum deposit for ${selectedType.label} is ₹${selectedType.minDeposit}`);
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/accounts/create', {
        accountType: formData.accountType,
        initialDeposit: depositAmount,
      });
      alert(`✅ Account created successfully!\nAccount Number: ${response.data.data.account.accountNumber}`);
      navigate('/accounts');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <button
          onClick={() => navigate('/accounts')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Accounts
        </button>

        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Create New Account</h1>
              <p className="text-gray-600">Choose your account type and make initial deposit</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded border border-red-200">
                {error}
              </div>
            )}

            {/* Account Type */}
            <div className="space-y-3">
              <Label>Account Type</Label>
              {accountTypes.map((type) => (
                <div
                  key={type.value}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                    formData.accountType === type.value
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setFormData({ ...formData, accountType: type.value })}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-lg">{type.label}</p>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Min. Deposit</p>
                    <p className="font-bold text-blue-600">
                      {type.minDeposit === 0 ? 'No Minimum' : `₹${type.minDeposit.toLocaleString()}`}
                    </p>
                  </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Initial Deposit */}
            <div className="space-y-2">
              <Label htmlFor="initialDeposit">Initial Deposit Amount</Label>
              
              {/* Mock Deposit Toggle */}
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded border border-green-200 mb-3">
                <input
                  type="checkbox"
                  id="mockDeposit"
                  checked={useMockDeposit}
                  onChange={(e) => {
                    setUseMockDeposit(e.target.checked);
                    if (e.target.checked) {
                      setFormData({ ...formData, initialDeposit: selectedType.minDeposit.toString() });
                    }
                  }}
                  className="w-4 h-4"
                />
                <label htmlFor="mockDeposit" className="text-sm text-green-800 cursor-pointer">
                  <strong>Use Mock Deposit</strong> (Automatically adds minimum required amount for testing)
                </label>
              </div>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                <Input
                  id="initialDeposit"
                  type="number"
                  min={selectedType.minDeposit}
                  step="0.01"
                  placeholder={selectedType.minDeposit === 0 ? '0' : `Minimum ${selectedType.minDeposit}`}
                  value={formData.initialDeposit}
                  onChange={(e) => setFormData({ ...formData, initialDeposit: e.target.value })}
                  required={!useMockDeposit}
                  disabled={useMockDeposit}
                  className="pl-8 h-12 text-lg"
                />
              </div>
              <p className="text-sm text-gray-600">
                {selectedType.minDeposit === 0 
                  ? 'No minimum deposit required for Current account'
                  : `Enter amount ${selectedType.minDeposit > 0 ? `(min ₹${selectedType.minDeposit.toLocaleString()})` : ''}`
                }
              </p>
            </div>

            {/* Summary */}
            {((formData.initialDeposit && parseFloat(formData.initialDeposit) >= selectedType.minDeposit) || useMockDeposit) && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold mb-2">Summary</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Account Type:</span>
                    <span className="font-semibold">{selectedType.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Initial Deposit:</span>
                    <span className="font-semibold">
                      ₹{useMockDeposit 
                        ? selectedType.minDeposit.toLocaleString() 
                        : parseFloat(formData.initialDeposit).toLocaleString()}
                      {useMockDeposit && <span className="text-green-600 ml-2">(Mock)</span>}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-semibold">Opening Balance:</span>
                    <span className="font-bold text-blue-600">
                      ₹{useMockDeposit 
                        ? selectedType.minDeposit.toLocaleString() 
                        : parseFloat(formData.initialDeposit).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateAccount;
