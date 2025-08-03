import React, { useState, useEffect } from "react";

const Toast = ({
   message,
   type = "info",
   isVisible,
   onClose,
   duration = 5000,
   position = "top-right",
}) => {
   const [isShowing, setIsShowing] = useState(false);

   useEffect(() => {
      if (isVisible) {
         setIsShowing(true);
         const timer = setTimeout(() => {
            setIsShowing(false);
            setTimeout(onClose, 300); // Wait for animation to complete
         }, duration);

         return () => clearTimeout(timer);
      }
   }, [isVisible, duration, onClose]);

   if (!isVisible && !isShowing) return null;

   const typeStyles = {
      success: {
         bg: "bg-green-50 border-green-200",
         icon: "text-green-400",
         text: "text-green-800",
         iconPath: (
            <path
               fillRule="evenodd"
               d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
               clipRule="evenodd"
            />
         ),
      },
      error: {
         bg: "bg-red-50 border-red-200",
         icon: "text-red-400",
         text: "text-red-800",
         iconPath: (
            <path
               fillRule="evenodd"
               d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
               clipRule="evenodd"
            />
         ),
      },
      warning: {
         bg: "bg-yellow-50 border-yellow-200",
         icon: "text-yellow-400",
         text: "text-yellow-800",
         iconPath: (
            <path
               fillRule="evenodd"
               d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
               clipRule="evenodd"
            />
         ),
      },
      info: {
         bg: "bg-blue-50 border-blue-200",
         icon: "text-blue-400",
         text: "text-blue-800",
         iconPath: (
            <path
               fillRule="evenodd"
               d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
               clipRule="evenodd"
            />
         ),
      },
   };

   const positionStyles = {
      "top-right": "top-4 right-4",
      "top-left": "top-4 left-4",
      "top-center": "top-4 left-1/2 transform -translate-x-1/2",
      "bottom-right": "bottom-4 right-4",
      "bottom-left": "bottom-4 left-4",
      "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2",
   };

   const currentStyle = typeStyles[type];

   return (
      <div
         className={`fixed ${
            positionStyles[position]
         } z-50 transition-all duration-300 ease-in-out ${
            isShowing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
         }`}>
         <div
            className={`max-w-sm w-full ${currentStyle.bg} border rounded-lg shadow-lg p-4`}>
            <div className="flex items-start">
               <div className="flex-shrink-0">
                  <svg
                     className={`h-5 w-5 ${currentStyle.icon}`}
                     viewBox="0 0 20 20"
                     fill="currentColor">
                     {currentStyle.iconPath}
                  </svg>
               </div>
               <div className="ml-3 flex-1">
                  <p className={`text-sm font-medium ${currentStyle.text}`}>
                     {message}
                  </p>
               </div>
               <div className="ml-4 flex-shrink-0 flex">
                  <button
                     className={`inline-flex ${currentStyle.text} hover:opacity-75 focus:outline-none`}
                     onClick={() => {
                        setIsShowing(false);
                        setTimeout(onClose, 300);
                     }}>
                     <span className="sr-only">Close</span>
                     <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor">
                        <path
                           fillRule="evenodd"
                           d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                           clipRule="evenodd"
                        />
                     </svg>
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
};
export default Toast;      
