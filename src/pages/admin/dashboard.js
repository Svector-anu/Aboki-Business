import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';

const AdminDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('pending');
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [actionLoading, setActionLoading] = useState({});
  
  // Enhanced state for new features
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    apiAccess: 'all',
    dateRange: 'all'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Check admin authentication
  useEffect(() => {
    const checkAdminAuth = async () => {
      const token = localStorage.getItem('admin_token');
      const adminUser = localStorage.getItem('admin_user');
      
      if (!token || !adminUser) {
        router.push('/admin/login');
        return;
      }

      try {
        setAdminData(JSON.parse(adminUser));
        await loadDashboardData();
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAdminAuth();
  }, []);

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        loadDashboardData(false); // Silent refresh
        setLastRefresh(new Date());
      }, 30000); // Refresh every 30 seconds
      
      setRefreshInterval(interval);
      return () => clearInterval(interval);
    } else if (refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    }
  }, [autoRefresh]);

  // Reset page when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, filters]);

  // Load dashboard data
  const loadDashboardData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    
    try {
      await Promise.all([
        loadPendingUsers(),
        loadAllUsers(),
        loadStats()
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // API helper function
  const authenticatedFetch = async (url, options = {}) => {
    const token = localStorage.getItem('admin_token');
    
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
  };

  // Load pending users with pagination
  const loadPendingUsers = async () => {
    try {
      const response = await authenticatedFetch(
        `https://aboki-b2b-eobk.onrender.com/api/v1/admin/users/pending-verification`
      );
      
      if (response.ok) {
        const result = await response.json();
        console.log('Pending users API response:', result); // Debug log
        setPendingUsers(Array.isArray(result.data) ? result.data : []);
      } else {
        console.error('Pending users API error:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Failed to load pending users:', error);
    }
  };

  // Load all users with enhanced filtering
  const loadAllUsers = async () => {
    try {
      const response = await authenticatedFetch(
        `https://aboki-b2b-eobk.onrender.com/api/v1/admin/users`
      );
      
      if (response.ok) {
        const result = await response.json();
        console.log('All users API response:', result); // Debug log
        const usersArray = Array.isArray(result.data) ? result.data : Array.isArray(result.data?.users) ? result.data.users : [];
        setAllUsers(usersArray);
      } else {
        console.error('All users API error:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Failed to load all users:', error);
    }
  };

  // Load statistics
  const loadStats = async () => {
    try {
      const response = await authenticatedFetch('https://aboki-b2b-eobk.onrender.com/api/v1/admin/users/stats');
      
      if (response.ok) {
        const result = await response.json();
        setStats(result.data || {});
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  // Enhanced search function
  const searchUsers = useCallback((users, query) => {
    if (!query.trim()) return users;
    
    const searchTerm = query.toLowerCase().trim();
    return users.filter(user => {
      const fullName = (user.fullName || `${user.firstName} ${user.lastName}` || '').toLowerCase();
      const email = (user.email || '').toLowerCase();
      const businessName = (user.businessName || '').toLowerCase();
      
      return fullName.includes(searchTerm) || 
             email.includes(searchTerm) || 
             businessName.includes(searchTerm);
    });
  }, []);

  // Enhanced filter function
  const filterUsers = useCallback((users) => {
    return users.filter(user => {
      // Status filter
      if (filters.status !== 'all') {
        if (filters.status === 'approved' && !user.isApproved) return false;
        if (filters.status === 'pending' && (user.isApproved || !user.isVerified)) return false;
        if (filters.status === 'rejected' && (user.isApproved || user.isVerified)) return false;
        if (filters.status === 'unverified' && user.isVerified) return false;
      }

      // API Access filter
      if (filters.apiAccess !== 'all') {
        if (filters.apiAccess === 'enabled' && !user.hasApiAccess) return false;
        if (filters.apiAccess === 'disabled' && user.hasApiAccess) return false;
      }

      // Date Range filter
      if (filters.dateRange !== 'all') {
        const userDate = new Date(user.createdAt);
        const now = new Date();
        const daysDiff = Math.floor((now - userDate) / (1000 * 60 * 60 * 24));

        if (filters.dateRange === '7d' && daysDiff > 7) return false;
        if (filters.dateRange === '30d' && daysDiff > 30) return false;
        if (filters.dateRange === '90d' && daysDiff > 90) return false;
      }

      return true;
    });
  }, [filters]);

  // Get filtered and paginated users
  const getProcessedUsers = useCallback((users) => {
    const searched = searchUsers(users, searchQuery);
    const filtered = filterUsers(searched);
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return {
      users: filtered.slice(startIndex, endIndex),
      totalUsers: filtered.length,
      totalPages: Math.ceil(filtered.length / itemsPerPage)
    };
  }, [searchQuery, filterUsers, searchUsers, currentPage, itemsPerPage]);

  // Memoized processed data
  const processedPendingUsers = useMemo(() => getProcessedUsers(pendingUsers), [pendingUsers, getProcessedUsers]);
  const processedAllUsers = useMemo(() => getProcessedUsers(allUsers), [allUsers, getProcessedUsers]);

  // Approve user
  const approveUser = async (userId) => {
    setActionLoading({ ...actionLoading, [userId]: 'approving' });
    
    try {
      const response = await authenticatedFetch(`https://aboki-b2b-eobk.onrender.com/api/v1/admin/users/${userId}/verify`, {
        method: 'POST',
        body: JSON.stringify({
          action: 'approve',
          enableApi: true,
          notes: 'Approved via admin dashboard'
        })
      });

      if (response.ok) {
        await loadDashboardData(false);
        alert('User approved successfully! 🎉');
      } else {
        alert('Failed to approve user ❌');
      }
    } catch (error) {
      console.error('Approve error:', error);
      alert('Error approving user ❌');
    } finally {
      setActionLoading({ ...actionLoading, [userId]: null });
    }
  };

  // Reject user
  const rejectUser = async (userId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    setActionLoading({ ...actionLoading, [userId]: 'rejecting' });
    
    try {
      const response = await authenticatedFetch(`https://aboki-b2b-eobk.onrender.com/api/v1/admin/users/${userId}/verify`, {
        method: 'POST',
        body: JSON.stringify({
          action: 'reject',
          rejectionReason: reason,
          enableApi: false
        })
      });

      if (response.ok) {
        await loadDashboardData(false);
        alert('User rejected successfully! ✅');
      } else {
        alert('Failed to reject user ❌');
      }
    } catch (error) {
      console.error('Reject error:', error);
      alert('Error rejecting user ❌');
    } finally {
      setActionLoading({ ...actionLoading, [userId]: null });
    }
  };

  // Toggle API access
  const toggleApiAccess = async (userId, currentStatus) => {
    setActionLoading({ ...actionLoading, [userId]: 'toggling' });
    
    try {
      const response = await authenticatedFetch(`https://aboki-b2b-eobk.onrender.com/api/v1/admin/users/${userId}/api-access`, {
        method: 'PUT'
      });

      if (response.ok) {
        await loadAllUsers();
        alert(`API access ${currentStatus ? 'disabled' : 'enabled'} successfully! 🔑`);
      } else {
        alert('Failed to toggle API access ❌');
      }
    } catch (error) {
      console.error('Toggle API access error:', error);
      alert('Error toggling API access ❌');
    } finally {
      setActionLoading({ ...actionLoading, [userId]: null });
    }
  };

  // Resend verification email
  const resendVerification = async (userId) => {
    setActionLoading({ ...actionLoading, [userId]: 'resending' });
    
    try {
      const response = await authenticatedFetch(`https://aboki-b2b-eobk.onrender.com/api/v1/admin/users/${userId}/resend-verification`, {
        method: 'POST'
      });

      if (response.ok) {
        alert('Verification email sent successfully! 📧');
      } else {
        alert('Failed to send verification email ❌');
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      alert('Error sending verification email ❌');
    } finally {
      setActionLoading({ ...actionLoading, [userId]: null });
    }
  };

  // Manual refresh
  const handleRefresh = async () => {
    setLastRefresh(new Date());
    await loadDashboardData(false);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setFilters({
      status: 'all',
      apiAccess: 'all',
      dateRange: 'all'
    });
    setCurrentPage(1);
  };

  // Logout
  const handleLogout = () => {
    if (refreshInterval) clearInterval(refreshInterval);
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    router.push('/admin/login');
  };

  // Get current data based on active tab
  const getCurrentData = () => {
    return activeTab === 'pending' ? processedPendingUsers : processedAllUsers;
  };

  const currentData = getCurrentData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Aboki B2B Admin</h1>
              <p className="text-xs text-gray-500">Administrative Portal</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-500' : 'bg-gray-400'}`}></span>
              Last refresh: {lastRefresh.toLocaleTimeString()}
            </div>
            
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{adminData?.name || adminData?.email}</p>
              <p className="text-xs text-gray-500">{adminData?.role || 'Admin'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
            >
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-amber-100 rounded-lg">
                <span className="text-2xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold text-amber-600">{Array.isArray(pendingUsers) ? pendingUsers.length : 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved Users</p>
                <p className="text-2xl font-bold text-green-600">{stats.approvedUsers || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">🔑</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">API Active</p>
                <p className="text-2xl font-bold text-purple-600">{stats.apiActiveUsers || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Controls */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Search Bar */}
              <div className="flex-1 min-w-0">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">🔍</span>
                  <input
                    type="text"
                    placeholder="Search by name, email, or business name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                {/* Status Filter */}
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="approved">✅ Approved</option>
                  <option value="pending">⏳ Pending</option>
                  <option value="rejected">❌ Rejected</option>
                  <option value="unverified">📧 Unverified</option>
                </select>

                {/* API Access Filter */}
                <select
                  value={filters.apiAccess}
                  onChange={(e) => setFilters({...filters, apiAccess: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="all">All API Access</option>
                  <option value="enabled">🔓 Enabled</option>
                  <option value="disabled">🔒 Disabled</option>
                </select>

                {/* Date Range Filter */}
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="all">All Time</option>
                  <option value="7d">📅 Last 7 days</option>
                  <option value="30d">📅 Last 30 days</option>
                  <option value="90d">📅 Last 90 days</option>
                </select>

                {/* Controls */}
                <button
                  onClick={resetFilters}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  🔄 Reset
                </button>

                <button
                  onClick={handleRefresh}
                  className="px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                >
                  ↻ Refresh
                </button>

                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    autoRefresh 
                      ? 'text-green-600 bg-green-50 hover:bg-green-100' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {autoRefresh ? '⚡ Auto-refresh ON' : '⏸️ Auto-refresh OFF'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'pending'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ⏳ Pending Users ({processedPendingUsers.totalUsers})
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'all'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                👥 All Users ({processedAllUsers.totalUsers})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Results Summary */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-600">
                Showing {currentData.users.length} of {currentData.totalUsers} users
                {(searchQuery || filters.status !== 'all' || filters.apiAccess !== 'all' || filters.dateRange !== 'all') && (
                  <span className="ml-2 text-blue-600">(filtered)</span>
                )}
              </div>
              
              {/* Pagination Info */}
              {currentData.totalPages > 1 && (
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {currentData.totalPages}
                </div>
              )}
            </div>

            {activeTab === 'pending' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Users Awaiting Approval</h3>
                {currentData.users.length === 0 ? (
                  <div className="text-center py-8">
                    <span className="text-6xl mb-4 block">
                      {processedPendingUsers.totalUsers === 0 ? '🎉' : '🔍'}
                    </span>
                    <p className="text-gray-500">
                      {processedPendingUsers.totalUsers === 0 
                        ? 'No users pending approval!' 
                        : 'No users match your search criteria'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentData.users.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                    <span className="text-sm font-medium text-purple-600">
                                      {(user.fullName || user.firstName || user.email).charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {user.fullName || `${user.firstName} ${user.lastName}` || 'Unknown'}
                                  </div>
                                  <div className="text-sm text-gray-500">{user.businessName || 'No business name'}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                ⏳ Pending
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => approveUser(user.id)}
                                  disabled={actionLoading[user.id]}
                                  className="inline-flex items-center gap-1 px-3 py-1 text-sm text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                                >
                                  {actionLoading[user.id] === 'approving' ? '⏳' : '✅'} Approve
                                </button>
                                <button
                                  onClick={() => rejectUser(user.id)}
                                  disabled={actionLoading[user.id]}
                                  className="inline-flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                >
                                  {actionLoading[user.id] === 'rejecting' ? '⏳' : '❌'} Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'all' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">All Users</h3>
                {currentData.users.length === 0 ? (
                  <div className="text-center py-8">
                    <span className="text-6xl mb-4 block">🔍</span>
                    <p className="text-gray-500">No users match your search criteria</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">API Access</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentData.users.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <span className="text-sm font-medium text-blue-600">
                                      {(user.fullName || user.firstName || user.email).charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {user.fullName || `${user.firstName} ${user.lastName}` || 'Unknown'}
                                  </div>
                                  <div className="text-sm text-gray-500">{user.businessName || 'No business name'}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                user.isApproved 
                                  ? 'bg-green-100 text-green-800' 
                                  : user.isVerified 
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                              {user.isApproved ? '✅ Approved' : user.isVerified ? '📧 Email Verified' : '❌ Unverified'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                user.hasApiAccess 
                                  ? 'bg-purple-100 text-purple-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {user.hasApiAccess ? '🔓 Enabled' : '🔒 Disabled'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : '🔹 Never'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => toggleApiAccess(user.id, user.hasApiAccess)}
                                  disabled={actionLoading[user.id]}
                                  className="inline-flex items-center gap-1 px-3 py-1 text-sm text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-50"
                                >
                                  {actionLoading[user.id] === 'toggling' 
                                    ? '⏳' 
                                    : user.hasApiAccess 
                                    ? '🔒' 
                                    : '🔓'
                                  } {user.hasApiAccess ? 'Disable' : 'Enable'}
                                </button>
                                
                                {!user.isVerified && (
                                  <button
                                    onClick={() => resendVerification(user.id)}
                                    disabled={actionLoading[user.id]}
                                    className="inline-flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                                  >
                                    {actionLoading[user.id] === 'resending' ? '⏳' : '📧'} Resend
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Pagination */}
            {currentData.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, currentData.totalUsers)} of {currentData.totalUsers} users
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    ← Previous
                  </button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, currentData.totalPages) }, (_, i) => {
                      let pageNumber;
                      if (currentData.totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= currentData.totalPages - 2) {
                        pageNumber = currentData.totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                            currentPage === pageNumber
                              ? 'bg-red-600 text-white'
                              : 'text-gray-600 hover:text-gray-800 hover:bg-white'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(currentData.totalPages, currentPage + 1))}
                    disabled={currentPage === currentData.totalPages}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;