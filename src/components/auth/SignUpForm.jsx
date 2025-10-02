import React, { useState } from "react";
import { useRouter } from "next/router";
import { Button, Input, Checkbox, ToastContainer } from "../ui";
import AuthLayout from "./AuthLayout";
import { useForm } from "../../hooks/useForm";
import { validateSignUp } from "../../utils/validation";
import useSignup from "../../hooks/useSignup"; 
import { useToast } from "../../hooks/useToast";

const SignUpForm = () => {
   const router = useRouter();
   const { signup, loading } = useSignup(); 
   const { toasts, showSuccess, showError, showInfo, showWarning, hideToast } =
      useToast();

   const { values, errors, handleChange, handleSubmit, setError, resetForm } =
      useForm({
         initialValues: {
            businessName: "",
            firstName: "",
            lastName: "",
            phoneNumber: "",
            email: "",
            password: "",
            agreeToTerms: false,
         },
         validationSchema: validateSignUp,
         onSubmit: async (data) => {
            // Show loading toast
            showInfo("Creating your account...", 3000);

            try {
               console.log("Attempting registration with:", data);

               const result = await signup(data);

               if (result.success) {
                  console.log("Registration successful");

                  // Store email for verification page
                  if (typeof window !== 'undefined') {
                     localStorage.setItem('pending_verification_email', data.email);
                  }

                  // Show success toast
                  showSuccess(
                     `🎉 Welcome to Aboki, ${data.firstName}! Your account has been created successfully.`,
                     4000
                  );

                  resetForm();

                  // Show redirect info
                  setTimeout(() => {
                     showInfo("Redirecting to email verification...", 2000);
                  }, 1500);

                  // Redirect to check email page instead of sign-in
                  setTimeout(() => {
                     router.push(`/auth/check-email?email=${encodeURIComponent(data.email)}`);
                  }, 3000);

               } else {
                  console.log("Registration failed:", result.error);

                  // Show specific error messages
                  if (result.error.includes("already exists")) {
                     showError(
                        "❌ An account with this email already exists. Please try signing in instead."
                     );
                  } else if (result.error.includes("email")) {
                     showError("❌ Please provide a valid email address.");
                  } else if (result.error.includes("password")) {
                     showError("❌ Password does not meet the requirements.");
                  } else {
                     showError(`❌ Registration failed: ${result.error}`);
                  }

                  // Set form error for field highlighting
                  setError("email", result.error);
               }
            } catch (error) {
               console.error("Registration error:", error);
               showError(
                  "❌ An unexpected error occurred during registration. Please try again."
               );
               setError(
                  "email",
                  "An unexpected error occurred during registration"
               );
            }
         },
      });

   // Show password requirements info
   const showPasswordInfo = () => {
      showInfo(
         `Password Requirements:
         • At least 8 characters long
         • Contains uppercase letter
         • Contains lowercase letter  
         • Contains at least one number`,
         6000
      );
   };

   return (
      <>
         <AuthLayout
            title="Create Account"
            subtitle="Join thousands of businesses using Aboki for crypto payments">
            
            {/* Welcome Message */}
            <div className="text-center pb-4">
               <p className="text-gray-600 text-sm">
                  Start accepting crypto payments and converting to Nigerian Naira seamlessly
               </p>
            </div>

            <div className="space-y-6">
               <Input
                  label="Business name"
                  name="businessName"
                  placeholder="Enter your business name"
                  value={values.businessName}
                  onChange={handleChange}
                  error={errors.businessName}
                  required
               />

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                     label="First name"
                     name="firstName"
                     placeholder="First name"
                     value={values.firstName}
                     onChange={handleChange}
                     error={errors.firstName}
                     required
                  />

                  <Input
                     label="Last name"
                     name="lastName"
                     placeholder="Last name"
                     value={values.lastName}
                     onChange={handleChange}
                     error={errors.lastName}
                     required
                  />
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     Phone number
                  </label>
                  <div className="flex">
                     <select className="px-3 py-3 border border-gray-300 rounded-l-lg bg-gray-50 text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors">
                        <option>+234</option>
                        <option>+1</option>
                        <option>+44</option>
                        <option>+91</option>
                        <option>+86</option>
                     </select>
                     <input
                        type="tel"
                        name="phoneNumber"
                        placeholder="Phone number"
                        value={values.phoneNumber}
                        onChange={handleChange}
                        className="flex-1 px-4 py-3 border border-l-0 border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                     />
                  </div>
                  {errors.phoneNumber && (
                     <p className="mt-2 text-sm text-red-600">
                        {errors.phoneNumber}
                     </p>
                  )}
               </div>

               <Input
                  label="Email address"
                  name="email"
                  type="email"
                  placeholder="Enter your business email address"
                  value={values.email}
                  onChange={handleChange}
                  error={errors.email}
                  required
               />

               <div>
                  <div className="flex items-center justify-between mb-2">
                     <label className="block text-sm font-medium text-gray-700">
                        Password *
                     </label>
                     <button
                        type="button"
                        onClick={showPasswordInfo}
                        className="text-sm text-purple-600 hover:text-purple-700 transition-colors">
                        ℹ️ Requirements
                     </button>
                  </div>
                  <Input
                     name="password"
                     type="password"
                     placeholder="Create a strong password"
                     value={values.password}
                     onChange={handleChange}
                     error={errors.password}
                     required
                  />
               </div>

               <Checkbox
                  label={
                     <span>
                        I certify that I am 18 years of age or older, I agree to
                        the{" "}
                        <button
                           type="button"
                           onClick={() =>
                              showInfo(
                                 "Terms of Service: By using Aboki B2B, you agree to our terms of service and privacy policy. Full terms available on our website."
                              )
                           }
                           className="text-purple-600 hover:text-purple-700 underline transition-colors">
                           Terms of Service
                        </button>
                        , and I have read the{" "}
                        <button
                           type="button"
                           onClick={() =>
                              showInfo(
                                 "Privacy Policy: We protect your data with enterprise-grade security. We never share your information with third parties."
                              )
                           }
                           className="text-purple-600 hover:text-purple-700 underline transition-colors">
                           Privacy Policy
                        </button>
                        .
                     </span>
                  }
                  checked={values.agreeToTerms}
                  onChange={handleChange}
                  name="agreeToTerms"
                  error={errors.agreeToTerms}
                  required
               />

               <Button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 transform hover:scale-[1.02] transition-all duration-200"
                  loading={loading}
                  disabled={!values.agreeToTerms || loading}>
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
                        Creating account...
                     </div>
                  ) : (
                     <span className="flex items-center justify-center gap-2">
                        <span>Create Account</span>
                        <span>→</span>
                     </span>
                  )}
               </Button>

               <div className="text-center">
                  <span className="text-gray-600">
                     Already have an account?{" "}
                  </span>
                  <button
                     type="button"
                     onClick={() => router.push("/auth/signin")}
                     className="text-purple-600 hover:text-purple-700 font-medium transition-colors">
                     Sign in
                  </button>
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

export default SignUpForm;