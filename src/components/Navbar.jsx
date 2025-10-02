import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
   const { user, logout } = useAuth();

   return (
      <header className="bg-white shadow-sm border-b border-gray-200">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
               <div className="flex items-center">
                  <img
                     src="/assets/icons/logo.svg"
                     alt="Aboki"
                     className="h-8 w-8 mr-2"
                  />
                  <span className="text-xl font-bold text-gray-900">Aboki</span>
               </div>

               <div className="flex items-center space-x-4">
                  <span className="text-gray-700">
                     Welcome, {user?.firstName}
                  </span>
                  <button
                     onClick={logout}
                     className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                     Logout
                  </button>
               </div>
            </div>
         </div>
      </header>
   );
}