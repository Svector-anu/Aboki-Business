import React, { useState } from 'react';
import { useRouter } from 'next/router';

const PendingApprovalPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCheckStatus = () => {
    setLoading(true);
    
    // Simulate checking status
    setTimeout(() => {
      setLoading(false);
      alert('Your account is still under review. You will receive an email when approved.');
    }, 2000);
  };

  const handleLogout = () => {
    // Clear any stored tokens
    if (typeof window !== 'undefined') {
      localStorage.removeItem('aboki_token');
      localStorage.removeItem('aboki_user');
    }
    router.push('/auth/signin');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Aboki B2B</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <span className="text-sm">← Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Status Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">⏰</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Account Under Review
            </h1>
            <p className="text-gray-600">
              Your account is being reviewed by our admin team for API access
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-green-600 text-xl">✅</span>
                <span className="text-sm font-medium text-gray-900">Account Created</span>
              </div>
              <div className="flex-1 mx-4 h-0.5 bg-green-200"></div>
              
              <div className="flex items-center gap-2">
                <span className="text-green-600 text-xl">✅</span>
                <span className="text-sm font-medium text-gray-900">Email Verified</span>
              </div>
              <div className="flex-1 mx-4 h-0.5 bg-amber-200"></div>
              
              <div className="flex items-center gap-2">
                <span className="text-amber-600 text-xl">⏳</span>
                <span className="text-sm font-medium text-amber-600">Admin Review</span>
              </div>
              <div className="flex-1 mx-4 h-0.5 bg-gray-200"></div>
              
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-xl">⭕</span>
                <span className="text-sm text-gray-500">API Access</span>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span>👤</span>
                Account Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-green-600">Email Verified ✅</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">API Access:</span>
                  <span className="font-medium text-amber-600">Pending Review ⏳</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Review Time:</span>
                  <span className="font-medium">1-2 business days</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 rounded-lg p-4">
              <h3 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                <span>⏰</span>
                Review Status
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-amber-700">Current Stage:</span>
                  <span className="font-medium text-amber-900">Admin Review</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700">Next Step:</span>
                  <span className="font-medium text-amber-900">Approval Decision</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700">Notification:</span>
                  <span className="font-medium text-amber-900">Via Email</span>
                </div>
              </div>
            </div>
          </div>

          {/* Information Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">🏦</div>
              <h4 className="font-semibold text-blue-900 text-sm mb-1">Multi-Chain Support</h4>
              <p className="text-blue-700 text-xs">Base, Solana & Ethereum networks</p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <span className="text-2xl mb-2 block">🇳🇬</span>
              <h4 className="font-semibold text-green-900 text-sm mb-1">Nigerian Banking</h4>
              <p className="text-green-700 text-xs">Direct NGN bank transfers</p>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
              <span className="text-2xl mb-2 block">⚡</span>
              <h4 className="font-semibold text-purple-900 text-sm mb-1">Real-time Processing</h4>
              <p className="text-purple-700 text-xs">Instant crypto conversions</p>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <span>📧</span>
              What Happens Next?
            </h3>
            <div className="text-blue-800 text-sm space-y-2">
              <p>• Our admin team will review your account within 1-2 business days</p>
              <p>• You'll receive an email notification once your account is approved</p>
              <p>• After approval, you'll have full access to our API and dashboard</p>
              <p>• You can then start processing crypto payments for your business</p>
            </div>
          </div>

          {/* Current Features Available */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
              <span>✅</span>
              What You Can Do Now:
            </h3>
            <div className="text-green-800 text-sm space-y-2">
              <p>• ✅ Your email is verified and account is secure</p>
              <p>• ✅ You can sign in and access this status page</p>
              <p>• ✅ Read our API documentation to prepare for integration</p>
              <p>• ✅ Contact support if you have any questions</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleCheckStatus}
              disabled={loading}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin">🔄</span>
                  Checking...
                </>
              ) : (
                <>
                  <span>🔄</span>
                  Check Status
                </>
              )}
            </button>
            
            <button
              onClick={() => router.push('/auth/signin')}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg transition-colors"
            >
              Back to Sign In
            </button>
          </div>
        </div>

        {/* Support Contact */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm mb-2">
            Need help? Contact our support team
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span>📧</span>
              support@aboki.com
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span>📞</span>
              +234 (0) 123 456 7890
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingApprovalPage;