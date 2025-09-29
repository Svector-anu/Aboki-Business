import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const EmailVerificationPage = () => {
  const router = useRouter();
  const [verificationState, setVerificationState] = useState('loading');
  const [verificationData, setVerificationData] = useState(null);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const verifyEmail = async () => {
      const { token } = router.query;
      
      if (!token) {
        setVerificationState('error');
        setError('No verification token provided');
        return;
      }

      try {
        console.log('Verifying email with token:', token);

        // Call the real Aboki B2B API
        const response = await fetch('https://api.aboki.xyz/api/v1/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token })
        });

        const result = await response.json();
        console.log('Verification result:', result);

        if (result.success) {
          setVerificationState('success');
          setVerificationData(result.data);
          
          // Start countdown for redirect
          const timer = setInterval(() => {
            setCountdown(prev => {
              if (prev <= 1) {
                clearInterval(timer);
                router.push('/auth/signin');
                return 0;
              }
              return prev - 1;
            });
          }, 1000);

        } else {
          setVerificationState('error');
          setError(result.message || 'Email verification failed');
        }
      } catch (err) {
        console.error('Verification error:', err);
        setVerificationState('error');
        setError('Network error. Please check your connection and try again.');
      }
    };

    if (router.isReady) {
      verifyEmail();
    }
  }, [router.query, router.isReady]);

  const handleManualRedirect = () => {
    router.push('/auth/signin');
  };

  const renderContent = () => {
    switch (verificationState) {
      case 'loading':
        return (
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-purple-600 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verifying Your Email
            </h1>
            <p className="text-gray-600 mb-4">
              Please wait while we verify your email address...
            </p>
            <div className="max-w-md mx-auto">
              <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className="bg-purple-600 h-full rounded-full animate-pulse w-3/4"></div>
              </div>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Email Verified Successfully! 🎉
            </h1>
            <p className="text-gray-600 mb-6">
              Your email address has been verified. You can now sign in to your account.
            </p>
            
            {verificationData && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
                <h3 className="font-semibold text-blue-900 mb-2">Next Steps:</h3>
                <p className="text-blue-800 text-sm">
                  {verificationData.nextSteps || "Your account will be reviewed by our admin team for API access. This usually takes 1-2 business days."}
                </p>
                {verificationData.verificationStatus && (
                  <p className="text-blue-700 text-xs mt-2 font-medium">
                    Status: {verificationData.verificationStatus}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-4">
              <button
                onClick={handleManualRedirect}
                className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transform hover:scale-105 transition-all duration-200 font-medium"
              >
                <span>Continue to Sign In</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              <p className="text-sm text-gray-500">
                Redirecting automatically in <span className="font-bold text-purple-600">{countdown}</span> seconds...
              </p>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verification Failed
            </h1>
            <p className="text-gray-600 mb-4">
              {error}
            </p>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
              <h3 className="font-semibold text-red-900 mb-2">Common Issues:</h3>
              <ul className="text-red-800 text-sm text-left space-y-1">
                <li>• Verification link has expired</li>
                <li>• Link has already been used</li>
                <li>• Invalid or corrupted token</li>
              </ul>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => router.push('/auth/signin')}
                className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                <span>Go to Sign In</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              <div className="text-center">
                <button
                  onClick={() => router.push('/auth/signup')}
                  className="text-purple-600 hover:text-purple-700 text-sm underline"
                >
                  Need to create a new account?
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
          {renderContent()}
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>Secure email verification powered by Aboki</span>
          </div>
          <div className="mt-2 flex items-center justify-center space-x-4 text-xs text-gray-400">
            <span>🛡️ Enterprise Security</span>
            <span>•</span>
            <span>🌍 Global Banking</span>
            <span>•</span>
            <span>⚡ Real-time Processing</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;