import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle } from 'lucide-react'; // or your icon library 
import { Button } from '../ui/button';

export default function VerificationFailed() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error');

  useEffect(() => {
    // Auto-redirect after 10 seconds
    const timer = setTimeout(() => navigate('/'), 10000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md text-center bg-white p-8 rounded-lg shadow-md">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Email Verification Failed</h1>
        {error && (
          <p className="text-gray-600 mb-4 p-3 bg-red-50 rounded-md">
            Error: {error}
          </p>
        )}
        <p className="text-gray-600 mb-6">
          The verification link is invalid or has expired. Please request a new verification email.
        </p>
        <div className="flex flex-col space-y-3">
          <Button
            onClick={() => navigate('/resend-verification')} 
            className="w-full"
          >
            Resend Verification Email
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/contact-support')}
            className="w-full"
          >
            Contact Support
          </Button>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          You will be automatically redirected in 10 seconds...
        </p>
      </div>
    </div>
  );
}