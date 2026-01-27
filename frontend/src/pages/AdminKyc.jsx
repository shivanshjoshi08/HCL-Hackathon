import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, CheckCircle, XCircle, ArrowLeft, Eye } from 'lucide-react';
import { Button } from '../components/ui/button';
import api from '../services/api';

function AdminKyc() {
  const navigate = useNavigate();
  const [kycRecords, setKycRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('PENDING');
  const [selectedUser, setSelectedUser] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    fetchKycRecords();
  }, [filter]);

  const fetchKycRecords = async () => {
    try {
      setLoading(true);
      const url = filter === 'ALL' ? '/admin/kyc/all' : `/admin/kyc/all?status=${filter}`;
      const response = await api.get(url);
      setKycRecords(response.data.data.users);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (userId, status) => {
    if (status === 'REJECTED' && !rejectionReason) {
      alert('Please provide rejection reason');
      return;
    }

    if (!confirm(`Are you sure you want to ${status.toLowerCase()} this KYC?`)) return;

    try {
      setProcessing(userId);
      await api.patch(`/kyc/verify/${userId}`, {
        status,
        rejectionReason: status === 'REJECTED' ? rejectionReason : null,
      });
      alert(`KYC ${status.toLowerCase()} successfully!`);
      setSelectedUser(null);
      setRejectionReason('');
      fetchKycRecords();
    } catch (error) {
      alert(error.response?.data?.error?.message || 'Failed to update KYC');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading KYC records...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold mb-8">KYC Verification</h1>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {['PENDING', 'VERIFIED', 'REJECTED', 'ALL'].map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'default' : 'outline'}
              onClick={() => setFilter(status)}
            >
              {status}
            </Button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Pending Verification</p>
            <p className="text-2xl font-bold text-yellow-600">
              {kycRecords.filter((r) => r.kycStatus === 'PENDING').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Verified</p>
            <p className="text-2xl font-bold text-green-600">
              {kycRecords.filter((r) => r.kycStatus === 'VERIFIED').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Rejected</p>
            <p className="text-2xl font-bold text-red-600">
              {kycRecords.filter((r) => r.kycStatus === 'REJECTED').length}
            </p>
          </div>
        </div>

        {/* KYC Records */}
        <div className="space-y-4">
          {kycRecords.length > 0 ? (
            kycRecords.map((record) => (
              <div key={record.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">
                          {record.firstName} {record.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">{record.email}</p>
                      </div>
                      <span
                        className={`ml-auto text-xs px-3 py-1 rounded-full font-semibold ${
                          record.kycStatus === 'VERIFIED'
                            ? 'bg-green-100 text-green-700'
                            : record.kycStatus === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {record.kycStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-600">Phone:</p>
                        <p className="font-semibold">{record.phone || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">DOB:</p>
                        <p className="font-semibold">{record.dateOfBirth || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">ID Type:</p>
                        <p className="font-semibold">{record.idType || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">ID Number:</p>
                        <p className="font-semibold">{record.idNumber || 'N/A'}</p>
                      </div>
                    </div>

                    {record.address && (
                      <div className="mt-3 text-sm">
                        <p className="text-gray-600">Address:</p>
                        <p className="font-semibold">{record.address}</p>
                      </div>
                    )}

                    {record.kycRejectionReason && (
                      <div className="mt-3 p-3 bg-red-50 rounded text-sm">
                        <p className="font-semibold text-red-700">Rejection Reason:</p>
                        <p className="text-red-600">{record.kycRejectionReason}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 min-w-[200px]">
                    {record.documentUrl && (
                      <a
                        href={record.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded transition"
                      >
                        <Eye className="h-4 w-4" />
                        View Document
                      </a>
                    )}

                    {record.kycStatus === 'PENDING' && (
                      <>
                        <Button
                          onClick={() => handleVerify(record.id, 'VERIFIED')}
                          disabled={processing === record.id}
                          className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                        >
                          <CheckCircle className="h-4 w-4" />
                          {processing === record.id ? 'Processing...' : 'Verify'}
                        </Button>

                        <Button
                          variant="outline"
                          onClick={() => setSelectedUser(record)}
                          className="border-red-600 text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <XCircle className="h-4 w-4" />
                          Reject
                        </Button>
                      </>
                    )}

                    {record.kycStatus === 'REJECTED' && (
                      <Button
                        onClick={() => handleVerify(record.id, 'VERIFIED')}
                        disabled={processing === record.id}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {processing === record.id ? 'Processing...' : 'Verify Now'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-12 rounded-lg shadow text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No KYC records found for {filter}</p>
            </div>
          )}
        </div>

        {/* Rejection Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Reject KYC</h3>
              <p className="text-gray-600 mb-4">
                Provide reason for rejecting {selectedUser.firstName}'s KYC:
              </p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter rejection reason..."
                className="w-full p-3 border rounded mb-4 h-32"
                required
              />
              <div className="flex gap-2">
                <Button
                  onClick={() => handleVerify(selectedUser.id, 'REJECTED')}
                  disabled={!rejectionReason || processing === selectedUser.id}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  {processing === selectedUser.id ? 'Rejecting...' : 'Reject KYC'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedUser(null);
                    setRejectionReason('');
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminKyc;
