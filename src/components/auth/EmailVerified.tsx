import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, AlertCircle, MailCheck, MailWarning, Loader2 } from 'lucide-react'; 
import { API_URL } from '../../helper/url';
import { Button } from '../ui/button';

interface UserData {
  _id: string;
  email: string;
  isVerified: boolean;
  // Add other properties as needed
}

export default function EmailVerified() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<{
    loading: boolean;
    verified: boolean;
    user: UserData | null;
    error: string | null;
  }>({
    loading: true,
    verified: false,
    user: null,
    error: null
  });

  const email = searchParams.get('email');

  useEffect(() => {
    const checkVerificationStatus = async () => {
      try {
        if (!email) {
          throw new Error('No email parameter provided');
        }

        const response = await fetch(`${API_URL}/users/email/${encodeURIComponent(email)}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch user data');
        }

        const data: UserData = await response.json();

        setVerificationStatus({
          loading: false,
          verified: data.isVerified,
          user: data,
          error: null
        });

      } catch (error) {
        setVerificationStatus({
          loading: false,
          verified: false,
          user: null,
          error: error instanceof Error ? error.message : 'An unknown error occurred'
        });
      }
    };

    checkVerificationStatus();
  }, [email]);
 

  if (verificationStatus.loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="w-full max-w-md text-center bg-white p-8 rounded-lg shadow-md">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Checking Verification Status</h1>
          <p className="text-gray-600">Please wait while we verify your email...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md text-center bg-white p-8 rounded-lg shadow-md">
        {verificationStatus.verified ? (
          <>
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Email Verified Successfully!</h1>
            {email && (
              <div className="bg-green-50 text-green-800 p-3 rounded-md mb-6">
                <div className="flex items-center justify-center gap-2">
                  <MailCheck className="w-5 h-5" />
                  <span>{email} is now verified</span>
                </div>
              </div>
            )}
            <p className="text-gray-600 mb-6">
              Your account is ready to use. You can now log in with your credentials.
            </p>
            <Button 
              onClick={() => navigate('/login')} 
              className="w-full mb-3"
            >
              Continue to Login
            </Button>
          </>
        ) : (
          <>
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Email Not Verified</h1>
            {email && (
              <div className="bg-yellow-50 text-yellow-800 p-3 rounded-md mb-6">
                <div className="flex items-center justify-center gap-2">
                  <MailWarning className="w-5 h-5" />
                  <span>{email} is not verified</span>
                </div>
              </div>
            )}
            {verificationStatus.error ? (
              <p className="text-red-500 mb-6">{verificationStatus.error}</p>
            ) : (
              <p className="text-gray-600 mb-6">
                Please check your inbox for the verification email or request a new one.
              </p>
            )}
            <div className="flex flex-col space-y-3">
              <Button  
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Reload
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/register')}
                className="w-full"
              >
                Register with Different Email
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}