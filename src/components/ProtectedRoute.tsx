import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const user = localStorage.getItem('user');
    
    // If not authenticated and trying to access protected route, redirect to signin
    if (!isAuthenticated || !user) {
      // Save the intended destination
      localStorage.setItem('redirectAfterLogin', location.pathname);
      navigate('/signin');
    }
  }, [navigate, location]);
  
  // Check authentication state
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  const user = localStorage.getItem('user');
  
  // Only render children if authenticated
  if (!isAuthenticated || !user) {
    return null;
  }
  
  return <>{children}</>;
}
