import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, CreditCard, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { createAppointment, createPaymentIntent, getPaymentStatus } from '../utils/api';
import { AppointmentQRCode } from '../components/AppointmentQRCode';

export function Payment() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'wallet'>('card');
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const [error, setError] = useState('');
  const [cardElement, setCardElement] = useState<any>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [completedAppointment, setCompletedAppointment] = useState<any>(null);
  const [upiId, setUpiId] = useState('');
  
  const bookingData = JSON.parse(sessionStorage.getItem('pendingBooking') || '{}');
  
  if (!bookingData.doctorId) {
    navigate('/hospital-search');
    return null;
  }
  
  const totalAmount = bookingData.fee + 5; // Including platform fee
  
  // Load Stripe.js
  useEffect(() => {
    // Check if Stripe is already loaded
    if ((window as any).Stripe) {
      setStripeLoaded(true);
      return;
    }
    
    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src="https://js.stripe.com/v3/"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => setStripeLoaded(true));
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;
    script.onload = () => {
      setStripeLoaded(true);
    };
    document.body.appendChild(script);
  }, []);
  
  // Initialize Stripe Elements when Stripe is loaded
  useEffect(() => {
    if (stripeLoaded && paymentMethod === 'card') {
      // Note: In production, you need to use your Stripe Publishable Key
      // For now, this will show test mode UI
      const stripe = (window as any).Stripe('pk_test_YOUR_PUBLISHABLE_KEY');
      const elements = stripe.elements();
      const card = elements.create('card', {
        style: {
          base: {
            fontSize: '16px',
            color: '#424770',
            '::placeholder': {
              color: '#aab7c4',
            },
          },
          invalid: {
            color: '#9e2146',
          },
        },
      });
      
      const cardMountPoint = document.getElementById('card-element');
      if (cardMountPoint) {
        card.mount('#card-element');
        setCardElement({ stripe, card });
      }
    }
  }, [stripeLoaded, paymentMethod]);
  
  const handlePayment = async () => {
    setIsProcessing(true);
    setError('');
    
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{\"id\":\"guest\",\"name\":\"Guest User\"}');
      const appointmentId = Date.now().toString();
      const paymentTime = new Date().toLocaleString();
      
      if (paymentMethod === 'card' && cardElement) {
        // Create payment intent for card
        const paymentResult = await createPaymentIntent({
          amount: totalAmount,
          currency: 'usd',
          metadata: {
            appointmentId,
            userId: user.id,
            doctorName: bookingData.doctorName,
          },
          paymentMethod: 'card'
        });
        
        if (!paymentResult.clientSecret) {
          throw new Error('Failed to create payment session');
        }
        
        // Confirm the payment
        const { error: stripeError, paymentIntent } = await cardElement.stripe.confirmCardPayment(paymentResult.clientSecret, {
          payment_method: {
            card: cardElement.card,
            billing_details: {
              name: user.name,
              email: user.email,
            },
          },
        });
        
        if (stripeError) {
          throw new Error(stripeError.message);
        }
        
        if (paymentIntent.status !== 'succeeded') {
          throw new Error('Payment was not successful');
        }
        
        // Payment successful, create appointment
        const appointment = {
          id: appointmentId,
          ...bookingData,
          userId: user.id || 'guest',
          patientName: user.name,
          status: 'upcoming',
          paymentId: paymentIntent.id,
          paymentStatus: 'paid',
          paymentMethod: 'card',
          paymentTime,
        };
        
        await createAppointment(appointment);
        
        // Also save to localStorage as fallback
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        appointments.push(appointment);
        localStorage.setItem('appointments', JSON.stringify(appointments));
        
        setCompletedAppointment(appointment);
        setPaymentSuccess(true);
        
      } else if (paymentMethod === 'upi') {
        // Validate UPI ID
        if (!upiId || !upiId.includes('@')) {
          throw new Error('Please enter a valid UPI ID (e.g., yourname@paytm)');
        }
        
        // Create payment intent for UPI
        const { clientSecret, paymentIntentId } = await createPaymentIntent({
          amount: totalAmount * 83, // Convert to INR (approximate)
          currency: 'inr',
          metadata: {
            appointmentId,
            userId: user.id,
            doctorName: bookingData.doctorName,
            upiId,
          },
          paymentMethod: 'upi'
        });
        
        // In a real implementation, Stripe would redirect to UPI app
        // For demo, we'll simulate successful payment after a delay
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Check payment status (in real app, this would be done after redirect)
        const paymentStatus = await getPaymentStatus(paymentIntentId);
        
        // For demo purposes, we'll consider it successful
        const appointment = {
          id: appointmentId,
          ...bookingData,
          userId: user.id || 'guest',
          patientName: user.name,
          status: 'upcoming',
          paymentId: paymentIntentId,
          paymentStatus: 'paid',
          paymentMethod: 'upi',
          upiId,
          paymentTime,
        };
        
        await createAppointment(appointment);
        
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        appointments.push(appointment);
        localStorage.setItem('appointments', JSON.stringify(appointments));
        
        setCompletedAppointment(appointment);
        setPaymentSuccess(true);
        
      } else {
        // For Wallet, simulate payment
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const appointment = {
          id: appointmentId,
          ...bookingData,
          userId: user.id || 'guest',
          patientName: user.name,
          status: 'upcoming',
          paymentMethod,
          paymentStatus: 'paid',
          paymentTime,
        };
        
        await createAppointment(appointment);
        
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        appointments.push(appointment);
        localStorage.setItem('appointments', JSON.stringify(appointments));
        
        setCompletedAppointment(appointment);
        setPaymentSuccess(true);
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };
  
  // If payment is successful, show QR code
  if (paymentSuccess && completedAppointment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
              Medboro
            </h1>
            <Button onClick={() => navigate('/dashboard')} variant="outline">
              Go to Dashboard
            </Button>
          </div>
        </header>
        
        {/* QR Code Display */}
        <main className="max-w-2xl mx-auto px-6 py-12">
          <AppointmentQRCode appointment={completedAppointment} />
          
          {/* Action Buttons */}
          <div className="flex gap-4 mt-8 justify-center">
            <Button onClick={() => window.print()} variant="outline" size="lg">
              Print QR Code
            </Button>
            <Button 
              onClick={() => {
                sessionStorage.removeItem('pendingBooking');
                navigate('/dashboard');
              }} 
              size="lg"
            >
              Back to Dashboard
            </Button>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 hover:text-blue-600">
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>
      </header>
      
      {/* Payment Form */}
      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h1 className="text-3xl mb-8">Payment</h1>
              
              {/* Payment Method Selection */}
              <div className="mb-8">
                <h2 className="text-xl mb-4">Select Payment Method</h2>
                <div className="space-y-3">
                  <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'card' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'card')}
                      className="w-4 h-4"
                    />
                    <CreditCard className="w-5 h-5" />
                    <span>Credit / Debit Card</span>
                  </label>
                  
                  <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'upi' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'upi')}
                      className="w-4 h-4"
                    />
                    <span>UPI</span>
                  </label>
                  
                  <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'wallet' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="wallet"
                      checked={paymentMethod === 'wallet'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'wallet')}
                      className="w-4 h-4"
                    />
                    <span>Digital Wallet</span>
                  </label>
                </div>
              </div>
              
              {/* Card Details */}
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div id="card-element" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></div>
                  
                  {error && (
                    <div className="text-red-500 text-sm mt-2">
                      <AlertCircle className="w-4 h-4 inline-block mr-1" />
                      {error}
                    </div>
                  )}
                </div>
              )}
              
              {/* UPI ID Input */}
              {paymentMethod === 'upi' && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="upiId" className="block text-sm mb-2 font-medium">UPI ID</label>
                    <input
                      id="upiId"
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="yourname@paytm"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Enter your UPI ID to complete the payment via Stripe UPI
                    </p>
                  </div>
                  
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900 font-medium mb-2">💡 How UPI Payment Works:</p>
                    <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
                      <li>Enter your UPI ID above</li>
                      <li>Click "Pay Now" to initiate payment</li>
                      <li>Complete payment in your UPI app</li>
                      <li>Get your QR code confirmation instantly</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Summary */}
          <div>
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <h2 className="text-xl mb-6">Booking Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Doctor</p>
                  <p className="font-medium">{bookingData.doctorName}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Specialty</p>
                  <p>{bookingData.specialty}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Hospital</p>
                  <p>{bookingData.hospitalName}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Date & Time</p>
                  <p>{bookingData.date} at {bookingData.time}</p>
                </div>
              </div>
              
              <div className="border-t pt-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Consultation Fee</span>
                  <span>${bookingData.fee}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Platform Fee</span>
                  <span>$5</span>
                </div>
                <div className="flex items-center justify-between text-lg mt-4">
                  <span>Total Amount</span>
                  <span className="text-blue-600">${totalAmount}</span>
                </div>
              </div>
              
              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Pay Now'
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}