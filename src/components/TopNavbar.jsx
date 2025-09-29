import { useAuth } from "../hooks/useAuth";

export default function TopNavbar() {
   const { user } = useAuth();

   return (
      <header className="bg-white border-b border-gray-200 fixed top-0 right-0 left-64 z-10">
         <div className="px-6 py-4">
            <div className="flex items-center justify-between">
               {/* Search or Title */}
               <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
               </div>

               {/* Right Side - Dark Mode Toggle, Messages, User */}
               <div className="flex items-center space-x-4">
                  {/* Dark Mode Toggle */}
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                     </svg>
                  </button>

                  {/* Messages */}
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors relative">
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                     </svg>
                     <span className="absolute top-1 right-1 w-2 h-2 bg-purple-600 rounded-full"></span>
                  </button>

                  {/* User Profile */}
                  <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                     <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                           {user?.firstName} {user?.lastName}
                        </div>
                        <div className="text-xs text-gray-500">Manager</div>
                     </div>
                     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                        {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </header>
   );
}