import { AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';

export function StripeSetupInstructions() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold text-blue-900 mb-2">Stripe Setup Required</h3>
          <p className="text-sm text-blue-800 mb-4">
            To process real payments, you need to configure your Stripe API keys. Follow these steps:
          </p>
          
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800 mb-4">
            <li>
              Create a Stripe account at{' '}
              <a 
                href="https://dashboard.stripe.com/register" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                stripe.com
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>Get your API keys from the Stripe Dashboard</li>
            <li>Add your <strong>Secret Key</strong> to the STRIPE_SECRET_KEY environment variable</li>
            <li>Replace 'pk_test_YOUR_PUBLISHABLE_KEY' in the code with your <strong>Publishable Key</strong></li>
          </ol>
          
          <div className="bg-white rounded-md p-3 border border-blue-200">
            <p className="text-xs text-gray-600 mb-2 font-mono">
              Test Mode Keys (for development):
            </p>
            <ul className="text-xs space-y-1 text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Publishable key starts with: <code className="bg-gray-100 px-1 rounded">pk_test_</code></span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Secret key starts with: <code className="bg-gray-100 px-1 rounded">sk_test_</code></span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
