export default function VerifiedDashboard() {
    return (
       <>
          <div className="mb-8">
             <h1 className="text-3xl font-bold text-gray-900">
                Dashboard
             </h1>
             <p className="text-gray-600 mt-2">
                Manage your crypto business operations
             </p>
          </div>
 
          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                   <div className="p-3 bg-purple-100 rounded-lg">
                      <svg
                         className="h-6 w-6 text-purple-600"
                         fill="none"
                         viewBox="0 0 24 24"
                         stroke="currentColor">
                         <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                         />
                      </svg>
                   </div>
                   <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500">
                         Wallet Balance
                      </h3>
                      <p className="text-2xl font-bold text-purple-600">
                         $0.00
                      </p>
                   </div>
                </div>
             </div>
 
             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                   <div className="p-3 bg-blue-100 rounded-lg">
                      <svg
                         className="h-6 w-6 text-blue-600"
                         fill="none"
                         viewBox="0 0 24 24"
                         stroke="currentColor">
                         <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                         />
                      </svg>
                   </div>
                   <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500">
                         Transactions
                      </h3>
                      <p className="text-2xl font-bold text-blue-600">0</p>
                   </div>
                </div>
             </div>
 
             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                   <div className="p-3 bg-green-100 rounded-lg">
                      <svg
                         className="h-6 w-6 text-green-600"
                         fill="none"
                         viewBox="0 0 24 24"
                         stroke="currentColor">
                         <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                         />
                      </svg>
                   </div>
                   <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500">
                         Growth
                      </h3>
                      <p className="text-2xl font-bold text-green-600">
                         +0%
                      </p>
                   </div>
                </div>
             </div>
          </div>
 
          {/* Getting Started */}
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
             <h2 className="text-xl font-bold text-gray-900 mb-4">
                Getting Started
             </h2>
             <div className="space-y-4">
                <div className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer">
                   <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                         <span className="text-white font-bold">1</span>
                      </div>
                   </div>
                   <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                         Complete Your Profile
                      </h3>
                      <p className="text-gray-600">
                         Add additional information to your business profile
                      </p>
                   </div>
                </div>
 
                <div className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
                   <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                         <span className="text-white font-bold">2</span>
                      </div>
                   </div>
                   <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                         Connect Your Wallet
                      </h3>
                      <p className="text-gray-600">
                         Link your crypto wallet to start trading
                      </p>
                   </div>
                </div>
 
                <div className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer">
                   <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                         <span className="text-white font-bold">3</span>
                      </div>
                   </div>
                   <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                         Start Trading
                      </h3>
                      <p className="text-gray-600">
                         Begin your crypto business journey
                      </p>
                   </div>
                </div>
             </div>
          </div>
       </>
    );
 }