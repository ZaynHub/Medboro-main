import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { signUp } from '../utils/api';

export function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      console.log('Attempting signup with:', { email: formData.email, phone: formData.phone });
      
      // Call the API to create user in database
      const user = await signUp(formData);
      
      console.log('Signup successful, user:', user);
      
      // Set current user session in localStorage
      localStorage.setItem('user', JSON.stringify({ 
        id: user.id,
        name: user.name, 
        email: user.email,
        phone: user.phone 
      }));
      localStorage.setItem('isAuthenticated', 'true');
      
      // Also keep in registeredUsers for backward compatibility
      const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      users.push(user);
      localStorage.setItem('registeredUsers', JSON.stringify(users));
      
      navigate('/location-permission');
    } catch (err: any) {
      console.error('Signup error:', err);
      console.error('Error message:', err.message);
      setError(err.message || 'Failed to create account. Please try again.');
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="max-w-md mx-auto px-6 py-16">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-3xl mb-2 text-center">Create Account</h1>
          <p className="text-gray-600 text-center mb-8">Join HealthCare to book appointments</p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm mb-2">Full Name</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm mb-2">Email</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm mb-2">Phone Number</label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your phone number"
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
                placeholder="Create a password"
                required
              />
            </div>
            
            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </form>
          
          {error && <p className="text-center mt-3 text-red-500">{error}</p>}
          
          <p className="text-center mt-6 text-gray-600">
            Already have an account?{' '}
            <Link to="/signin" className="text-blue-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}