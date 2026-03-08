import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '../components/Button';

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 9.99,
    period: 'month',
    features: [
      'Book up to 5 appointments/month',
      'Access to medical records',
      'Email support',
      'Basic health tips'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 19.99,
    period: 'month',
    popular: true,
    features: [
      'Unlimited appointments',
      'Priority booking',
      'Access to medical records',
      '24/7 chat support',
      'Health monitoring dashboard',
      'Prescription reminders',
      '10% discount on consultations'
    ]
  },
  {
    id: 'family',
    name: 'Family',
    price: 34.99,
    period: 'month',
    features: [
      'Everything in Premium',
      'Up to 5 family members',
      'Shared medical records',
      'Family health insights',
      'Dedicated family coordinator',
      '15% discount on consultations'
    ]
  }
];

export function SubscriptionPlans() {
  const navigate = useNavigate();
  const [activePlan, setActivePlan] = useState<string | null>('premium');
  
  const handleSubscribe = (planId: string) => {
    // Mock subscription - in production would call API: POST /subscriptions
    setActivePlan(planId);
    alert(`Successfully subscribed to ${plans.find(p => p.id === planId)?.name} plan!`);
  };
  
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button onClick={() => navigate('/my-dashboard')} className="flex items-center gap-2 hover:text-blue-600 mb-3">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl">Subscription Plans</h1>
        </div>
      </header>
      
      {/* Plans */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl mb-4">Choose Your Plan</h2>
          <p className="text-xl text-gray-600">Get more from your healthcare experience</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const isActive = activePlan === plan.id;
            
            return (
              <div
                key={plan.id}
                className={`bg-white rounded-xl shadow-sm overflow-hidden ${
                  plan.popular ? 'ring-2 ring-blue-600' : ''
                }`}
              >
                {plan.popular && (
                  <div className="bg-blue-600 text-white text-center py-2 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                
                <div className="p-8">
                  <h3 className="text-2xl mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl">${plan.price}</span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {isActive ? (
                    <div className="w-full py-3 bg-green-100 text-green-700 rounded-lg text-center font-medium">
                      Current Plan
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleSubscribe(plan.id)}
                      variant={plan.popular ? 'primary' : 'outline'}
                      className="w-full"
                    >
                      Subscribe
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-12 text-center text-gray-600">
          <p>All plans include secure data storage and HIPAA compliance</p>
          <p className="mt-2">Cancel anytime. No hidden fees.</p>
        </div>
      </main>
    </div>
  );
}