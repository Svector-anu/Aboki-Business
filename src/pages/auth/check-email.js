import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const CheckEmailPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState('');

  useEffect(() => {
    // Get email from URL query params
    const { email: queryEmail } = router.query;
    setEmail(queryEmail || '');
  }, [router.query]);

  const handleResendEmail = async () => {
    if (!email) {
      setResendError('Email address not found');
      return;
    }

    setResendLoading(true);
    setResendError('');
    setResendSuccess(false);

    try {
      // Simulating API call for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      setResendSuccess(true);
      
      // Hide success message after 5 seconds
      setTimeout(() => setResendSuccess(false), 5000);
      
    } catch (error) {
      console.error('Resend error:', error);
      setResendError('Failed to resend verification email. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleGoToSignIn = () => {
    router.push('/auth/signin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
          <div className="text-center">
            {/* Email Icon */}
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            {/* Main Heading */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Check Your Email 📧
            </h1>
            
            <p className="text-gray-600 mb-6">
                We&apos;ve sent a verification link to
            </p>

            {/* Email Display */}
            {email && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-6">
                <p className="font-medium text-gray-900 break-all">{decodeURIComponent(email)}</p>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Next Steps:
              </h3>
              <ol className="text-blue-800 text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="bg-blue-200 text-blue-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                  <span>Check your email inbox (and spam folder)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-blue-200 text-blue-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                         <span>Click the &quot;Verify Email Address&quot; button</span>                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-blue-200 text-blue-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                  <span>Return here to sign in to your account</span>
                </li>
              </ol>
            </div>

            {/* Admin Review Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="font-semibold text-amber-900">Admin Review Required</h3>
              </div>
              <p className="text-amber-800 text-sm">
                After email verification, your account will be reviewed by our admin team for API access. This usually takes 1-2 business days.
              </p>
            </div>

            {/* Success/Error Messages */}
            {resendSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-green-800 text-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verification email sent successfully!
                </p>
              </div>
            )}

            {resendError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-800 text-sm">❌ {resendError}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Resend Email Button */}
              <button
                onClick={handleResendEmail}
                disabled={resendLoading || resendSuccess}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {resendLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : resendSuccess ? (
                  <>
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Email Sent!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Resend Verification Email
                  </>
                )}
              </button>

              {/* Sign In Button */}
              <button
                onClick={handleGoToSignIn}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 font-medium"
              >
                <span>Continue to Sign In</span>
                <span>→</span>
              </button>

              {/* Back to Sign Up */}
              <button
                onClick={() => router.push('/auth/signup')}
                className="text-purple-600 hover:text-purple-700 text-sm underline flex items-center justify-center gap-1 w-full py-2"
              >
                <span>←</span>
                Back to Sign Up
              </button>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>Secure email verification powered by Aboki</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckEmailPage;
