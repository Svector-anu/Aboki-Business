import React, { useState } from "react";
import { useRouter } from "next/router";
import { Button, Input, ToastContainer } from "../ui";
import AuthLayout from "./AuthLayout";
import { useForm } from "../../hooks/useForm";
import { validateSignIn } from "../../utils/validation";
import { useToast } from "../../hooks/useToast";

const AdminLoginForm = () => {
   const router = useRouter();
   const [loading, setLoading] = useState(false);
   const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
   const { toasts, showSuccess, showError, showInfo, hideToast } = useToast();

   // Admin login function
   const adminLogin = async (email, password) => {
      try {
         console.log("Attempting admin login with real API...", { email });

         const response = await fetch('https://aboki-b2b-eobk.onrender.com/api/v1/admin/auth/login', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               email,
               password
            })
         });

         const result = await response.json();
         console.log("Admin API Response:", result);

         if (result.success && result.data) {
            const { admin: adminData, token } = result.data;
            
            // Store admin token and data
            if (typeof window !== "undefined") {
               localStorage.setItem("admin_token", token);
               localStorage.setItem("admin_user", JSON.stringify(adminData));
            }

            return { 
               success: true, 
               admin: adminData,
               token: token
            };
         } else {
            return {
               success: false,
               error: result.message || "Admin login failed. Please try again."
            };
         }
      } catch (error) {
         console.error("Admin login network error:", error);
         return { 
            success: false, 
            error: "Network error. Please check your connection and try again." 
         };
      }
   };

   // Forgot password handler
   const handleForgotPassword = async () => {
      if (!values.email) {
         showError("Please enter your email address first");
         return;
      }

      setForgotPasswordLoading(true);
      
      try {
         const response = await fetch('https://aboki-b2b-eobk.onrender.com/api/v1/admin/auth/forgot-password', {
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
         console.error("Admin forgot password error:", error);
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
         showInfo("Signing you in...", 2000);

         try {
            console.log("Attempting admin login with:", data);

            const result = await adminLogin(data.email, data.password);

            if (result.success) {
               console.log("Admin login successful:", result);
               const adminData = result.admin;

               showSuccess(`Welcome back, ${adminData.name || adminData.fullName || 'Admin'}! 🎉`);

               // Redirect to admin dashboard
               setTimeout(() => {
                  router.push("/admin/dashboard");
               }, 1000);
            } else {
               console.log("Admin login failed:", result.error);

               // Show specific error messages
               if (result.error.includes("Invalid email or password")) {
                  showError("❌ Invalid admin credentials. Please check your email and password.");
               } else if (result.error.includes("User not found")) {
                  showError("❌ Admin account not found with this email address.");
               } else if (result.error.includes("not authorized") || result.error.includes("permission")) {
                  showError("❌ You don't have admin privileges. Please contact support.");
               } else {
                  showError(`❌ Admin login failed: ${result.error}`);
               }

               setError("email", result.error);
            }
         } catch (error) {
            console.error("Admin login error:", error);
            showError("❌ An unexpected error occurred. Please try again.");
            setError("email", "An unexpected error occurred");
         } finally {
            setLoading(false);
         }
      },
   });

   return (
      <>
         <AuthLayout title="Admin Portal" subtitle="Secure admin access to Aboki B2B">
            <div className="space-y-6">
               {/* Admin Welcome Message */}
               <div className="text-center pb-2">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-full mb-4">
                     <span className="text-red-600 text-sm">🔒</span>
                     <span className="text-red-800 text-sm font-medium">Admin Access Required</span>
                  </div>
                  <p className="text-gray-600 text-sm">
                     Secure portal for Aboki B2B administrators. Please sign in with your admin credentials.
                  </p>
               </div>

               <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                     label="Admin Email"
                     name="email"
                     type="email"
                     placeholder="Enter your admin email address"
                     value={values.email}
                     onChange={handleChange}
                     error={errors.email}
                     required
                  />

                  <div>
                     <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                           Admin Password
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 12H9v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-6.586l4.686-4.686a2.828 0 012.828 0L16 8.414a2 2 0 011.414.586L19 11V9a2 2 0 00-2-2h-1z" />
                                 </svg>
                                 <span>Forgot password?</span>
                              </>
                           )}
                        </button>
                     </div>
                     <Input
                        name="password"
                        type="password"
                        placeholder="Enter your admin password"
                        value={values.password}
                        onChange={handleChange}
                        error={errors.password}
                        required
                     />
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
                           Signing in...
                        </div>
                     ) : (
                        <span className="flex items-center justify-center gap-2">
                           <span>🔐 Admin Sign In</span>
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                           </svg>
                        </span>
                     )}
                  </Button>
               </form>

               {/* Additional Actions */}
               <div className="flex flex-col space-y-4">
                  <div className="text-center">
                     <span className="text-gray-600">
                        Need regular user access?{" "}
                     </span>
                     <button
                        type="button"
                        onClick={() => router.push("/auth/signin")}
                        className="text-purple-600 hover:text-purple-700 font-medium transition-colors">
                        User Login
                     </button>
                  </div>

                  {/* Professional Footer */}
                  <div className="pt-6 border-t border-gray-100">
                     <div className="text-center space-y-4">
                        {/* Security Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-full">
                           <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v2H0V8a8 8 0 1118 0z" clipRule="evenodd" />
                           </svg>
                           <span className="text-sm font-medium text-red-800">Admin-Level Security</span>
                        </div>
                        
                        {/* Admin Features */}
                        <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
                           <div className="flex items-center gap-1 group hover:text-red-600 transition-colors cursor-pointer">
                              <span className="text-base">👥</span>
                              <span className="group-hover:font-medium">User Management</span>
                           </div>
                           <div className="w-px h-4 bg-gray-300"></div>
                           <div className="flex items-center gap-1 group hover:text-red-600 transition-colors cursor-pointer">
                              <span className="text-base">📊</span>
                              <span className="group-hover:font-medium">Analytics</span>
                           </div>
                           <div className="w-px h-4 bg-gray-300"></div>
                           <div className="flex items-center gap-1 group hover:text-red-600 transition-colors cursor-pointer">
                              <span className="text-base">🔑</span>
                              <span className="group-hover:font-medium">API Control</span>
                           </div>
                        </div>
                        
                        {/* Company Badge */}
                        <div className="flex items-center justify-center gap-2">
                           <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                           <p className="text-xs text-gray-400 font-medium">
                              Secure Admin Portal • <span className="text-red-600">Aboki B2B</span>
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

export default AdminLoginForm;