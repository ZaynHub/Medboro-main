import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Shield, Plus, Search, FileText, CheckCircle, Clock, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/Button';
import { getInsurancePolicies, getCoverageReports } from '../../utils/api';

export function InsuranceDashboard() {
  const navigate = useNavigate();
  const [policies, setPolicies] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user') || '{"name":"Guest","id":"guest"}');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [policiesData, reportsData] = await Promise.all([
        getInsurancePolicies(user.id),
        getCoverageReports(user.id)
      ]);
      setPolicies(policiesData);
      setReports(reportsData);
    } catch (error) {
      console.error('Error loading insurance data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'full': return 'text-green-600 bg-green-50 border-green-200';
      case 'partial': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'not_covered': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'full': return <CheckCircle className="w-5 h-5" />;
      case 'partial': return <AlertCircle className="w-5 h-5" />;
      case 'not_covered': return <AlertCircle className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading insurance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Insurance Claims & Coverage</h1>
              <p className="text-blue-100 mt-1">Check eligibility and get AI-powered claim guidance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => navigate('/insurance/add-policy')}
            className="bg-white rounded-xl p-6 shadow-sm border-2 border-blue-600 hover:shadow-md transition-shadow text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Add / Update Policy</h3>
                <p className="text-sm text-gray-600">Upload your insurance details</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/insurance/select-treatment')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Check Treatment Coverage</h3>
                <p className="text-sm text-blue-100">Get AI-powered eligibility check</p>
              </div>
            </div>
          </button>
        </div>

        {/* Active Policies */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Active Insurance Policies</h2>
          {policies.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
              <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Policies Added</h3>
              <p className="text-gray-600 mb-6">Add your insurance policy to start checking coverage</p>
              <Button onClick={() => navigate('/insurance/add-policy')}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Policy
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {policies.map((policy) => (
                <div key={policy.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{policy.provider}</h3>
                      <p className="text-sm text-gray-600">Policy #{policy.policyNumber}</p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                      Active
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium text-gray-900">{policy.policyType}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Sum Insured:</span>
                      <span className="font-medium text-gray-900">₹{policy.sumInsured.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Start Date:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(policy.startDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/insurance/add-policy?id=${policy.id}`)}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    View / Edit Details →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Saved Coverage Reports */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Saved Coverage Reports</h2>
          {reports.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Coverage Reports</h3>
              <p className="text-gray-600 mb-6">Check coverage for a treatment to see reports here</p>
              <Button onClick={() => navigate('/insurance/select-treatment')} variant="outline">
                <Search className="w-4 h-4 mr-2" />
                Check Coverage
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <button
                  key={report.id}
                  onClick={() => navigate(`/insurance/coverage-results?id=${report.id}`)}
                  className="w-full bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(report.status)}`}>
                      {getStatusIcon(report.status)}
                      <span className="text-sm font-medium capitalize">
                        {report.status === 'full' ? 'Fully Covered' : 
                         report.status === 'partial' ? 'Partially Covered' : 
                         'Not Covered'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{report.treatmentType}</h3>
                      <p className="text-sm text-gray-600 mb-2">{report.treatmentName}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Checked: {new Date(report.createdAt).toLocaleDateString()}</span>
                        {report.estimatedCost && (
                          <span>Est. Cost: ₹{report.estimatedCost.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Estimated Coverage</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {report.coveragePercentage}%
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
