import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { signIn } from '../utils/api';

export function SignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      console.log('Attempting signin with:', { email: formData.email });
      
      // Call the API to authenticate user
      const user = await signIn(formData);
      
      console.log('Signin successful, user:', user);
      
      // Set current user session in localStorage
      localStorage.setItem('user', JSON.stringify({ 
        id: user.id,
        name: user.name, 
        email: user.email,
        phone: user.phone 
      }));
      localStorage.setItem('isAuthenticated', 'true');
      
      // Check if there was a redirect path saved
      const redirectPath = localStorage.getItem('redirectAfterLogin');
      if (redirectPath) {
        localStorage.removeItem('redirectAfterLogin');
        navigate(redirectPath);
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Signin error:', err);
      console.error('Error message:', err.message);
      
      // Show user-friendly error message
      if (err.message.includes('Invalid email or password')) {
        setError('Invalid credentials. Please check your email/phone and password, or sign up if you don\'t have an account.');
      } else {
        setError(err.message || 'Failed to sign in. Please try again.');
      }
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="max-w-md mx-auto px-6 py-16">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-3xl mb-2 text-center">Welcome Back</h1>
          <p className="text-gray-600 text-center mb-8">Sign in to your account</p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm mb-2">Email / Phone</label>
              <input
                id="email"
                type="text"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email or phone"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm mb-2">Password</label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                required
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </a>
            </div>
            
            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                <p className="text-red-600 text-sm text-center font-medium">{error}</p>
                <p className="text-red-500 text-xs text-center mt-2">
                  If you created an account earlier, you may need to sign up again as we recently upgraded our authentication system.
                </p>
              </div>
            )}
          </form>
          
          <p className="text-center mt-6 text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}