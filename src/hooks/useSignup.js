import { useState } from 'react';

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signup = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      // Transform form data to match API expectations
      const apiData = {
        email: formData.email,
        password: formData.password,
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        phone: formData.phoneNumber,
        // Note: businessName and agreeToTerms are not sent to API
        // You may want to store businessName separately or modify your API
      };

      const response = await fetch('https://api.aboki.xyz/api/v1/auth/signup', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle different types of API errors
        let errorMessage = 'Registration failed';
        
        if (response.status === 400) {
          errorMessage = data.message || 'Invalid input data';
        } else if (response.status === 409) {
          errorMessage = 'An account with this email already exists';
        } else if (response.status === 422) {
          errorMessage = data.message || 'Validation failed';
        } else if (response.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        }

        throw new Error(errorMessage);
      }

      setLoading(false);
      return {
        success: true,
        data: data,
        user: data.user || data, // Adjust based on your API response structure
      };

    } catch (err) {
      setLoading(false);
      setError(err.message);
      
      return {
        success: false,
        error: err.message,
      };
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    signup,
    loading,
    error,
    clearError,
  };
};

export default useSignup;