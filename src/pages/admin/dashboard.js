import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminLayout from '../../components/admin/AdminLayout';
import LoadingScreen from '../../components/LoadingScreen';
import StatsCards from '../../components/admin/StatsCards';
import UsersTable from '../../components/admin/UsersTable';
import SearchFilters from '../../components/admin/SearchFilters';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);
  const [stats, setStats] = useState({});
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingUsers, setPendingUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    verificationStatus: 'all',
    accountStatus: 'all',
    isApiEnabled: 'all',
    dateRange: 'all'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token');
      const admin = localStorage.getItem('admin_user');
      
      if (!token || !admin) {
        router.push('/admin/login');
        return;
      }

      try {
        setAdminData(JSON.parse(admin));
        await loadDashboardData();
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (autoRefresh && !loading) {
      const interval = setInterval(() => {
        loadDashboardData(false);
        setLastRefresh(new Date());
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [autoRefresh, loading]);

  const authenticatedFetch = async (url, options = {}) => {
    const token = localStorage.getItem('admin_token');
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    if (response.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      router.push('/admin/login');
      throw new Error('Unauthorized');
    }

    return response;
  };

  const loadDashboardData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    
    try {
      await Promise.all([
        loadStats(),
        loadPendingUsers(),
        loadAllUsers()
      ]);
    } catch (error) {
      if (error.message !== 'Unauthorized') {
        console.error('Failed to load dashboard:', error);
      }
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await authenticatedFetch('https://api.aboki.xyz/api/v1/admin/users/stats');
      if (response.ok) {
        const result = await response.json();
        setStats(result.data || {});
      }
    } catch (error) {
      if (error.message !== 'Unauthorized') {
        console.error('Failed to load stats:', error);
      }
    }
  };

  const loadPendingUsers = async () => {
    try {
      const response = await authenticatedFetch(
        'https://api.aboki.xyz/api/v1/admin/users/pending-verification'
      );
      
      if (response.ok) {
        const result = await response.json();
        console.log('=== PENDING USERS DEBUG ===');
        console.log('Full API Response:', result);
        console.log('result.data:', result.data);
        console.log('result.data.users:', result.data?.users);
        console.log('Is result.data an array?', Array.isArray(result.data));
        
        // Try multiple possible data structures
        let users = [];
        
        if (Array.isArray(result.data)) {
          users = result.data;
        } else if (Array.isArray(result.data?.users)) {
          users = result.data.users;
        } else if (result.users) {
          users = result.users;
        } else if (result.data) {
          users = [result.data];
        }
        
        console.log('Extracted users array:', users);
        console.log('Users count:', users.length);
        console.log('First user:', users[0]);
        
        setPendingUsers(users);
      } else {
        console.error('Failed to load pending users. Status:', response.status);
        const error = await response.json();
        console.error('Error response:', error);
      }
    } catch (error) {
      if (error.message !== 'Unauthorized') {
        console.error('Failed to load pending users:', error);
      }
    }
  };

  const loadAllUsers = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...(searchQuery && { search: searchQuery }),
        ...(filters.verificationStatus !== 'all' && { verificationStatus: filters.verificationStatus }),
        ...(filters.accountStatus !== 'all' && { accountStatus: filters.accountStatus }),
        ...(filters.isApiEnabled !== 'all' && { isApiEnabled: filters.isApiEnabled })
      });

      const response = await authenticatedFetch(
        `https://api.aboki.xyz/api/v1/admin/users?${params}`
      );
      
      if (response.ok) {
        const result = await response.json();
        console.log('=== ALL USERS DEBUG ===');
        console.log('Full API Response:', result);
        
        const usersArray = Array.isArray(result.data) ? result.data : 
                          Array.isArray(result.data?.users) ? result.data.users : [];
        
        console.log('All users count:', usersArray.length);
        setAllUsers(usersArray);
      }
    } catch (error) {
      if (error.message !== 'Unauthorized') {
        console.error('Failed to load users:', error);
      }
    }
  };

  const approveUser = async (userId) => {
    const confirmApprove = confirm('Are you sure you want to approve this user? This will verify their account but NOT enable API access yet.');
    if (!confirmApprove) return;

    try {
      const response = await authenticatedFetch(
        `https://api.aboki.xyz/api/v1/admin/users/${userId}/verify`,
        {
          method: 'POST',
          body: JSON.stringify({
            action: 'approve',
            enableApi: false,
            notes: 'User approved - pending API access activation'
          })
        }
      );

      if (response.ok) {
        await loadDashboardData(false);
        alert('User approved successfully! You can now enable API access from the All Users tab.');
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to approve user');
      }
    } catch (error) {
      if (error.message !== 'Unauthorized') {
        console.error('Approve error:', error);
        alert('Error approving user');
      }
    }
  };

  const rejectUser = async (userId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    try {
      const response = await authenticatedFetch(
        `https://api.aboki.xyz/api/v1/admin/users/${userId}/verify`,
        {
          method: 'POST',
          body: JSON.stringify({
            action: 'reject',
            rejectionReason: reason,
            enableApi: false
          })
        }
      );

      if (response.ok) {
        await loadDashboardData(false);
        alert('User rejected successfully');
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to reject user');
      }
    } catch (error) {
      if (error.message !== 'Unauthorized') {
        console.error('Reject error:', error);
        alert('Error rejecting user');
      }
    }
  };

  const toggleApiAccess = async (userId, currentStatus, user) => {
    if (!user.isApproved && user.verificationStatus !== 'approved') {
      alert('Please approve this user first before enabling API access.');
      return;
    }

    const action = currentStatus ? 'disable' : 'enable';
    const confirmToggle = confirm(`Are you sure you want to ${action} API access for this user?`);
    if (!confirmToggle) return;

    try {
      const response = await authenticatedFetch(
        `https://api.aboki.xyz/api/v1/admin/users/${userId}/api-access`,
        {
          method: 'PUT',
          body: JSON.stringify({
            isApiEnabled: !currentStatus,
            reason: `API access ${action}d by admin`
          })
        }
      );

      if (response.ok) {
        await loadAllUsers();
        alert(`API access ${action}d successfully`);
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to toggle API access');
      }
    } catch (error) {
      if (error.message !== 'Unauthorized') {
        console.error('Toggle error:', error);
        alert('Error toggling API access');
      }
    }
  };

  const resendVerification = async (userId) => {
    try {
      const response = await authenticatedFetch(
        `https://api.aboki.xyz/api/v1/admin/users/${userId}/resend-verification`,
        { method: 'POST' }
      );

      if (response.ok) {
        alert('Verification email sent successfully');
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to send verification email');
      }
    } catch (error) {
      if (error.message !== 'Unauthorized') {
        console.error('Resend error:', error);
        alert('Error sending verification email');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Admin Dashboard - Aboki</title>
        </Head>
        <LoadingScreen message="Loading admin dashboard" />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard - Aboki</title>
        <meta name="description" content="Aboki admin dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AdminLayout 
        adminData={adminData} 
        onLogout={handleLogout}
        lastRefresh={lastRefresh}
        autoRefresh={autoRefresh}
        onToggleAutoRefresh={() => setAutoRefresh(!autoRefresh)}
      >
        <div className="space-y-6">
          <StatsCards stats={stats} pendingCount={pendingUsers.length} />
          
          <SearchFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filters={filters}
            setFilters={setFilters}
            onRefresh={() => loadDashboardData(false)}
            onReset={() => {
              setSearchQuery('');
              setFilters({
                verificationStatus: 'all',
                accountStatus: 'all',
                isApiEnabled: 'all',
                dateRange: 'all'
              });
            }}
          />

          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'pending'
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Pending Users ({pendingUsers.length})
                </button>
                <button
                  onClick={() => setActiveTab('all')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'all'
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  All Users ({allUsers.length})
                </button>
              </nav>
            </div>

            <div className="p-6">
              <UsersTable
                users={activeTab === 'pending' ? pendingUsers : allUsers}
                type={activeTab}
                onApprove={approveUser}
                onReject={rejectUser}
                onToggleApi={toggleApiAccess}
                onResendVerification={resendVerification}
              />
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}