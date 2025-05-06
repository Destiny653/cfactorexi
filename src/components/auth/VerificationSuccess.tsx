import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react'; // or your icon library 
import { Button } from '../ui/button';

export default function VerificationSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setTimeout(() => navigate('/login'), 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md text-center bg-white p-8 rounded-lg shadow-md">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Email Verified Successfully!</h1>
        <p className="text-gray-600 mb-6">
          Your email address has been successfully verified. You can now access all features.
        </p>
        <div className="flex flex-col space-y-3">
          <Button onClick={() => navigate('/login')} className="w-full">
            Go to Login
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="w-full"
          >
            Return Home
          </Button>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          You will be automatically redirected in 5 seconds...
        </p>
      </div>
    </div>
  );
}