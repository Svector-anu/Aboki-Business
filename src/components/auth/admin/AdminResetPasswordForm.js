import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button, Input, ToastContainer } from "../../ui";
import AuthLayout from "../AuthLayout";
import { useForm } from "../../../hooks/useForm";
import { useToast } from "../../../hooks/useToast";

// Validation schema for admin reset password with stronger requirements
const validateAdminResetPassword = (values) => {
  const errors = {};

  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters long";
  } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(values.password)) {
    errors.password = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};

const AdminResetPasswordForm = () => {
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
        setTokenValid(true);
      } else {
        showError("Invalid admin reset link. Please check your email for the correct link.");
        setTimeout(() => {
          router.push("/admin/login");
        }, 3000);
      }
    }
  }, [router.isReady, router.query]);

  const { values, errors, handleChange, handleSubmit, setError } = useForm({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: validateAdminResetPassword,
    onSubmit: async (data) => {
      if (!token) {
        showError("Invalid reset token. Please try again.");
        return;
      }

      setLoading(true);
      showInfo("Resetting your admin password...", 2000);

      try {
        const response = await fetch('https://api.aboki.xyz/api/v1/admin/auth/reset-password', {
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
          showSuccess("Admin password reset successful! You can now sign in with your new password.");
          
          setTimeout(() => {
            router.push("/admin/login");
          }, 2000);
        } else {
          showError(result.message || "Failed to reset admin password. Please try again.");
          setError("password", result.message || "Reset failed");
        }
      } catch (error) {
        console.error("Reset admin password error:", error);
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
      <AuthLayout title="Reset Admin Password">
        <div className="space-y-6">
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <svg className="animate-spin h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Admin Reset Form</h3>
            <p className="text-gray-600">Validating security credentials...</p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <>
      <AuthLayout title="Reset Admin Password">
        <div className="space-y-6">
          {/* Admin Security Header */}
          <div className="text-center pb-2">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-amber-800 text-sm font-medium">Admin Security Reset</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              Create a new secure password for your admin account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Admin Password
              </label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new admin password"
                  value={values.password}
                  onChange={handleChange}
                  error={errors.password}
                  required
                  className="border-red-300 focus:border-red-500 focus:ring-red-500"
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
                Confirm New Admin Password
              </label>
              <div className="relative">
                <Input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new admin password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  required
                  className="border-red-300 focus:border-red-500 focus:ring-red-500"
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

            {/* Enhanced Admin Password Requirements */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-red-800 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-7-4z" clipRule="evenodd" />
                </svg>
                Admin Password Security Requirements:
              </h4>
              <ul className="text-xs text-red-700 space-y-2">
                <li className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${values.password.length >= 8 ? 'bg-green-500' : 'bg-red-300'}`}></div>
                  Minimum 8 characters long
                </li>
                <li className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${/(?=.*[a-z])/.test(values.password) ? 'bg-green-500' : 'bg-red-300'}`}></div>
                  At least one lowercase letter (a-z)
                </li>
                <li className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${/(?=.*[A-Z])/.test(values.password) ? 'bg-green-500' : 'bg-red-300'}`}></div>
                  At least one uppercase letter (A-Z)
                </li>
                <li className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${/(?=.*\d)/.test(values.password) ? 'bg-green-500' : 'bg-red-300'}`}></div>
                  At least one number (0-9)
                </li>
                <li className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${/(?=.*[@$!%*?&])/.test(values.password) ? 'bg-green-500' : 'bg-red-300'}`}></div>
                  At least one special character (@$!%*?&)
                </li>
              </ul>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transform hover:scale-[1.02] transition-all duration-200"
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
                  Resetting Admin Password...
                </div>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-7-4z" clipRule="evenodd" />
                  </svg>
                  <span>Reset Admin Password</span>
                </span>
              )}
            </Button>
          </form>

          {/* Additional Actions */}
          <div className="flex flex-col space-y-4">
            <div className="text-center">
              <span className="text-gray-600">
                Remember your admin password?{" "}
              </span>
              <button
                type="button"
                onClick={() => router.push("/admin/login")}
                className="text-red-600 hover:text-red-700 font-medium transition-colors">
                Admin Sign In
              </button>
            </div>

            {/* Security Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="text-sm">
                  <p className="font-medium text-yellow-800 mb-1">Security Notice</p>
                  <p className="text-yellow-700">
                    This password reset link expires in 10 minutes for security reasons. 
                    All active admin sessions will be terminated after successful reset.
                  </p>
                </div>
              </div>
            </div>

            {/* Professional Footer */}
            <div className="pt-6 border-t border-gray-100">
              <div className="text-center space-y-4">
                {/* Admin Security Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-full">
                  <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-7-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-red-800">Admin Security Reset</span>
                </div>
                
                {/* Company Badge */}
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <p className="text-xs text-gray-400 font-medium">
                    <span className="text-red-600">ABOKI</span> Admin Panel • Enhanced Security Protocol
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

export default AdminResetPasswordForm;