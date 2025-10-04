import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../hooks/useAuth";
import Head from "next/head";
import DashboardLayout from "../components/DashboardLayout";
import LoadingScreen from "../components/LoadingScreen";
import PendingVerification from "../components/PendingVerification";
import VerifiedDashboard from "../components/VerifiedDashboard";
import StatsDashboard from "../components/StatsDashboard";

export default function DashboardPage() {
   const router = useRouter();
   const { user, loading } = useAuth();
   const [profileData, setProfileData] = useState(null);
   const [errorResponse, setErrorResponse] = useState(null);
   const [profileLoading, setProfileLoading] = useState(true);

   useEffect(() => {
      if (!loading && !user) {
         router.push("/auth/signin");
      }
   }, [user, loading, router]);

   useEffect(() => {
      const fetchProfile = async () => {
         if (!user) return;
         
         const token = localStorage.getItem('aboki_token');
         
         console.log('=== Dashboard Fetch Debug ===');
         console.log('Token exists:', !!token);
         console.log('Token value:', token ? `${token.substring(0, 20)}...` : 'null');
         
         if (!token) {
            console.log('No token found, redirecting to signin');
            router.push('/auth/signin');
            return;
         }

         try {
            console.log('Making API request...');
            const response = await fetch('https://api.aboki.xyz/api/v1/business/profile', {
               headers: {
                  'accept': 'application/json',
                  'Authorization': `Bearer ${token}`
               }
            });
            
            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);
            
            let data;
            const contentType = response.headers.get("content-type");
            console.log('Content-Type:', contentType);
            
            if (contentType && contentType.includes("application/json")) {
               data = await response.json();
               console.log('Parsed JSON data:', data);
            } else {
               const text = await response.text();
               console.log('Response text:', text);
               data = { 
                  message: 'Server returned non-JSON response',
                  verificationStatus: 'pending',
                  emailVerified: true
               };
            }

            if (response.ok) {
               console.log('Success response, setting profileData');
               setProfileData(data);
               setErrorResponse(null);
            } else if (response.status === 403) {
               console.log('403 Forbidden, setting errorResponse with data:', data);
               setErrorResponse(data);
               setProfileData(null);
            } else if (response.status === 401) {
               console.log('401 Unauthorized, removing token and redirecting');
               localStorage.removeItem('aboki_token');
               localStorage.removeItem('aboki_user');
               router.push('/auth/signin');
               return;
            } else {
               console.log('Other error status, setting errorResponse');
               setErrorResponse(data || {
                  message: 'An error occurred',
                  verificationStatus: 'pending',
                  emailVerified: true
               });
            }
         } catch (error) {
            console.error('Fetch error (catch block):', error);
            console.error('Error type:', error.constructor.name);
            console.error('Error message:', error.message);
            setErrorResponse({
               verificationStatus: 'pending',
               emailVerified: true,
               message: 'Unable to connect to server. Please check your internet connection.'
            });
         } finally {
            console.log('=== End Dashboard Fetch Debug ===');
            setProfileLoading(false);
         }
      };

      if (user) {
         fetchProfile();
      }
   }, [user, router]);

   if (loading || profileLoading) {
      return (
         <>
            <Head>
               <title>Dashboard - Aboki</title>
               <meta name="description" content="Your crypto business dashboard" />
               <meta name="viewport" content="width=device-width, initial-scale=1" />
               <link rel="icon" href="/favicon.ico" />
            </Head>
            <LoadingScreen message="Loading your dashboard" />
         </>
      );
   }

   if (!user) {
      return null;
   }

   const responseData = errorResponse || profileData;
   
   // Check if this is a "no business found" error (user needs to create business)
   const noBusinessFound = 
      errorResponse?.message?.includes('No active business found') ||
      errorResponse?.message?.includes('create a business first');

   // Get user data from localStorage to check approval status
   const storedUser = typeof window !== 'undefined' ? localStorage.getItem('aboki_user') : null;
   const userData = storedUser ? JSON.parse(storedUser) : null;

   // Check verification status from either API response or localStorage
   // Priority: API response first, then localStorage
   const verificationStatus = responseData?.verificationStatus || userData?.verificationStatus || 'pending';
   const isApiEnabled = responseData?.isApiEnabled !== undefined 
      ? responseData.isApiEnabled 
      : (userData?.isApiEnabled || false);
   const emailVerified = responseData?.emailVerified !== undefined
      ? responseData.emailVerified
      : (userData?.isVerified || userData?.isEmailVerified || false);

   // Check if user needs verification (pending approval)
   const needsVerification = 
      !noBusinessFound &&
      errorResponse !== null && 
      verificationStatus === 'pending';

   // Check if user is approved but API not enabled yet (show welcome page)
   const isApprovedButNoApi = 
      verificationStatus === 'approved' && 
      !isApiEnabled;

   // Check if user is fully approved WITH business created - show stats dashboard
   // ONLY show stats if business profile exists (profileData is not null and no 404 error)
   const isFullyApproved = 
      !noBusinessFound &&
      profileData !== null &&
      verificationStatus === 'approved' && 
      isApiEnabled === true;

   // If no business found but user is approved, show business creation form
   const shouldShowBusinessForm = noBusinessFound && verificationStatus === 'approved';

   console.log('=== Dashboard Display Logic ===');
   console.log('noBusinessFound:', noBusinessFound);
   console.log('needsVerification:', needsVerification);
   console.log('isApprovedButNoApi:', isApprovedButNoApi);
   console.log('isFullyApproved:', isFullyApproved);
   console.log('shouldShowBusinessForm:', shouldShowBusinessForm);
   console.log('verificationStatus:', verificationStatus);
   console.log('isApiEnabled:', isApiEnabled);
   console.log('emailVerified:', emailVerified);

   return (
      <>
         <Head>
            <title>Dashboard - Aboki</title>
            <meta name="description" content="Your crypto business dashboard" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
         </Head>

         {/* CASE 1: User approved but no business - Show Business Creation Form */}
         {shouldShowBusinessForm ? (
            <div className="min-h-screen bg-gray-50">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <PendingVerification 
                     profileData={{
                        verificationStatus: verificationStatus,
                        isApiEnabled: isApiEnabled,
                        emailVerified: emailVerified
                     }} 
                     errorResponse={null}
                  />
               </div>
            </div>
         ) : noBusinessFound ? (
            /* CASE 2: No business found and not approved - Show Welcome Page */
            <DashboardLayout>
               <VerifiedDashboard />
            </DashboardLayout>
         ) : needsVerification ? (
            /* CASE 3: User needs verification (email or business pending approval) */
            <div className="min-h-screen bg-gray-50">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <PendingVerification 
                     profileData={profileData} 
                     errorResponse={errorResponse}
                  />
               </div>
            </div>
         ) : isFullyApproved ? (
            /* CASE 4: User is fully approved with business - Show Stats Dashboard */
            <DashboardLayout>
               <StatsDashboard />
            </DashboardLayout>
         ) : isApprovedButNoApi ? (
            /* CASE 5: User is approved but API not enabled - Show Welcome Page */
            <DashboardLayout>
               <VerifiedDashboard />
            </DashboardLayout>
         ) : (
            /* FALLBACK: Show Welcome Page */
            <DashboardLayout>
               <VerifiedDashboard />
            </DashboardLayout>
         )}
      </>
   );
}