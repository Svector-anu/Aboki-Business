export default function AdminLayout({ children, adminData, onLogout, lastRefresh, autoRefresh, onToggleAutoRefresh }) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo and Title */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Aboki Admin</h1>
                  <p className="text-xs text-gray-500">Administrative Portal</p>
                </div>
              </div>
  
              {/* Right Side */}
              <div className="flex items-center space-x-4">
                {/* Auto Refresh Status */}
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
                  <span>Last refresh: {lastRefresh.toLocaleTimeString()}</span>
                </div>
  
                {/* Auto Refresh Toggle */}
                <button
                  onClick={onToggleAutoRefresh}
                  className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                    autoRefresh 
                      ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
                </button>
  
                {/* Admin Profile */}
                <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {adminData?.name || adminData?.email}
                    </div>
                    <div className="text-xs text-gray-500">
                      {adminData?.role || 'Admin'}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                    {(adminData?.name || adminData?.email)?.charAt(0).toUpperCase()}
                  </div>
                </div>
  
                {/* Logout Button */}
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>
  
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    );
  }