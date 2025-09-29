import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button, Input, ToastContainer } from "../ui";
import AuthLayout from "./AuthLayout";
import { useForm } from "../../hooks/useForm";
import { useToast } from "../../hooks/useToast";

// Validation schema for reset password
const validateResetPassword = (values) => {
  const errors = {};

  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters long";
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(values.password)) {
    errors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};

const ResetPasswordForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [tokenValid, setTokenValid] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toasts, showSuccess, showError, showInfo, hideToast } = useToast();

  // Extract token from URL on component mount
  useEffect(() => {
    if (router.isReady) {
      const { token: urlToken } = router.query;
      if (urlToken) {
        setToken(urlToken);
        setTokenValid(true); // Skip validation, go straight to form
      } else {
        showError("Invalid reset link. Please check your email for the correct link.");
        setTimeout(() => {
          router.push("/auth/signin");
        }, 3000);
      }
    }
  }, [router.isReady, router.query]);

  const { values, errors, handleChange, handleSubmit, setError } = useForm({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: validateResetPassword,
    onSubmit: async (data) => {
      if (!token) {
        showError("Invalid reset token. Please try again.");
        return;
      }

      setLoading(true);
      showInfo("Resetting your password...", 2000);

      try {
        const response = await fetch('https://api.aboki.xyz/api/v1/auth/reset-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: token,
            newPassword: data.password
          })
        });

        const result = await response.json();
        
        if (result.success) {
          showSuccess("🎉 Password reset successful! You can now sign in with your new password.");
          
          setTimeout(() => {
            router.push("/auth/signin");
          }, 2000);
        } else {
          showError(result.message || "Failed to reset password. Please try again.");
          setError("password", result.message || "Reset failed");
        }
      } catch (error) {
        console.error("Reset password error:", error);
        showError("Network error. Please check your connection and try again.");
        setError("password", "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    },
  });

  // Show loading state while token is being extracted
  if (tokenValid === null) {
    return (
      <AuthLayout title="Reset Password">
        <div className="space-y-6">
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <svg className="animate-spin h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Reset Form</h3>
            <p className="text-gray-600">Please wait...</p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <>
      <AuthLayout title="Reset Your Password">
        <div className="space-y-6">
          {/* Welcome Message */}
          <div className="text-center pb-2">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p className="text-gray-600 text-sm">
              Create a new strong password for your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  value={values.password}
                  onChange={handleChange}
                  error={errors.password}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <Input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${values.password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  At least 8 characters long
                </li>
                <li className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${/(?=.*[a-z])/.test(values.password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  One lowercase letter
                </li>
                <li className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${/(?=.*[A-Z])/.test(values.password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  One uppercase letter
                </li>
                <li className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${/(?=.*\d)/.test(values.password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  One number
                </li>
              </ul>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 transform hover:scale-[1.02] transition-all duration-200"
              loading={loading}
              disabled={loading}>
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Resetting Password...
                </div>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>Reset Password</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              )}
            </Button>
          </form>

          {/* Additional Actions */}
          <div className="flex flex-col space-y-4">
            <div className="text-center">
              <span className="text-gray-600">
                Remember your password?{" "}
              </span>
              <button
                type="button"
                onClick={() => router.push("/auth/signin")}
                className="text-purple-600 hover:text-purple-700 font-medium transition-colors">
                Sign in instead
              </button>
            </div>

            {/* Professional Footer */}
            <div className="pt-6 border-t border-gray-100">
              <div className="text-center space-y-4">
                {/* Security Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-full">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-green-800">Secure Password Reset</span>
                </div>
                
                {/* Company Badge */}
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-xs text-gray-400 font-medium">
                    Powered by <span className="text-purple-600">Aboki</span> • Your security is our priority
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AuthLayout>

      {/* Toast Container */}
      <ToastContainer
        toasts={toasts}
        onHideToast={hideToast}
        position="top-right"
      />
    </>
  );
};

export default ResetPasswordForm;