import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import api from '../services/api';

function KycUpload() {
  const navigate = useNavigate();
  const [kycStatus, setKycStatus] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchKycStatus();
  }, []);

  const fetchKycStatus = async () => {
    try {
      const response = await api.get('/kyc/status');
      setKycStatus(response.data.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Please upload JPG, PNG, or PDF file only');
      return;
    }

    // Validate file size (5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setFile(selectedFile);
    setError('');

    // Create preview for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('document', file);

      const response = await api.post('/kyc/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('KYC document uploaded successfully! Waiting for admin verification.');
      fetchKycStatus();
      setFile(null);
      setPreview(null);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to upload document');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'VERIFIED':
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case 'REJECTED':
        return <XCircle className="h-16 w-16 text-red-500" />;
      case 'PENDING':
        return <Clock className="h-16 w-16 text-yellow-500" />;
      default:
        return <FileText className="h-16 w-16 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'VERIFIED':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'REJECTED':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'PENDING':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">KYC Verification</h1>

        {/* Current Status */}
        {kycStatus && (
          <div className={`p-6 rounded-lg border-2 mb-8 ${getStatusColor(kycStatus.kycStatus)}`}>
            <div className="flex items-center gap-4 mb-4">
              {getStatusIcon(kycStatus.kycStatus)}
              <div>
                <h2 className="text-2xl font-bold">Status: {kycStatus.kycStatus}</h2>
                {kycStatus.kycStatus === 'VERIFIED' && (
                  <p className="text-sm mt-1">Your KYC is verified. You can use all banking features.</p>
                )}
                {kycStatus.kycStatus === 'PENDING' && (
                  <p className="text-sm mt-1">Your KYC is under review. We'll notify you once verified.</p>
                )}
                {kycStatus.kycStatus === 'REJECTED' && (
                  <p className="text-sm mt-1">Your KYC was rejected. Please upload a new document.</p>
                )}
              </div>
            </div>

            {kycStatus.kycRejectionReason && (
              <div className="mt-4 p-3 bg-white rounded border">
                <p className="text-sm font-semibold">Rejection Reason:</p>
                <p className="text-sm">{kycStatus.kycRejectionReason}</p>
              </div>
            )}

            {kycStatus.documentUrl && (
              <div className="mt-4">
                <a
                  href={kycStatus.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm underline"
                >
                  View Uploaded Document
                </a>
              </div>
            )}
          </div>
        )}

        {/* Upload Form */}
        {(!kycStatus || kycStatus.kycStatus === 'REJECTED' || !kycStatus.documentUrl) && (
          <div className="bg-white p-8 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Upload KYC Document</h3>
            <p className="text-gray-600 mb-6">
              Upload a clear photo or scan of your {kycStatus?.idType || 'ID document'}
            </p>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded mb-4 border border-red-200">
                {error}
              </div>
            )}

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
              {preview ? (
                <div className="mb-4">
                  <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded" />
                  <p className="text-sm text-gray-600 mt-2">{file.name}</p>
                </div>
              ) : file ? (
                <div className="mb-4">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">{file.name}</p>
                </div>
              ) : (
                <>
                  <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">JPG, PNG or PDF (max 5MB)</p>
                </>
              )}

              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,application/pdf"
                onChange={handleFileChange}
                className="hidden"
                id="fileInput"
              />
              <label htmlFor="fileInput">
                <Button type="button" variant="outline" className="mt-4" asChild>
                  <span className="cursor-pointer">
                    {file ? 'Change File' : 'Select File'}
                  </span>
                </Button>
              </label>
            </div>

            <div className="space-y-2 mb-6 text-sm text-gray-600">
              <p>✓ Document must be clear and readable</p>
              <p>✓ All details must be visible</p>
              <p>✓ File size should be less than 5MB</p>
              <p>✓ Accepted formats: JPG, PNG, PDF</p>
            </div>

            <Button
              onClick={handleUpload}
              disabled={!file || loading}
              className="w-full h-12 text-lg"
            >
              {loading ? 'Uploading...' : 'Upload Document'}
            </Button>
          </div>
        )}

        <div className="mt-6 text-center">
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}

export default KycUpload;
