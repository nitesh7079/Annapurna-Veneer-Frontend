import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTransactionsOpen, setIsTransactionsOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { unreadCount, connectionError } = useNotifications();

  // Define navigation based on user role
  const getNavigation = () => {
    const baseNavigation = [{ name: 'Home', href: '/' }];
    
    if (isAuthenticated() && isAdmin()) {
      return [
        ...baseNavigation,
        { name: 'Accounting', href: '/accounting' },
        { name: 'Banks', href: '/banks' },
        { name: 'Notifications', href: '/notifications' },
      ];
    }
    
    return baseNavigation;
  };

  const transactionDropdown = [
    { name: 'Buy', href: '/buy' },
    { name: 'Sell', href: '/sell' },
    { name: 'Other Credit', href: '/other-credit' },
    { name: 'Other Debit', href: '/other-debit' },
  ];

  const navigation = getNavigation();
  
  const isTransactionActive = transactionDropdown.some(item => location.pathname === item.href);

  return (
    <header className="bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-700 shadow-2xl">
      {/* Main Navigation */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-700 border-b-4 border-yellow-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-xl border-4 border-yellow-300 transform group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-2xl">AV</span>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-white tracking-tight drop-shadow-lg">
                  Annapurna Veneer
                </h1>
                <p className="text-sm text-cyan-200 font-bold">Premium Plywood Solutions</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-4">
              <nav className="flex items-center space-x-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-4 py-2 text-sm font-bold transition-all duration-200 flex items-center space-x-1 transform hover:scale-105 relative ${
                      location.pathname === item.href
                        ? "text-teal-900 bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-xl shadow-xl border-2 border-yellow-500"
                        : "text-white hover:text-teal-900 hover:bg-gradient-to-r hover:from-cyan-100 hover:to-teal-100 rounded-xl border-2 border-transparent hover:border-cyan-300 hover:shadow-lg"
                    }`}
                  >
                    <span>{item.name}</span>
                    {item.name === 'Notifications' && (
                      <>
                        {unreadCount > 0 && !connectionError && (
                          <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg border-2 border-white animate-pulse min-w-[24px] text-center">
                            {unreadCount}
                          </span>
                        )}
                        {connectionError && (
                          <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs font-bold px-1 py-0.5 rounded-full shadow-lg border border-white" title="Connection Error">
                            !
                          </span>
                        )}
                      </>
                    )}
                    {item.name === 'Register' && (
                      <span className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-2 py-1 rounded-full ml-1 shadow-md">
                        New
                      </span>
                    )}
                  </Link>
                ))}
                
                {/* Transactions Dropdown */}
                {isAuthenticated() && isAdmin() && (
                  <div className="relative">
                    <button
                      onClick={() => setIsTransactionsOpen(!isTransactionsOpen)}
                      className={`px-4 py-2 text-sm font-bold transition-all duration-200 flex items-center space-x-1 transform hover:scale-105 ${
                        isTransactionActive
                          ? "text-teal-900 bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-xl shadow-xl border-2 border-yellow-500"
                          : "text-white hover:text-teal-900 hover:bg-gradient-to-r hover:from-cyan-100 hover:to-teal-100 rounded-xl border-2 border-transparent hover:border-cyan-300 hover:shadow-lg"
                      }`}
                    >
                      <span>Transactions</span>
                      <svg 
                        className={`w-4 h-4 transform transition-transform ${isTransactionsOpen ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {isTransactionsOpen && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white border-4 border-teal-300 rounded-xl shadow-2xl z-50">
                        {transactionDropdown.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            onClick={() => setIsTransactionsOpen(false)}
                            className={`block px-4 py-3 text-sm font-bold transition-all ${
                              location.pathname === item.href
                                ? "text-teal-900 bg-gradient-to-r from-cyan-200 to-teal-200"
                                : "text-teal-900 hover:bg-gradient-to-r hover:from-cyan-100 hover:to-teal-100"
                            } first:rounded-t-lg last:rounded-b-lg`}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </nav>

              {/* User Info & Logout */}
              {isAuthenticated() ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-teal-800 px-4 py-2 rounded-xl border-2 border-teal-600 shadow-lg">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-xl border-2 border-yellow-300">
                      <span className="text-white text-sm font-bold">
                        {user?.fullName?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm">
                      <p className="font-bold text-white">{user?.fullName}</p>
                      <p className="text-cyan-200 font-semibold">
                        {isAdmin() ? 'Administrator' : 'User'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border-2 border-red-500"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="text-sm text-cyan-200 font-semibold">
                  Not logged in
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-teal-700 rounded-xl border-2 border-teal-600 bg-teal-800 shadow-lg transition-all"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t-4 border-yellow-500 bg-gradient-to-b from-teal-800 to-teal-900 shadow-2xl">
          <nav className="px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-4 py-3 rounded-xl text-base font-bold transition-all shadow-lg ${
                  location.pathname === item.href
                    ? "text-teal-900 bg-gradient-to-r from-yellow-300 to-yellow-400 border-2 border-yellow-500"
                    : "text-white bg-teal-700 hover:bg-gradient-to-r hover:from-cyan-200 hover:to-teal-200 hover:text-teal-900 border-2 border-teal-600"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span>{item.name}</span>
                    {item.name === 'Notifications' && (
                      <>
                        {unreadCount > 0 && !connectionError && (
                          <span className="ml-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg border border-white animate-pulse">
                            {unreadCount}
                          </span>
                        )}
                        {connectionError && (
                          <span className="ml-2 bg-yellow-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-lg border border-white" title="Connection Error">
                            !
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  {item.name === 'Register' && (
                    <span className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-2 py-1 rounded-full shadow-md">
                      New
                    </span>
                  )}
                </div>
              </Link>
            ))}
            
            {/* Transactions Section for Mobile */}
            {isAuthenticated() && isAdmin() && (
              <div>
                <button
                  onClick={() => setIsTransactionsOpen(!isTransactionsOpen)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-bold transition-all shadow-lg ${
                    isTransactionActive
                      ? "text-teal-900 bg-gradient-to-r from-yellow-300 to-yellow-400 border-2 border-yellow-500"
                      : "text-white bg-teal-700 border-2 border-teal-600"
                  }`}
                >
                  <span>Transactions</span>
                  <svg 
                    className={`w-5 h-5 transform transition-transform ${isTransactionsOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isTransactionsOpen && (
                  <div className="mt-2 ml-4 space-y-2">
                    {transactionDropdown.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`block px-4 py-3 rounded-xl text-sm font-bold transition-all shadow-lg ${
                          location.pathname === item.href
                            ? "text-teal-900 bg-gradient-to-r from-yellow-300 to-yellow-400 border-2 border-yellow-500"
                            : "text-white bg-teal-600 hover:bg-gradient-to-r hover:from-cyan-200 hover:to-teal-200 hover:text-teal-900 border-2 border-teal-500"
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;