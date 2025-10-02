import React, { useState } from "react";
import { useRouter } from "next/router";
import { Button, Input, ToastContainer } from "../ui";
import AuthLayout from "./AuthLayout";
import { useForm } from "../../hooks/useForm";
import { validateSignIn } from "../../utils/validation";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";

const SignInForm = () => {
   const router = useRouter();
   const [loading, setLoading] = useState(false);
   const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
   const { login } = useAuth();
   const { toasts, showSuccess, showError, showInfo, hideToast } = useToast();

   // Forgot password handler
   const handleForgotPassword = async () => {
      if (!values.email) {
         showError("Please enter your email address first");
         return;
      }

      setForgotPasswordLoading(true);
      
      try {
         const response = await fetch('https://api.aboki.xyz/api/v1/auth/forgot-password', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: values.email })
         });

         const result = await response.json();
         
         if (result.success) {
            showSuccess("Password reset instructions sent to your email! Please check your inbox and spam folder.");
         } else {
            showError(result.message || "Failed to send reset email. Please try again.");
         }
      } catch (error) {
         console.error("Forgot password error:", error);
         showError("Network error. Please check your connection and try again.");
      } finally {
         setForgotPasswordLoading(false);
      }
   };

   const { values, errors, handleChange, handleSubmit, setError } = useForm({
      initialValues: {
         email: "",
         password: "",
      },
      validationSchema: validateSignIn,
      onSubmit: async (data) => {
         setLoading(true);

         // Show loading toast
         const loadingToastId = showInfo("Signing you in...", 2000);

         try {
            console.log("Attempting login with:", data);

            const result = await login(data.email, data.password);

            if (result.success) {
               console.log("Login successful:", result);
               const userData = result.user;

               // Show success toast
               showSuccess(`Welcome back, ${userData.fullName || userData.firstName}! 🎉`);

               // Smart routing based on user status
               setTimeout(() => {
                  if (!userData.isEmailVerified) {
                     // User hasn't verified email yet
                     showInfo("Please verify your email address to continue.");
                     router.push(`/auth/check-email?email=${encodeURIComponent(userData.email)}`);
                  } else if (userData.role === 'admin' || userData.role === 'super_admin') {
                     // Admin users go to admin dashboard
                     router.push("/admin/dashboard");
                  } else {
                     // Email verified users go to main dashboard
                     // (API access status will be shown inside the dashboard)
                     router.push("/dashboard");
                  }
               }, 1000);
            } else {
               console.log("Login failed:", result.error);

               // Show specific error messages
               if (result.error.includes("not verified") || result.error.includes("verify")) {
                  showError("❌ Please verify your email address before signing in.");
                  setTimeout(() => {
                     router.push(`/auth/check-email?email=${encodeURIComponent(values.email)}`);
                  }, 2000);
               } else if (result.error.includes("Invalid email or password")) {
                  showError(
                     "❌ Invalid email or password. Please check your credentials."
                  );
               } else if (result.error.includes("User not found")) {
                  showError("❌ No account found with this email address.");
               } else if (result.error.includes("password")) {
                  showError("❌ Incorrect password. Please try again.");
               } else if (result.error.includes("pending") || result.error.includes("approval")) {
                  showError("❌ Your account is pending admin approval.");
                  setTimeout(() => {
                     router.push("/auth/pending-approval");
                  }, 2000);
               } else {
                  showError(`❌ Login failed: ${result.error}`);
               }

               // Also set form error for field highlighting
               setError("email", result.error);
            }
         } catch (error) {
            console.error("Login error:", error);
            showError("❌ An unexpected error occurred. Please try again.");
            setError("email", "An unexpected error occurred");
         } finally {
            setLoading(false);
         }
      },
   });

   return (
      <>
         <AuthLayout title="Sign in to your account">
            <div className="space-y-6">
               {/* Welcome Message */}
               <div className="text-center pb-2">
                  <p className="text-gray-600 text-sm">
                     Welcome back! Please sign in to access your crypto business dashboard.
                  </p>
               </div>

               <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                     label="Email address"
                     name="email"
                     type="email"
                     placeholder="Enter your email address"
                     value={values.email}
                     onChange={handleChange}
                     error={errors.email}
                     required
                  />

                  <div>
                     <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                           Password
                        </label>
                        <button
                           type="button"
                           onClick={handleForgotPassword}
                           disabled={forgotPasswordLoading}
                           className="text-sm text-purple-600 hover:text-purple-700 transition-all duration-200 disabled:opacity-50 flex items-center gap-1 hover:gap-2">
                           {forgotPasswordLoading ? (
                              <>
                                 <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                 </svg>
                                 <span>Sending...</span>
                              </>
                           ) : (
                              <>
                                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                 </svg>
                                 <span>Forgot password?</span>
                              </>
                           )}
                        </button>
                     </div>
                     <Input
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        value={values.password}
                        onChange={handleChange}
                        error={errors.password}
                        required
                     />
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
                           Signing in...
                        </div>
                     ) : (
                        <span className="flex items-center justify-center gap-2">
                           <span>Sign in</span>
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                           </svg>
                        </span>
                     )}
                  </Button>
               </form>

               {/* Additional Actions */}
               <div className="flex flex-col space-y-4">
                  <div className="text-center">
                     <span className="text-gray-600">
                        Don't have an account?{" "}
                     </span>
                     <button
                        type="button"
                        onClick={() => router.push("/auth/signup")}
                        className="text-purple-600 hover:text-purple-700 font-medium transition-colors">
                        Sign up
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
                           <span className="text-sm font-medium text-green-800">Bank-Grade Security</span>
                        </div>
                        
                        {/* Feature Icons */}
                        <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
                           <div className="flex items-center gap-1 group hover:text-purple-600 transition-colors cursor-pointer">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                              </svg>
                              <span className="group-hover:font-medium">Multi-Chain</span>
                           </div>
                           <div className="w-px h-4 bg-gray-300"></div>
                           <div className="flex items-center gap-1 group hover:text-purple-600 transition-colors cursor-pointer">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="group-hover:font-medium">Global Banking</span>
                           </div>
                           <div className="w-px h-4 bg-gray-300"></div>
                           <div className="flex items-center gap-1 group hover:text-purple-600 transition-colors cursor-pointer">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              <span className="group-hover:font-medium">Real-time</span>
                           </div>
                        </div>
                        
                        {/* Company Badge */}
                        <div className="flex items-center justify-center gap-2">
                           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                           <p className="text-xs text-gray-400 font-medium">
                              Powered by <span className="text-purple-600">Aboki</span> • Trusted by 1000+ businesses
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

export default SignInForm;