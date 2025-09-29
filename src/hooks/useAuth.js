// src/hooks/useAuth.js
import {
   useState,
   useEffect,
   useContext,
   createContext,
   useCallback,
} from "react";
import { useRouter } from "next/router";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);

   // Real API login function
   const login = async (email, password) => {
      try {
         setLoading(true);

         console.log("Attempting login with real API...", { email });

         // Call real Aboki B2B API - PRODUCTION URL
         const response = await fetch('https://api.aboki.xyz/api/v1/auth/login', {
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
         
         console.log("API Response:", result);

         if (result.success && result.data) {
            const { user: userData, token } = result.data;
            
            // Check user verification and approval status
            const userStatus = {
               isEmailVerified: userData.isVerified || userData.emailVerified || false,
               isAdminApproved: userData.isApproved || userData.adminApproved || false,
               hasApiAccess: userData.hasApiAccess || userData.apiAccess || false
            };

            // Set user in state
            setUser({ ...userData, ...userStatus });

            // Store token and user in localStorage (browser only)
            if (typeof window !== "undefined") {
               localStorage.setItem("aboki_token", token);
               localStorage.setItem("aboki_user", JSON.stringify({ ...userData, ...userStatus }));
            }

            return { 
               success: true, 
               user: { ...userData, ...userStatus },
               token: token
            };
         } else {
            // Handle API error responses
            const errorMessage = result.message || "Login failed. Please try again.";
            
            return {
               success: false,
               error: errorMessage
            };
         }
      } catch (error) {
         console.error("Login network error:", error);
         
         // Handle network errors
         return { 
            success: false, 
            error: "Network error. Please check your connection and try again." 
         };
      } finally {
         setLoading(false);
      }
   };

   // Real API register function
   const register = async (userData) => {
      try {
         setLoading(true);

         console.log("Attempting registration with real API...", userData);

         // Call real Aboki B2B API - PRODUCTION URL
         const response = await fetch('https://api.aboki.xyz/api/v1/auth/signup', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               email: userData.email,
               password: userData.password,
               fullName: `${userData.firstName} ${userData.lastName}`,
               phone: userData.phoneNumber
            })
         });

         const result = await response.json();
         
         console.log("Registration API Response:", result);

         if (result.success) {
            return {
               success: true,
               message: "Account created successfully! Please check your email to verify your account before signing in.",
               data: result.data
            };
         } else {
            // Handle API error responses
            const errorMessage = result.message || "Registration failed. Please try again.";
            
            return {
               success: false,
               error: errorMessage
            };
         }
      } catch (error) {
         console.error("Registration network error:", error);
         
         return {
            success: false,
            error: "Network error. Please check your connection and try again."
         };
      } finally {
         setLoading(false);
      }
   };

   const logout = () => {
      setUser(null);
      if (typeof window !== "undefined") {
         localStorage.removeItem("aboki_token");
         localStorage.removeItem("aboki_user");
      }
   };

   // Check if user is authenticated on page load
   const checkAuth = useCallback(async () => {
      try {
         // Only check localStorage in the browser
         if (typeof window !== "undefined") {
            const token = localStorage.getItem("aboki_token");
            const storedUser = localStorage.getItem("aboki_user");

            if (token && storedUser) {
               // Validate token with API
               try {
                  const response = await fetch('https://api.aboki.xyz/api/v1/auth/profile', {
                     method: 'GET',
                     headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                     }
                  });

                  if (response.ok) {
                     const result = await response.json();
                     if (result.success && result.data) {
                        // Update user with fresh data from API
                        const userData = result.data;
                        const userStatus = {
                           isEmailVerified: userData.isVerified || userData.emailVerified || false,
                           isAdminApproved: userData.isApproved || userData.adminApproved || false,
                           hasApiAccess: userData.hasApiAccess || userData.apiAccess || false
                        };
                        
                        const fullUserData = { ...userData, ...userStatus };
                        setUser(fullUserData);
                        
                        // Update stored user data
                        localStorage.setItem("aboki_user", JSON.stringify(fullUserData));
                     } else {
                        // Token invalid, clear storage
                        localStorage.removeItem("aboki_token");
                        localStorage.removeItem("aboki_user");
                     }
                  } else {
                     // Token invalid, clear storage
                     localStorage.removeItem("aboki_token");
                     localStorage.removeItem("aboki_user");
                  }
               } catch (profileError) {
                  // If profile check fails, still use stored data (offline mode)
                  console.log("Profile check failed, using stored data:", profileError);
                  const userData = JSON.parse(storedUser);
                  setUser(userData);
               }
            }
         }
      } catch (error) {
         console.error("Auth check failed:", error);
         if (typeof window !== "undefined") {
            localStorage.removeItem("aboki_token");
            localStorage.removeItem("aboki_user");
         }
      } finally {
         setLoading(false);
      }
   }, []);

   useEffect(() => {
      checkAuth();
   }, [checkAuth]);

   // Helper function to get current auth token
   const getToken = () => {
      if (typeof window !== "undefined") {
         return localStorage.getItem("aboki_token");
      }
      return null;
   };

   // Helper function to make authenticated API calls
   const authenticatedFetch = async (url, options = {}) => {
      const token = getToken();
      
      if (!token) {
         throw new Error("No authentication token found");
      }

      return fetch(url, {
         ...options,
         headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
         }
      });
   };

   // Check verification status
   const checkVerificationStatus = async () => {
      try {
         const response = await authenticatedFetch('https://api.aboki.xyz/api/v1/auth/verification-status');
         
         if (response.ok) {
            const result = await response.json();
            return result.data;
         }
         throw new Error('Failed to check verification status');
      } catch (error) {
         console.error('Verification status check error:', error);
         throw error;
      }
   };

   const value = {
      user,
      loading,
      login,
      register,
      logout,
      checkAuth,
      getToken,
      authenticatedFetch, // Bonus: helper for authenticated API calls
      checkVerificationStatus, // New: check verification status
   };

   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
   const context = useContext(AuthContext);
   if (!context) {
      throw new Error("useAuth must be used within an AuthProvider");
   }
   return context;
};