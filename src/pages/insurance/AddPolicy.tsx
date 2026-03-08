import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { ArrowLeft, Upload, FileText, AlertCircle } from 'lucide-react';
import { Button } from '../../components/Button';
import { saveInsurancePolicy, getInsurancePolicy } from '../../utils/api';

const INSURANCE_PROVIDERS = [
  'HDFC ERGO',
  'ICICI Lombard',
  'Star Health',
  'Care Health',
  'Max Bupa',
  'Bajaj Allianz',
  'Religare Health',
  'Aditya Birla Health',
  'Niva Bupa',
  'Manipal Cigna',
  'Other'
];

export function AddPolicy() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const policyId = searchParams.get('id');

  const [formData, setFormData] = useState({
    provider: '',
    policyNumber: '',
    policyType: 'Individual',
    sumInsured: '',
    startDate: '',
    waitingPeriodCompleted: false,
    policyDocument: null as File | null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{"id":"guest"}');

  useEffect(() => {
    if (policyId) {
      loadPolicy();
    }
  }, [policyId]);

  const loadPolicy = async () => {
    try {
      const policy = await getInsurancePolicy(policyId!);
      setFormData({
        provider: policy.provider,
        policyNumber: policy.policyNumber,
        policyType: policy.policyType,
        sumInsured: policy.sumInsured.toString(),
        startDate: policy.startDate,
        waitingPeriodCompleted: policy.waitingPeriodCompleted,
        policyDocument: null
      });
      setIsEditMode(true);
    } catch (error) {
      console.error('Error loading policy:', error);
      setError('Failed to load policy details');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate form
      if (!formData.provider || !formData.policyNumber || !formData.sumInsured || !formData.startDate) {
        setError('Please fill in all required fields');
        setIsLoading(false);
        return;
      }

      // Prepare policy data
      const policyData = {
        id: policyId || undefined,
        userId: user.id,
        provider: formData.provider,
        policyNumber: formData.policyNumber,
        policyType: formData.policyType,
        sumInsured: parseInt(formData.sumInsured),
        startDate: formData.startDate,
        waitingPeriodCompleted: formData.waitingPeriodCompleted,
        documentUrl: formData.policyDocument ? 'uploaded' : undefined, // In real app, upload to storage
        status: 'active',
        createdAt: new Date().toISOString()
      };

      await saveInsurancePolicy(policyData);

      // Navigate back to dashboard
      navigate('/insurance');
    } catch (err: any) {
      console.error('Error saving policy:', err);
      setError(err.message || 'Failed to save policy');
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setFormData({ ...formData, policyDocument: file });
      setError('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <button
            onClick={() => navigate('/insurance')}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Insurance
          </button>
          <h1 className="text-3xl font-bold">
            {isEditMode ? 'Update Insurance Policy' : 'Add Insurance Policy'}
          </h1>
          <p className="text-blue-100 mt-1">
            {isEditMode ? 'Update your policy details' : 'Enter your policy details to check coverage'}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <div className="space-y-6">
            {/* Insurance Provider */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Insurance Provider *
              </label>
              <select
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Provider</option>
                {INSURANCE_PROVIDERS.map(provider => (
                  <option key={provider} value={provider}>{provider}</option>
                ))}
              </select>
            </div>

            {/* Policy Number */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Policy Number *
              </label>
              <input
                type="text"
                value={formData.policyNumber}
                onChange={(e) => setFormData({ ...formData, policyNumber: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter policy number"
                required
              />
            </div>

            {/* Policy Type */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Policy Type *
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="Individual"
                    checked={formData.policyType === 'Individual'}
                    onChange={(e) => setFormData({ ...formData, policyType: e.target.value })}
                    className="mr-2"
                  />
                  <span>Individual</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="Family"
                    checked={formData.policyType === 'Family'}
                    onChange={(e) => setFormData({ ...formData, policyType: e.target.value })}
                    className="mr-2"
                  />
                  <span>Family Floater</span>
                </label>
              </div>
            </div>

            {/* Sum Insured */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Sum Insured (₹) *
              </label>
              <input
                type="number"
                value={formData.sumInsured}
                onChange={(e) => setFormData({ ...formData, sumInsured: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 500000"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Enter the total coverage amount</p>
            </div>

            {/* Policy Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Policy Start Date *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Waiting Period Toggle */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.waitingPeriodCompleted}
                  onChange={(e) => setFormData({ ...formData, waitingPeriodCompleted: e.target.checked })}
                  className="mt-1"
                />
                <div>
                  <span className="font-medium text-gray-900">Waiting Period Completed</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Check this if your policy's waiting period for pre-existing conditions and specific treatments has been completed
                  </p>
                </div>
              </label>
            </div>

            {/* Upload Policy Document */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Upload Policy PDF (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="policy-upload"
                />
                <label htmlFor="policy-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  {formData.policyDocument ? (
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <FileText className="w-5 h-5" />
                      <span className="font-medium">{formData.policyDocument.name}</span>
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-700 font-medium mb-1">Click to upload policy PDF</p>
                      <p className="text-sm text-gray-500">Maximum file size: 5MB</p>
                    </>
                  )}
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Upload your policy document for AI-powered clause extraction (coming soon)
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate('/insurance')}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? 'Saving...' : isEditMode ? 'Update Policy' : 'Save Policy'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
