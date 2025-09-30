import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../hooks/useAuth";
import Head from "next/head";
import DashboardLayout from "../components/DashboardLayout";
import LoadingScreen from "../components/LoadingScreen";
import PendingVerification from "../components/PendingVerification";
import VerifiedDashboard from "../components/VerifiedDashboard";

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
   const needsVerification = 
      errorResponse !== null || 
      responseData?.verificationStatus === 'pending' ||
      (responseData?.verificationStatus === 'approved' && !responseData?.isApiEnabled);

   return (
      <>
         <Head>
            <title>Dashboard - Aboki</title>
            <meta name="description" content="Your crypto business dashboard" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
         </Head>

         {needsVerification ? (
            <div className="min-h-screen bg-gray-50">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <PendingVerification 
                     profileData={profileData} 
                     errorResponse={errorResponse}
                  />
               </div>
            </div>
         ) : (
            <DashboardLayout>
               <VerifiedDashboard />
            </DashboardLayout>
         )}
      </>
   );
}