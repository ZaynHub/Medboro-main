import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { ArrowLeft, CheckCircle, AlertCircle, XCircle, Clock, FileText, IndianRupee, Info } from 'lucide-react';
import { Button } from '../../components/Button';
import { getCoverageReport } from '../../utils/api';

export function CoverageResults() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reportId = searchParams.get('id');

  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReport();
  }, [reportId]);

  const loadReport = async () => {
    try {
      if (!reportId) {
        setError('No report ID provided');
        setIsLoading(false);
        return;
      }

      const data = await getCoverageReport(reportId);
      setReport(data);
    } catch (err: any) {
      console.error('Error loading report:', err);
      setError(err.message || 'Failed to load coverage report');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'full':
        return {
          icon: CheckCircle,
          text: 'Fully Covered',
          color: 'green',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-700',
          iconColor: 'text-green-600'
        };
      case 'partial':
        return {
          icon: AlertCircle,
          text: 'Partially Covered',
          color: 'yellow',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-700',
          iconColor: 'text-yellow-600'
        };
      case 'not_covered':
        return {
          icon: XCircle,
          text: 'Not Covered',
          color: 'red',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-700',
          iconColor: 'text-red-600'
        };
      default:
        return {
          icon: Clock,
          text: 'Pending',
          color: 'gray',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-700',
          iconColor: 'text-gray-600'
        };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading coverage report...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white rounded-xl p-12 text-center max-w-md border border-gray-200">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Report</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => navigate('/insurance')}>
            Back to Insurance
          </Button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(report.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={`bg-gradient-to-r from-${statusConfig.color}-600 to-${statusConfig.color}-700 text-white`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <button
            onClick={() => navigate('/insurance')}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Insurance
          </button>
          <div className="flex items-center gap-4 mb-4">
            <StatusIcon className="w-12 h-12" />
            <div>
              <h1 className="text-3xl font-bold">{statusConfig.text}</h1>
              <p className="text-white/80 mt-1">Coverage analysis for {report.treatmentName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Coverage Summary Card */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Coverage Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-2">Coverage Status</p>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${statusConfig.bgColor} ${statusConfig.borderColor} border`}>
                <StatusIcon className={`w-5 h-5 ${statusConfig.iconColor}`} />
                <span className={`font-bold ${statusConfig.textColor}`}>{statusConfig.text}</span>
              </div>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-2">Estimated Coverage</p>
              <p className="text-3xl font-bold text-gray-900">{report.coveragePercentage}%</p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-2">Sum Insured</p>
              <p className="text-2xl font-bold text-gray-900">₹{report.policy?.sumInsured?.toLocaleString() || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Treatment Details */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Treatment Details</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Category</p>
              <p className="font-medium text-gray-900">{report.treatmentType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Treatment</p>
              <p className="font-medium text-gray-900">{report.treatmentName}</p>
            </div>
            {report.estimatedCost && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Estimated Cost</p>
                <p className="font-medium text-gray-900">₹{report.estimatedCost.toLocaleString()}</p>
              </div>
            )}
            {report.hospitalType && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Hospital Type</p>
                <p className="font-medium text-gray-900">{report.hospitalType}</p>
              </div>
            )}
          </div>
        </div>

        {/* Eligible Cost Components */}
        {report.coveredComponents && report.coveredComponents.length > 0 && (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Eligible Cost Components</h2>
            <div className="space-y-3">
              {report.coveredComponents.map((component: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-900">{component.name}</span>
                  </div>
                  {component.limit && (
                    <span className="text-sm text-gray-600">Up to ₹{component.limit.toLocaleString()}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sub-limits & Co-pay */}
        {(report.sublimits || report.copay) && (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Sub-limits & Co-payments</h2>
            <div className="space-y-4">
              {report.sublimits && report.sublimits.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Sub-limits</h3>
                  <div className="space-y-2">
                    {report.sublimits.map((limit: any, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{limit.category}</p>
                          <p className="text-sm text-gray-600">{limit.description}</p>
                          <p className="text-sm font-medium text-yellow-700 mt-1">Limit: ₹{limit.amount.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {report.copay && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <IndianRupee className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Co-payment Required</p>
                      <p className="text-sm text-gray-600">You need to pay {report.copay}% of the eligible claim amount</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Waiting Period Status */}
        {report.waitingPeriodStatus && (
          <div className={`rounded-xl p-6 shadow-sm border mb-6 ${
            report.waitingPeriodStatus.isCompleted
              ? 'bg-green-50 border-green-200'
              : 'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex items-start gap-3">
              {report.waitingPeriodStatus.isCompleted ? (
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              ) : (
                <Clock className="w-6 h-6 text-yellow-600 flex-shrink-0" />
              )}
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Waiting Period Status</h3>
                <p className="text-gray-700">{report.waitingPeriodStatus.message}</p>
                {!report.waitingPeriodStatus.isCompleted && report.waitingPeriodStatus.remainingDays && (
                  <p className="text-sm text-gray-600 mt-2">
                    Approximately {report.waitingPeriodStatus.remainingDays} days remaining
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Estimated Out-of-Pocket */}
        {report.estimatedCost && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 shadow-sm text-white mb-6">
            <h2 className="text-xl font-bold mb-4">Estimated Out-of-Pocket Cost</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-blue-100 text-sm mb-1">Total Estimated Cost</p>
                <p className="text-3xl font-bold">₹{report.estimatedCost.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm mb-1">Insurance Coverage</p>
                <p className="text-3xl font-bold">₹{report.estimatedCoverage?.toLocaleString() || '0'}</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm mb-1">Your Payment</p>
                <p className="text-3xl font-bold">₹{report.estimatedOutOfPocket?.toLocaleString() || '0'}</p>
              </div>
            </div>
            <p className="text-blue-100 text-sm mt-4">
              * This is an estimate based on policy terms. Actual coverage may vary based on hospital bills and policy conditions.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={() => navigate('/insurance/claim-guidance', { state: { report } })}
            className="flex-1"
          >
            <FileText className="w-4 h-4 mr-2" />
            View Claim Guidance
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/insurance/select-treatment')}
            className="flex-1"
          >
            Check Another Treatment
          </Button>
        </div>
      </div>
    </div>
  );
}
