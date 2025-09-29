import { useState } from 'react';

export default function UsersTable({ 
  users, 
  type, 
  onApprove, 
  onReject, 
  onToggleApi, 
  onResendVerification 
}) {
  const [actionLoading, setActionLoading] = useState({});

  const handleAction = async (action, userId, ...args) => {
    setActionLoading({ ...actionLoading, [userId]: true });
    await action(userId, ...args);
    setActionLoading({ ...actionLoading, [userId]: false });
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
        <p className="mt-1 text-sm text-gray-500">
          {type === 'pending' ? 'No users pending approval' : 'Try adjusting your search or filters'}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              {type === 'all' && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  API Access
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registered
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => {
              const isApproved = user.isApproved || user.verificationStatus === 'approved';
              const hasApiAccess = user.hasApiAccess || user.isApiEnabled;
              
              return (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                          {(user.fullName || user.firstName || user.email)?.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.fullName || `${user.firstName} ${user.lastName}` || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.businessName || 'No business name'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isApproved
                        ? 'bg-green-100 text-green-800'
                        : user.verificationStatus === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : user.verificationStatus === 'suspended'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {isApproved ? 'Approved' :
                       user.verificationStatus === 'rejected' ? 'Rejected' :
                       user.verificationStatus === 'suspended' ? 'Suspended' : 'Pending'}
                    </span>
                  </td>
                  {type === 'all' && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        hasApiAccess
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {hasApiAccess ? 'Enabled' : 'Disabled'}
                      </span>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {type === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleAction(onApprove, user.id)}
                            disabled={actionLoading[user.id]}
                            className="px-3 py-1.5 text-xs text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(onReject, user.id)}
                            disabled={actionLoading[user.id]}
                            className="px-3 py-1.5 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleAction(onToggleApi, user.id, hasApiAccess, user)}
                            disabled={actionLoading[user.id] || !isApproved}
                            className={`px-3 py-1.5 text-xs rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                              isApproved
                                ? 'text-purple-600 hover:text-purple-800 hover:bg-purple-50'
                                : 'text-gray-400 cursor-not-allowed'
                            }`}
                            title={!isApproved ? 'User must be approved first' : ''}
                          >
                            {hasApiAccess ? 'Disable API' : 'Enable API'}
                          </button>
                          {!user.isVerified && (
                            <button
                              onClick={() => handleAction(onResendVerification, user.id)}
                              disabled={actionLoading[user.id]}
                              className="px-3 py-1.5 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Resend Email
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {users.map((user) => {
          const isApproved = user.isApproved || user.verificationStatus === 'approved';
          const hasApiAccess = user.hasApiAccess || user.isApiEnabled;
          
          return (
            <div key={user.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              {/* User Header */}
              <div className="flex items-start space-x-3 mb-3">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold text-lg">
                    {(user.fullName || user.firstName || user.email)?.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {user.fullName || `${user.firstName} ${user.lastName}` || 'Unknown'}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {user.businessName || 'No business name'}
                  </div>
                  <div className="text-xs text-gray-500 truncate mt-1">
                    {user.email}
                  </div>
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  isApproved
                    ? 'bg-green-100 text-green-800'
                    : user.verificationStatus === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : user.verificationStatus === 'suspended'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {isApproved ? 'Approved' :
                   user.verificationStatus === 'rejected' ? 'Rejected' :
                   user.verificationStatus === 'suspended' ? 'Suspended' : 'Pending'}
                </span>
                
                {type === 'all' && (
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    hasApiAccess
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    API: {hasApiAccess ? 'Enabled' : 'Disabled'}
                  </span>
                )}
                
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-2">
                {type === 'pending' ? (
                  <>
                    <button
                      onClick={() => handleAction(onApprove, user.id)}
                      disabled={actionLoading[user.id]}
                      className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {actionLoading[user.id] ? 'Processing...' : 'Approve User'}
                    </button>
                    <button
                      onClick={() => handleAction(onReject, user.id)}
                      disabled={actionLoading[user.id]}
                      className="w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      {actionLoading[user.id] ? 'Processing...' : 'Reject User'}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleAction(onToggleApi, user.id, hasApiAccess, user)}
                      disabled={actionLoading[user.id] || !isApproved}
                      className={`w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${
                        isApproved
                          ? 'text-purple-600 bg-purple-50 hover:bg-purple-100'
                          : 'text-gray-400 bg-gray-50 cursor-not-allowed'
                      }`}
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                      </svg>
                      {actionLoading[user.id] ? 'Processing...' : 
                       !isApproved ? 'Approve User First' :
                       hasApiAccess ? 'Disable API Access' : 'Enable API Access'}
                    </button>
                    {!user.isVerified && (
                      <button
                        onClick={() => handleAction(onResendVerification, user.id)}
                        disabled={actionLoading[user.id]}
                        className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        {actionLoading[user.id] ? 'Sending...' : 'Resend Verification Email'}
                        </button>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}