import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

export default function DashboardLayout({ children }) {
   return (
      <div className="min-h-screen bg-gray-50">
         <Sidebar />
         <div className="ml-64">
            <TopNavbar />
            <main className="pt-20 px-6 py-8">
               {children}
            </main>
         </div>
      </div>
   );
}