import { useLocation, useNavigate } from 'react-router';
import { ArrowLeft, FileText, CheckSquare, Clock, CreditCard, Building2, AlertCircle, Download } from 'lucide-react';
import { Button } from '../../components/Button';

export function ClaimGuidance() {
  const navigate = useNavigate();
  const location = useLocation();
  const report = location.state?.report;

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white rounded-xl p-12 text-center max-w-md border border-gray-200">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Report Data</h2>
          <p className="text-gray-600 mb-6">Please check coverage first to view claim guidance</p>
          <Button onClick={() => navigate('/insurance/select-treatment')}>
            Check Coverage
          </Button>
        </div>
      </div>
    );
  }

  const requiredDocuments = [
    { name: 'Completed Claim Form', description: 'Download from insurer website or mobile app', required: true },
    { name: 'Hospital Discharge Summary', description: 'Original or certified copy', required: true },
    { name: 'Final Hospital Bill', description: 'Itemized bill with all charges', required: true },
    { name: 'Payment Receipts', description: 'All payment receipts and invoices', required: true },
    { name: 'Medical Prescriptions', description: 'Doctor\'s prescriptions for medicines', required: true },
    { name: 'Diagnostic Reports', description: 'Lab tests, X-rays, MRI, CT scans, etc.', required: true },
    { name: 'Photo ID Proof', description: 'Aadhar, PAN, or Passport copy', required: true },
    { name: 'Policy Document Copy', description: 'Your insurance policy document', required: true },
    { name: 'FIR Copy (if applicable)', description: 'For accident-related claims', required: false },
    { name: 'Post-hospitalization Bills', description: 'If treatment continues after discharge', required: false }
  ];

  const cashlessSteps = [
    {
      title: 'Before Hospitalization',
      steps: [
        'Verify the hospital is in your insurer\'s network',
        'Call insurance TPA helpline 24-48 hours before admission (for planned treatments)',
        'For emergency: Inform within 24 hours of admission',
        'Share policy number and patient details'
      ]
    },
    {
      title: 'At Hospital Admission',
      steps: [
        'Visit the insurance desk at the hospital',
        'Submit policy card, photo ID, and filled pre-authorization form',
        'Hospital will send pre-authorization request to TPA',
        'TPA typically responds within 2-6 hours'
      ]
    },
    {
      title: 'During Treatment',
      steps: [
        'Keep all medical reports and prescriptions',
        'If treatment cost exceeds approved amount, hospital may request enhancement',
        'Monitor approval status via insurer app or helpline',
        'You may need to pay for non-medical expenses (attendant food, etc.)'
      ]
    },
    {
      title: 'At Discharge',
      steps: [
        'Hospital settles bill directly with insurance company',
        'You only pay co-payment (if applicable) and non-covered items',
        'Collect discharge summary and all medical documents',
        'Keep copies for your records'
      ]
    }
  ];

  const reimbursementSteps = [
    {
      title: 'During Hospitalization',
      steps: [
        'Keep all original bills, receipts, and payment proofs',
        'Collect discharge summary with diagnosis and treatment details',
        'Get itemized bills for all expenses',
        'Take copies of all medical reports and prescriptions'
      ]
    },
    {
      title: 'After Discharge (File within 15-30 days)',
      steps: [
        'Download claim form from insurer website/app',
        'Fill claim form accurately and sign it',
        'Attach all required documents (see checklist below)',
        'Keep photocopies of all documents for your records'
      ]
    },
    {
      title: 'Submit Claim',
      steps: [
        'Online: Upload via insurer portal/mobile app (fastest)',
        'Email: Send scanned documents to claim email address',
        'Courier: Send physical documents to TPA address',
        'Note down claim reference number'
      ]
    },
    {
      title: 'Track & Follow-up',
      steps: [
        'Track claim status via app/website using reference number',
        'TPA may request additional documents - submit within 7 days',
        'Claims typically processed in 7-30 days',
        'Approved amount will be credited to your bank account'
      ]
    }
  ];

  const timeline = [
    { event: 'Claim Submission', days: 'Day 0', description: 'Submit all required documents' },
    { event: 'Acknowledgement', days: 'Day 1-2', description: 'Insurer sends confirmation SMS/email' },
    { event: 'Document Verification', days: 'Day 3-7', description: 'TPA verifies all documents' },
    { event: 'Medical Assessment', days: 'Day 7-15', description: 'Medical team evaluates claim' },
    { event: 'Approval Decision', days: 'Day 15-21', description: 'Claim approved/rejected/queried' },
    { event: 'Payment Processing', days: 'Day 21-30', description: 'Amount credited to bank account' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Results
          </button>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Claim Guidance</h1>
              <p className="text-blue-100 mt-1">Step-by-step guide for filing your insurance claim</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Claim Type Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Cashless */}
          <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-green-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Building2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Cashless Claim</h3>
                <p className="text-sm text-green-600">Recommended for network hospitals</p>
              </div>
            </div>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start gap-2 text-sm">
                <CheckSquare className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">No upfront payment needed</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <CheckSquare className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Hospital settles directly with insurer</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <CheckSquare className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Faster and more convenient</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <CheckSquare className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Only available at network hospitals</span>
              </li>
            </ul>
            <p className="text-xs text-gray-500 bg-green-50 p-3 rounded-lg">
              Best for: Planned surgeries and treatments at network hospitals
            </p>
          </div>

          {/* Reimbursement */}
          <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Reimbursement Claim</h3>
                <p className="text-sm text-blue-600">For any hospital</p>
              </div>
            </div>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start gap-2 text-sm">
                <CheckSquare className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Pay bills yourself, get reimbursed later</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <CheckSquare className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Works at any hospital (network or non-network)</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <CheckSquare className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Submit documents after discharge</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <CheckSquare className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Takes 15-30 days to receive payment</span>
              </li>
            </ul>
            <p className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
              Best for: Emergency treatments, non-network hospitals, or if cashless is denied
            </p>
          </div>
        </div>

        {/* Cashless Process */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Building2 className="w-7 h-7 text-green-600" />
            Cashless Claim Process
          </h2>
          <div className="space-y-6">
            {cashlessSteps.map((phase, index) => (
              <div key={index} className="border-l-4 border-green-500 pl-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{phase.title}</h3>
                <ol className="space-y-2">
                  {phase.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-medium">
                        {stepIndex + 1}
                      </span>
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>

        {/* Reimbursement Process */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <CreditCard className="w-7 h-7 text-blue-600" />
            Reimbursement Claim Process
          </h2>
          <div className="space-y-6">
            {reimbursementSteps.map((phase, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{phase.title}</h3>
                <ol className="space-y-2">
                  {phase.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium">
                        {stepIndex + 1}
                      </span>
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>

        {/* Required Documents Checklist */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <FileText className="w-7 h-7 text-indigo-600" />
            Required Documents Checklist
          </h2>
          <div className="space-y-3">
            {requiredDocuments.map((doc, index) => (
              <div
                key={index}
                className={`flex items-start gap-4 p-4 rounded-lg border ${
                  doc.required
                    ? 'bg-red-50 border-red-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <input
                  type="checkbox"
                  className="mt-1 w-5 h-5 text-blue-600 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{doc.name}</p>
                    {doc.required && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                        Required
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-semibold mb-1">Important Tips:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Keep photocopies of all documents</li>
                  <li>Get documents attested by hospital if required</li>
                  <li>Don't miss deadlines - submit within 15-30 days of discharge</li>
                  <li>Incomplete documents cause delays or rejection</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Clock className="w-7 h-7 text-purple-600" />
            Expected Timeline (Reimbursement)
          </h2>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            {/* Timeline Items */}
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div key={index} className="relative flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center relative z-10 border-4 border-white">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1 pt-2">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-gray-900">{item.event}</h3>
                      <span className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                        {item.days}
                      </span>
                    </div>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 shadow-sm text-white mb-6">
          <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-blue-100 text-sm mb-1">Customer Care</p>
              <p className="text-xl font-bold">1800-XXX-XXXX</p>
              <p className="text-blue-100 text-sm">24/7 Available</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm mb-1">TPA Helpline</p>
              <p className="text-xl font-bold">1800-YYY-YYYY</p>
              <p className="text-blue-100 text-sm">Mon-Sat, 9 AM - 6 PM</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm mb-1">Email Support</p>
              <p className="text-xl font-bold">claims@{report.policy?.provider?.toLowerCase().replace(/\s/g, '')}.com</p>
              <p className="text-blue-100 text-sm">Response in 24-48 hours</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/insurance')}
            className="flex-1"
          >
            Back to Insurance
          </Button>
          <Button
            onClick={() => window.print()}
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Print / Save Guide
          </Button>
        </div>
      </div>
    </div>
  );
}
