import "../styles/globals.css";
import { AuthProvider } from "../hooks/useAuth";
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
   useEffect(() => {
      // Initialize Farcaster SDK when app mounts
      const initFarcaster = async () => {
         try {
            // Dynamically import SDK to avoid SSR issues
            const { sdk } = await import('@farcaster/miniapp-sdk');
            
            // Signal that app is ready to display
            await sdk.actions.ready();
            console.log('Farcaster SDK initialized');
         } catch (error) {
            // Not running in Farcaster - app works normally
            console.log('Not running in Farcaster context');
         }
      };

      initFarcaster();
   }, []);

   return (
      <AuthProvider>
         <Component {...pageProps} />
      </AuthProvider>
   );
}

export default MyApp;