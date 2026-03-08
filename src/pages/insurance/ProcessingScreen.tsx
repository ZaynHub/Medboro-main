import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Loader2, Check } from 'lucide-react';
import { checkCoverage } from '../../utils/api';

const PROCESSING_STEPS = [
  { id: 1, text: 'Analyzing policy document...', duration: 1500 },
  { id: 2, text: 'Extracting coverage clauses...', duration: 2000 },
  { id: 3, text: 'Classifying exclusions and sub-limits...', duration: 1800 },
  { id: 4, text: 'Matching treatment with policy terms...', duration: 2200 },
  { id: 5, text: 'Evaluating eligibility criteria...', duration: 1600 },
  { id: 6, text: 'Calculating coverage estimates...', duration: 1400 }
];

export function ProcessingScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    processSteps();
  }, []);

  const processSteps = async () => {
    // Process each step with animation
    for (let i = 0; i < PROCESSING_STEPS.length; i++) {
      setCurrentStep(i);
      await new Promise(resolve => setTimeout(resolve, PROCESSING_STEPS[i].duration));
      setCompletedSteps(prev => [...prev, i]);
    }

    // After all steps complete, process coverage check
    try {
      const policyId = searchParams.get('policyId');
      const treatmentType = searchParams.get('treatmentType');
      const treatmentName = searchParams.get('treatmentName');
      const estimatedCost = searchParams.get('estimatedCost');
      const hospitalType = searchParams.get('hospitalType');
      const roomType = searchParams.get('roomType');

      const user = JSON.parse(localStorage.getItem('user') || '{"id":"guest"}');

      // Call backend to check coverage
      const result = await checkCoverage({
        userId: user.id,
        policyId: policyId!,
        treatmentType: treatmentType!,
        treatmentName: treatmentName!,
        estimatedCost: estimatedCost ? parseInt(estimatedCost) : undefined,
        hospitalType: hospitalType || undefined,
        roomType: roomType || undefined
      });

      // Navigate to results with report ID
      setTimeout(() => {
        navigate(`/insurance/coverage-results?id=${result.id}`);
      }, 500);
    } catch (error) {
      console.error('Error processing coverage:', error);
      // Navigate back with error
      navigate('/insurance/select-treatment?error=processing_failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analyzing Your Coverage</h1>
            <p className="text-gray-600">
              Our AI is processing your policy details and treatment information
            </p>
          </div>

          {/* Processing Steps */}
          <div className="space-y-4">
            {PROCESSING_STEPS.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-start gap-4 p-4 rounded-lg transition-all duration-300 ${
                  completedSteps.includes(index)
                    ? 'bg-green-50 border border-green-200'
                    : currentStep === index
                    ? 'bg-blue-50 border border-blue-200'
                    : 'bg-gray-50 border border-gray-200'
                }`}
              >
                {/* Icon */}
                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                  completedSteps.includes(index)
                    ? 'bg-green-500'
                    : currentStep === index
                    ? 'bg-blue-500'
                    : 'bg-gray-300'
                }`}>
                  {completedSteps.includes(index) ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : currentStep === index ? (
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  ) : (
                    <div className="w-3 h-3 bg-white rounded-full opacity-50"></div>
                  )}
                </div>

                {/* Text */}
                <div className="flex-1">
                  <p className={`font-medium ${
                    completedSteps.includes(index)
                      ? 'text-green-700'
                      : currentStep === index
                      ? 'text-blue-700'
                      : 'text-gray-500'
                  }`}>
                    {step.text}
                  </p>
                </div>

                {/* Loader for current step */}
                {currentStep === index && !completedSteps.includes(index) && (
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin flex-shrink-0" />
                )}
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mt-8">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{Math.round((completedSteps.length / PROCESSING_STEPS.length) * 100)}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500 ease-out"
                style={{ width: `${(completedSteps.length / PROCESSING_STEPS.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Info Note */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 text-center">
              <strong>AI-Powered Analysis:</strong> We're using advanced natural language processing to extract and analyze your policy terms for accurate coverage assessment.
            </p>
          </div>
        </div>

        {/* Bottom Note */}
        <p className="text-center text-gray-500 text-sm mt-6">
          This usually takes 10-15 seconds. Please don't close this window.
        </p>
      </div>
    </div>
  );
}
