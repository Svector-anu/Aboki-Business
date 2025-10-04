import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function PendingVerification({ profileData, errorResponse }) {
   const router = useRouter();
   const [loading, setLoading] = useState(false);
   const [businessData, setBusinessData] = useState({
      businessName: '',
      businessType: 'LLC',
      description: '',
      industry: 'Technology',
      country: 'Nigeria',
      registrationNumber: '',
      taxId: '',
      website: '',
      phoneNumber: '',
      address: {
         street: '',
         city: '',
         state: '',
         zipCode: '',
         country: 'Nigeria'
      },
      logo: ''
   });

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      if (name.includes('.')) {
         const [parent, child] = name.split('.');
         setBusinessData(prev => ({
            ...prev,
            [parent]: {
               ...prev[parent],
               [child]: value
            }
         }));
      } else {
         setBusinessData(prev => ({
            ...prev,
            [name]: value
         }));
      }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
         const token = localStorage.getItem('aboki_token');
         
         // First, check if business profile already exists
         const checkResponse = await fetch('https://api.aboki.xyz/api/v1/business/profile', {
            method: 'GET',
            headers: {
               'accept': 'application/json',
               'Authorization': `Bearer ${token}`
            }
         });

         const checkResult = await checkResponse.json();

         // If profile already exists and API is enabled, redirect to dashboard
         if (checkResponse.ok && checkResult.success && checkResult.data) {
            console.log('Business profile already exists:', checkResult.data);
            alert('Business profile already exists! Redirecting to dashboard...');
            router.push('/dashboard');
            return;
         }

         // If no profile exists, create new one
         const response = await fetch('https://api.aboki.xyz/api/v1/business/create', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(businessData)
         });

         const result = await response.json();

         if (result.success) {
            alert('Business profile created successfully! Redirecting to dashboard...');
            router.push('/dashboard');
         } else {
            alert(result.message || 'Failed to create business profile');
         }
      } catch (error) {
         console.error('Error creating business:', error);
         alert('Error creating business profile. Please try again.');
      } finally {
         setLoading(false);
      }
   };

   // Use errorResponse if available (from 403), otherwise use profileData
   const responseData = errorResponse || profileData;
   
   // Console log to debug
   console.log('=== PendingVerification Debug ===');
   console.log('profileData:', profileData);
   console.log('errorResponse:', errorResponse);
   console.log('responseData:', responseData);
   
   const verificationStatus = responseData?.verificationStatus;
   const isApiEnabled = responseData?.isApiEnabled;
   const emailVerified = responseData?.emailVerified;

   console.log('verificationStatus:', verificationStatus);
   console.log('isApiEnabled:', isApiEnabled);
   console.log('emailVerified:', emailVerified);

   // Show business creation form if approved but API not enabled
   const shouldShowBusinessForm = verificationStatus === 'approved' && emailVerified;

   // Show pending verification if status is pending
   const shouldShowPendingPage = verificationStatus === 'pending' && emailVerified;

   console.log('shouldShowBusinessForm:', shouldShowBusinessForm);
   console.log('shouldShowPendingPage:', shouldShowPendingPage);
   console.log('=== End Debug ===');

   if (shouldShowBusinessForm) {
      return (
         <div className="mt-12">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
               <div className="mb-6">
                  <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
                     <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                     </svg>
                     Account Approved
                  </div>

                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                     Create Your Business Profile
                  </h1>

                  <p className="text-lg text-gray-600 mb-6">
                     Your account has been approved! Complete your business profile to access API features and start trading.
                  </p>
               </div>

               <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Business Name */}
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Name *
                     </label>
                     <input
                        type="text"
                        name="businessName"
                        required
                        value={businessData.businessName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Tech Innovations LLC"
                     />
                  </div>

                  {/* Business Type & Industry */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                           Business Type *
                        </label>
                        <select
                           name="businessType"
                           required
                           value={businessData.businessType}
                           onChange={handleInputChange}
                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                           <option value="LLC">LLC</option>
                           <option value="Corporation">Corporation</option>
                           <option value="Sole Proprietorship">Sole Proprietorship</option>
                           <option value="Partnership">Partnership</option>
                        </select>
                     </div>

                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                           Industry *
                        </label>
                        <select
                           name="industry"
                           required
                           value={businessData.industry}
                           onChange={handleInputChange}
                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                           <option value="Technology">Technology</option>
                           <option value="Finance">Finance</option>
                           <option value="Retail">Retail</option>
                           <option value="Healthcare">Healthcare</option>
                           <option value="Education">Education</option>
                           <option value="Other">Other</option>
                        </select>
                     </div>
                  </div>

                  {/* Description */}
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Description *
                     </label>
                     <textarea
                        name="description"
                        required
                        value={businessData.description}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Innovative technology solutions for modern businesses"
                     />
                  </div>

                  {/* Registration Number & Tax ID */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                           Registration Number *
                        </label>
                        <input
                           type="text"
                           name="registrationNumber"
                           required
                           value={businessData.registrationNumber}
                           onChange={handleInputChange}
                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                           placeholder="REG123456789"
                        />
                     </div>

                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                           Tax ID *
                        </label>
                        <input
                           type="text"
                           name="taxId"
                           required
                           value={businessData.taxId}
                           onChange={handleInputChange}
                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                           placeholder="TAX987654321"
                        />
                     </div>
                  </div>

                  {/* Website & Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                           Website
                        </label>
                        <input
                           type="url"
                           name="website"
                           value={businessData.website}
                           onChange={handleInputChange}
                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                           placeholder="https://techinnovations.com"
                        />
                     </div>

                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                           Phone Number *
                        </label>
                        <input
                           type="tel"
                           name="phoneNumber"
                           required
                           value={businessData.phoneNumber}
                           onChange={handleInputChange}
                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                           placeholder="+234-555-123-4567"
                        />
                     </div>
                  </div>

                  {/* Address Section */}
                  <div className="border-t border-gray-200 pt-6">
                     <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Address</h3>
                     
                     <div className="space-y-4">
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">
                              Street Address *
                           </label>
                           <input
                              type="text"
                              name="address.street"
                              required
                              value={businessData.address.street}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="123 Tech Street"
                           />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                 City *
                              </label>
                              <input
                                 type="text"
                                 name="address.city"
                                 required
                                 value={businessData.address.city}
                                 onChange={handleInputChange}
                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                 placeholder="Lagos"
                              />
                           </div>

                           <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                 State *
                              </label>
                              <input
                                 type="text"
                                 name="address.state"
                                 required
                                 value={businessData.address.state}
                                 onChange={handleInputChange}
                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                 placeholder="Lagos State"
                              />
                           </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                 Zip Code *
                              </label>
                              <input
                                 type="text"
                                 name="address.zipCode"
                                 required
                                 value={businessData.address.zipCode}
                                 onChange={handleInputChange}
                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                 placeholder="100001"
                              />
                           </div>

                           <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                 Country *
                              </label>
                              <input
                                 type="text"
                                 name="address.country"
                                 required
                                 value={businessData.address.country}
                                 onChange={handleInputChange}
                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                 placeholder="Nigeria"
                              />
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Logo URL (Optional) */}
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                        Logo URL (Optional)
                     </label>
                     <input
                        type="url"
                        name="logo"
                        value={businessData.logo}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="https://example.com/logo.png"
                     />
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4">
                     <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                        {loading ? (
                           <span className="flex items-center justify-center">
                              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Creating Business Profile...
                           </span>
                        ) : (
                           'Create Business Profile'
                        )}
                     </button>
                  </div>
               </form>
            </div>
         </div>
      );
   }

   // Show pending verification page
   if (shouldShowPendingPage) {
      return (
         <div className="mt-12">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
               <div className="grid md:grid-cols-2 gap-0">
                  {/* Left Content */}
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                     <div className="mb-6">
                        <div className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-4">
                           <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                 fillRule="evenodd"
                                 d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                 clipRule="evenodd"
                              />
                           </svg>
                           Pending Verification
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Almost There!</h1>

                        <p className="text-lg text-gray-600 mb-6">
                           {responseData?.message ||
                              'Your account is pending admin approval. Please wait for admin verification before creating a business.'}
                        </p>
                     </div>

                     <div className="space-y-4 mb-8">
                        <div className="flex items-start">
                           <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                 <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                 />
                              </svg>
                           </div>
                           <div className="ml-3">
                              <p className="text-gray-700 font-medium">Email Verified</p>
                              <p className="text-sm text-gray-500">Your email has been confirmed</p>
                           </div>
                        </div>

                        <div className="flex items-start">
                           <div className="flex-shrink-0 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center mt-1">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                 <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                    clipRule="evenodd"
                                 />
                              </svg>
                           </div>
                           <div className="ml-3">
                              <p className="text-gray-700 font-medium">Admin Verification</p>
                              <p className="text-sm text-gray-500">Typically takes 1-2 business days</p>
                           </div>
                        </div>

                        <div className="flex items-start opacity-50">
                           <div className="flex-shrink-0 w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center mt-1">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                 <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                 />
                              </svg>
                           </div>
                           <div className="ml-3">
                              <p className="text-gray-700 font-medium">Start Trading</p>
                              <p className="text-sm text-gray-500">Available after verification</p>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-3">
                        <a
                           href="https://calendly.com/aboki-support"
                           target="_blank"
                           rel="noopener noreferrer"
                           className="block w-full bg-purple-600 hover:bg-purple-700 text-white text-center px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                           Schedule Call with Admin
                        </a>

                        <p className="text-sm text-gray-500 text-center">
                           Need help?{' '}
                           <a
                              href="mailto:support@aboki.xyz"
                              className="text-purple-600 hover:text-purple-700 font-medium"
                           >
                              Contact Support
                           </a>
                        </p>
                     </div>
                  </div>

                  {/* Right Image */}
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 md:p-12 flex items-center justify-center">
                     <div className="relative w-full max-w-md h-96">
                        <Image
                           src="/money.svg"
                           alt="Crypto coins illustration"
                           fill
                           className="object-contain drop-shadow-2xl"
                           priority
                        />
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-600 rounded-full opacity-10 animate-pulse"></div>
                        <div
                           className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-400 rounded-full opacity-10 animate-pulse"
                           style={{ animationDelay: '1s' }}
                        ></div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Info Box */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
               <div className="flex">
                  <div className="flex-shrink-0">
                     <svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path
                           fillRule="evenodd"
                           d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                           clipRule="evenodd"
                        />
                     </svg>
                  </div>
                  <div className="ml-3">
                     <h3 className="text-sm font-medium text-blue-800">What happens next?</h3>
                     <div className="mt-2 text-sm text-blue-700">
                        <p>Our admin team is reviewing your account. Once approved, you will be able to:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                           <li>Create and manage your business profile</li>
                           <li>Access API features</li>
                           <li>Start trading cryptocurrency</li>
                        </ul>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      );
   }

   // Fallback for other states (e.g., email not verified, API not enabled, etc.)
   return (
      <div className="mt-12">
         <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
               {/* Left Content */}
               <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="mb-6">
                     <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-4">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                           <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Welcome
                     </div>

                     <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Welcome to Aboki!
                     </h1>

                     <p className="text-lg text-gray-600 mb-6">
                        Schedule a call with our team to get the necessary support to get started with your crypto business operations.
                     </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                     <div className="flex">
                        <div className="flex-shrink-0">
                           <svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                           </svg>
                        </div>
                        <div className="ml-3">
                           <h3 className="text-sm font-medium text-blue-800">What Our Team Will Help You With:</h3>
                           <div className="mt-2 text-sm text-blue-700">
                              <ul className="list-disc list-inside space-y-1">
                                 <li>Complete your business profile setup</li>
                                 <li>Enable API access for trading</li>
                                 <li>Get started with cryptocurrency operations</li>
                                 <li>Answer any questions you may have</li>
                              </ul>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-3">
                     <a
                        href="https://calendly.com/aboki-support"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-purple-600 hover:bg-purple-700 text-white text-center px-6 py-3 rounded-lg font-medium transition-colors"
                     >
                        Schedule Call with Our Team
                     </a>

                     <p className="text-sm text-gray-500 text-center">
                        Need immediate help?{' '}
                        <a
                           href="mailto:support@aboki.xyz"
                           className="text-purple-600 hover:text-purple-700 font-medium"
                        >
                           Email Support
                        </a>
                     </p>
                  </div>
               </div>

               {/* Right Image */}
               <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 md:p-12 flex items-center justify-center">
                  <div className="relative w-full max-w-md h-96">
                     <Image
                        src="/money.svg"
                        alt="Crypto coins illustration"
                        fill
                        className="object-contain drop-shadow-2xl"
                        priority
                     />
                     <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-600 rounded-full opacity-10 animate-pulse"></div>
                     <div
                        className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-400 rounded-full opacity-10 animate-pulse"
                        style={{ animationDelay: '1s' }}
                     ></div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}