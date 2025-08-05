import React, { useState, useEffect } from 'react';
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

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      await Promise.all([
        loadPendingUsers(),
        loadAllUsers(),
        loadStats()
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
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

  // Load pending users
  const loadPendingUsers = async () => {
    try {
      const response = await authenticatedFetch('https://aboki-b2b-eobk.onrender.com/api/v1/admin/users/pending-verification');
      
      if (response.ok) {
        const result = await response.json();
        setPendingUsers(result.data || []);
      }
    } catch (error) {
      console.error('Failed to load pending users:', error);
    }
  };

  // Load all users
  const loadAllUsers = async () => {
    try {
      const response = await authenticatedFetch('https://aboki-b2b-eobk.onrender.com/api/v1/admin/users');
      
      if (response.ok) {
        const result = await response.json();
        setAllUsers(result.data || []);
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
        await loadDashboardData(); // Refresh data
        alert('User approved successfully!');
      } else {
        alert('Failed to approve user');
      }
    } catch (error) {
      console.error('Approve error:', error);
      alert('Error approving user');
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
        await loadDashboardData(); // Refresh data
        alert('User rejected successfully!');
      } else {
        alert('Failed to reject user');
      }
    } catch (error) {
      console.error('Reject error:', error);
      alert('Error rejecting user');
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
        await loadAllUsers(); // Refresh user list
        alert(`API access ${currentStatus ? 'disabled' : 'enabled'} successfully!`);
      } else {
        alert('Failed to toggle API access');
      }
    } catch (error) {
      console.error('Toggle API access error:', error);
      alert('Error toggling API access');
    } finally {
      setActionLoading({ ...actionLoading, [userId]: null });
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    router.push('/admin/login');
  };

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
                <p className="text-2xl font-bold text-amber-600">{pendingUsers.length}</p>
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
                Pending Users ({pendingUsers.length})
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'all'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Users ({allUsers.length})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'pending' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Users Awaiting Approval</h3>
                {pendingUsers.length === 0 ? (
                  <div className="text-center py-8">
                    <span className="text-6xl mb-4 block">🎉</span>
                    <p className="text-gray-500">No users pending approval!</p>
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
                        {pendingUsers.map((user) => (
                          <tr key={user.id}>
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
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
                                Pending
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              <button
                                onClick={() => approveUser(user.id)}
                                disabled={actionLoading[user.id]}
                                className="inline-flex items-center gap-1 text-green-600 hover:text-green-900 disabled:opacity-50"
                              >
                                {actionLoading[user.id] === 'approving' ? '⏳' : '✅'} Approve
                              </button>
                              <button
                                onClick={() => rejectUser(user.id)}
                                disabled={actionLoading[user.id]}
                                className="inline-flex items-center gap-1 text-red-600 hover:text-red-900 disabled:opacity-50"
                              >
                                {actionLoading[user.id] === 'rejecting' ? '⏳' : '❌'} Reject
                              </button>
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
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">API Access</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {allUsers.map((user) => (
                        <tr key={user.id}>
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
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.isApproved 
                                ? 'bg-green-100 text-green-800' 
                                : user.isVerified 
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {user.isApproved ? 'Approved' : user.isVerified ? 'Email Verified' : 'Unverified'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.hasApiAccess 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.hasApiAccess ? 'Enabled' : 'Disabled'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => toggleApiAccess(user.id, user.hasApiAccess)}
                              disabled={actionLoading[user.id]}
                              className="text-purple-600 hover:text-purple-900 disabled:opacity-50"
                            >
                              {actionLoading[user.id] === 'toggling' 
                                ? '⏳ Processing...' 
                                : user.hasApiAccess 
                                ? '🔒 Disable API' 
                                : '🔓 Enable API'
                              }
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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