import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import Logo from '../../src/components/common/Logo';

function Sidebar({ isOpen, onClose }) {
   const [activeItem, setActiveItem] = useState('Dashboard');
   const router = useRouter();
   const { logout } = useAuth();

   const handleLogout = () => {
      logout();
      router.push('/auth/signin');
   };

   const menuItems = [
      {
         name: 'Dashboard',
         icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
         )
      },
      {
         name: 'Transactions',
         icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
         )
      },
      {
         name: 'Onramp',
         icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
         )
      },
      {
         name: 'Offramp',
         icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
            </svg>
         )
      }
   ];

   const bottomMenuItems = [
      {
         name: 'Settings',
         icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
         )
      },
      {
         name: 'Logout',
         icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
         )
      }
   ];

   return (
      <>
         {/* Overlay for mobile */}
         {isOpen && (
            <div
               className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
               onClick={onClose}
            />
         )}

         {/* Sidebar */}
         <aside className={`w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col z-40 transition-transform duration-300 lg:translate-x-0 ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
         }`}>
            {/* Logo */}
            <div className="px-6 py-5 border-b border-gray-200">
               <div className="flex items-center justify-between">
                  <Logo />
                  
                  {/* Close button for mobile */}
                  <button
                     onClick={onClose}
                     className="lg:hidden p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                     </svg>
                  </button>
               </div>
            </div>

            {/* Main Navigation Menu */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
               {menuItems.map((item) => (
                  <button
                     key={item.name}
                     onClick={() => {
                        setActiveItem(item.name);
                        onClose();
                     }}
                     className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                        activeItem === item.name
                           ? 'bg-purple-600 text-white shadow-md'
                           : 'text-gray-600 hover:bg-gray-100'
                     }`}
                  >
                     {item.icon}
                     <span className="font-medium">{item.name}</span>
                  </button>
               ))}
            </nav>

            {/* Bottom Menu Items */}
            <div className="px-4 pb-6 space-y-1 border-t border-gray-200 pt-4">
               {bottomMenuItems.map((item) => (
                  <button
                     key={item.name}
                     onClick={() => {
                        if (item.name === 'Logout') {
                           handleLogout();
                        } else {
                           setActiveItem(item.name);
                           onClose();
                        }
                     }}
                     className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                        activeItem === item.name
                           ? 'bg-purple-600 text-white shadow-md'
                           : 'text-gray-600 hover:bg-gray-100'
                     }`}
                  >
                     {item.icon}
                     <span className="font-medium">{item.name}</span>
                  </button>
               ))}
            </div>
         </aside>
      </>
   );
}

function TopNavbar({ onMenuToggle, userData }) {
   const [testMode, setTestMode] = useState(false);

   const displayName = userData?.businessName || 'User';
   
   const getInitials = (name) => {
      return name
         .split(' ')
         .map(word => word[0])
         .join('')
         .toUpperCase()
         .slice(0, 2);
   };
   
   const profileImage = userData?.logo;

   return (
      <header className="bg-white border-b border-gray-200 fixed top-0 left-0 lg:left-64 right-0 z-10 h-18">
         <div className="h-full px-4 lg:px-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
               <button
                  onClick={onMenuToggle}
                  className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
               >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
               </button>

               <div className="lg:hidden">
                  <Logo />
               </div>
            </div>

            <div className="flex items-center space-x-3 lg:space-x-6">
               <div className="hidden md:flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Test mode</span>
                  <button
                     onClick={() => setTestMode(!testMode)}
                     className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        testMode ? 'bg-purple-600' : 'bg-gray-300'
                     }`}
                  >
                     <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                           testMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                     />
                  </button>
               </div>

               <button className="relative p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-600 rounded-full"></span>
               </button>

               <div className="flex items-center space-x-2 lg:space-x-3">
                  <span className="hidden sm:block text-sm font-medium text-gray-900">
                     {displayName}
                  </span>
                  {profileImage ? (
                     <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full overflow-hidden border-2 border-gray-200">
                        <img
                           src={profileImage}
                           alt={`${displayName} logo`}
                           className="w-full h-full object-cover"
                        />
                     </div>
                  ) : (
                     <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-purple-600 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                           {getInitials(displayName)}
                        </span>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </header>
   );
}

export default function DashboardLayout({ children }) {
   const [sidebarOpen, setSidebarOpen] = useState(false);
   const [userData, setUserData] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchUserProfile = async () => {
         const token = localStorage.getItem('aboki_token');
         
         if (!token) {
            setLoading(false);
            return;
         }

         try {
            const response = await fetch('https://api.aboki.xyz/api/v1/business/profile', {
               headers: {
                  'accept': 'application/json',
                  'Authorization': `Bearer ${token}`
               }
            });

            if (response.ok) {
               const contentType = response.headers.get("content-type");
               
               if (contentType && contentType.includes("application/json")) {
                  const data = await response.json();
                  setUserData(data);
               }
            }
         } catch (error) {
            console.error('Error fetching user profile:', error);
         } finally {
            setLoading(false);
         }
      };

      fetchUserProfile();
   }, []);

   const toggleSidebar = () => {
      setSidebarOpen(!sidebarOpen);
   };

   const closeSidebar = () => {
      setSidebarOpen(false);
   };

   return (
      <div className="min-h-screen bg-gray-50">
         <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
         <TopNavbar onMenuToggle={toggleSidebar} userData={userData} />
         <main className="pt-16 lg:pl-64 min-h-screen">
            <div className="p-4 lg:p-8">
               {children}
            </div>
         </main>
      </div>
   );
}