import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../hooks/useAuth";
import Head from "next/head";

export default function HomePage() {
   const router = useRouter();
   const { user, loading } = useAuth();

   useEffect(() => {
      if (!loading) {
         if (user) {
            router.push("/dashboard");
         } else {
            router.push("/auth/signin");
         }
      }
   }, [user, loading, router]);

   if (loading) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600">
            <div className="text-center text-white">
               <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
               <p className="text-lg">Loading...</p>
            </div>
         </div>
      );
   }

   return (
      <>
         <Head>
            <title>Aboki - Empower Your Crypto Business</title>
            <meta
               name="description"
               content="The complete platform for crypto business operations"
            />
            <meta
               name="viewport"
               content="width=device-width, initial-scale=1"
            />
            <link rel="icon" href="/favicon.ico" />
         </Head>
         <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
               <h1 className="text-2xl font-bold text-blue-900">
                  Redirecting...
               </h1>
            </div>
         </div>
      </>
   );
}
