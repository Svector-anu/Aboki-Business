// src/components/StatsDashboard.jsx
import { useState, useEffect } from 'react';

export default function StatsDashboard() {
  const [copiedField, setCopiedField] = useState(null);
  const [businessData, setBusinessData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch real business profile data
  useEffect(() => {
    const fetchBusinessProfile = async () => {
      const token = localStorage.getItem('aboki_token');
      
      try {
        const response = await fetch('https://api.aboki.xyz/api/v1/business/profile', {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setBusinessData(result.data);
          }
        }
      } catch (error) {
        console.error('Error fetching business profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessProfile();
  }, []);

  // Extract user data from API response or use defaults
  const userData = {
    name: businessData?.business?.businessName || "User",
    avatar: businessData?.business?.logo || "/api/placeholder/80/80"
  };

  // TODO: Replace with real API data from stats endpoint
  // API endpoint: GET /api/v1/business/stats
  const stats = {
    totalUsers: 40689,
    totalUsersChange: 8.5,
    totalUsersDirection: "up",
    totalOrders: 10293,
    totalOrdersChange: 1.3,
    totalOrdersDirection: "up",
    orderVolume: 89000,
    orderVolumeChange: 4.3,
    orderVolumeDirection: "down",
    feeEarnings: 2040,
    feeEarningsChange: 1.8,
    feeEarningsDirection: "up"
  };

  // Extract API credentials from response or use placeholders
  const credentials = {
    clientId: businessData?.apiCredentials?.publicKey || "Loading...",
    clientSecret: businessData?.apiCredentials?.clientKey || "Loading..."
  };

  // TODO: Replace with real transactions from API
  // API endpoint: GET /api/v1/business/transactions?limit=10
  const recentTransactions = [
    {
      id: 1,
      date: "Jun 13, 08:42 AM",
      asset: "Bitcoin",
      type: "Off-ramp",
      amount: 100000,
      transactionType: "Buy Crypto",
      refId: "#1983.23",
      status: "Success"
    },
    {
      id: 2,
      date: "Jun 13, 08:42 AM",
      asset: "Bitcoin",
      type: "Off-ramp",
      amount: 100000,
      transactionType: "Buy Crypto",
      refId: "#1983.23",
      status: "Success"
    },
    {
      id: 3,
      date: "Jun 13, 08:42 AM",
      asset: "Bitcoin",
      type: "Off-ramp",
      amount: 100000,
      transactionType: "Buy Crypto",
      refId: "#1983.23",
      status: "Success"
    }
  ];

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Copy Icon Component
  const CopyIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );

  // Check Icon Component
  const CheckIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* User Greeting */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center overflow-hidden">
            <img src={userData.avatar} alt="User" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Hello {userData.name}</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-600 text-sm mb-2">Total user</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="text-green-600 font-medium">{stats.totalUsersChange}%</span>
              <span className="text-gray-500">Up from yesterday</span>
            </div>
          </div>

          {/* Total Orders Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-600 text-sm mb-2">Total orders</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalOrders.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="text-green-600 font-medium">{stats.totalOrdersChange}%</span>
              <span className="text-gray-500">Up from past week</span>
            </div>
          </div>

          {/* Order Volume Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-600 text-sm mb-2">Total order volume</p>
                <p className="text-3xl font-bold text-gray-900">${stats.orderVolume.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
              <span className="text-red-600 font-medium">{stats.orderVolumeChange}%</span>
              <span className="text-gray-500">Down from yesterday</span>
            </div>
          </div>

          {/* Fee Earnings Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-600 text-sm mb-2">Total fee earnings</p>
                <p className="text-3xl font-bold text-gray-900">{stats.feeEarnings.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="text-green-600 font-medium">{stats.feeEarningsChange}%</span>
              <span className="text-gray-500">Up from yesterday</span>
            </div>
          </div>
        </div>

        {/* API Credentials Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Client ID */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-gray-600 text-sm mb-3">Client ID</p>
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
              <code className="text-sm text-gray-700 font-mono">{credentials.clientId}</code>
              <button
                onClick={() => copyToClipboard(credentials.clientId, 'clientId')}
                className="ml-4 p-2 hover:bg-purple-100 rounded-lg transition-colors"
              >
                {copiedField === 'clientId' ? (
                  <CheckIcon className="w-5 h-5 text-green-600" />
                ) : (
                  <CopyIcon className="w-5 h-5 text-purple-600" />
                )}
              </button>
            </div>
          </div>

          {/* Client Secret */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-gray-600 text-sm mb-3">Client secret</p>
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
              <code className="text-sm text-gray-700 font-mono">{credentials.clientSecret}</code>
              <button
                onClick={() => copyToClipboard(credentials.clientSecret, 'clientSecret')}
                className="ml-4 p-2 hover:bg-purple-100 rounded-lg transition-colors"
              >
                {copiedField === 'clientSecret' ? (
                  <CheckIcon className="w-5 h-5 text-green-600" />
                ) : (
                  <CopyIcon className="w-5 h-5 text-purple-600" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent transactions</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-600">Date/time</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-600">Asset</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-600">Type</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-600">Amount</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-600">Type</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-600">Ref. ID</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 text-sm text-gray-700">{transaction.date}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                          <span className="text-orange-600 font-bold text-xs">₿</span>
                        </div>
                        <span className="text-sm text-gray-700">{transaction.asset}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700">{transaction.type}</td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-900">₦{transaction.amount.toLocaleString()}</td>
                    <td className="py-4 px-4 text-sm text-gray-700">{transaction.transactionType}</td>
                    <td className="py-4 px-4 text-sm text-gray-700">{transaction.refId}</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {recentTransactions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No transactions yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}