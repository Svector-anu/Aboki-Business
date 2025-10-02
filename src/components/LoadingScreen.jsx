export default function LoadingScreen({ message = "Loading your dashboard" }) {
    return (
       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-purple-700 to-blue-800 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0">
             <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/5 rounded-full animate-pulse"></div>
             <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-white/10 rounded-full animate-bounce delay-300"></div>
             <div className="absolute bottom-1/4 left-1/3 w-16 h-16 bg-blue-300/20 rounded-full animate-ping delay-500"></div>
             <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-purple-300/15 rounded-full animate-pulse delay-700"></div>
          </div>
 
          {/* Main content */}
          <div className="text-center text-white z-10 relative">
             {/* Logo container */}
             <div className="mb-8 relative">
                {/* Outer glow ring */}
                <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-purple-400 to-blue-400 opacity-20 animate-ping"></div>
                
                {/* Main logo container */}
                <div className="relative w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-white/10 to-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center p-4 animate-pulse">
                   {/* Logo SVG */}
                   <img 
                      src="/assets/icons/logo.svg" 
                      alt="Aboki Logo" 
                      className="w-12 h-12 object-contain filter brightness-0 invert"
                   />
                   
                   {/* Rotating ring */}
                   <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-white/50 border-r-white/30 animate-spin"></div>
                </div>
 
                {/* Company tagline */}
              
             </div>
 
             {/* Loading animation */}
             <div className="mb-6">
                <div className="relative">
                   <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
                   <div className="absolute inset-0 w-6 h-6 border border-white/20 border-b-white/60 rounded-full animate-spin-reverse mx-auto mt-1 ml-1"></div>
                </div>
             </div>
 
             {/* Status message */}
             <p className="text-lg font-medium text-white/90 mb-2">
                {message}
             </p>
             <p className="text-sm text-white/70">
                Please wait while we prepare everything...
             </p>
 
             {/* Progress bar */}
             <div className="mt-8 w-64 mx-auto">
                <div className="w-full bg-white/20 rounded-full h-1 overflow-hidden">
                   <div className="h-full bg-gradient-to-r from-white to-blue-200 w-1/3 animate-pulse transition-all duration-1000"></div>
                </div>
             </div>
 
             {/* Feature hints */}
             <div className="mt-12 flex justify-center space-x-8 text-xs text-white/60">
                <div className="flex items-center space-x-1 group hover:text-white/80 transition-colors">
                   <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                   </svg>
                   <span>Secure</span>
                </div>
                <div className="flex items-center space-x-1 group hover:text-white/80 transition-colors">
                   <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                   </svg>
                   <span>Fast</span>
                </div>
                <div className="flex items-center space-x-1 group hover:text-white/80 transition-colors">
                   <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                   <span>Global</span>
                </div>
             </div>
          </div>
 
          {/* Custom CSS for reverse spin */}
          <style jsx>{`
             @keyframes spin-reverse {
                from {
                   transform: rotate(360deg);
                }
                to {
                   transform: rotate(0deg);
                }
             }
             .animate-spin-reverse {
                animation: spin-reverse 1.5s linear infinite;
             }
          `}</style>
       </div>
    );
 }