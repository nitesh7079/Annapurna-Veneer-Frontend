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
    <header className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 shadow-2xl">
      {/* Main Navigation */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 border-b-4 border-amber-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl flex items-center justify-center shadow-xl border-4 border-amber-300 transform group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-2xl">SV</span>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-white tracking-tight drop-shadow-lg">
                  Annapurna Veneer
                </h1>
                <p className="text-sm text-amber-200 font-bold">Premium Plywood Solutions</p>
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
                        ? "text-amber-900 bg-gradient-to-r from-amber-200 to-amber-300 rounded-xl shadow-xl border-2 border-amber-400"
                        : "text-white hover:text-amber-900 hover:bg-gradient-to-r hover:from-amber-100 hover:to-amber-200 rounded-xl border-2 border-transparent hover:border-amber-300 hover:shadow-lg"
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
                          ? "text-amber-900 bg-gradient-to-r from-amber-200 to-amber-300 rounded-xl shadow-xl border-2 border-amber-400"
                          : "text-white hover:text-amber-900 hover:bg-gradient-to-r hover:from-amber-100 hover:to-amber-200 rounded-xl border-2 border-transparent hover:border-amber-300 hover:shadow-lg"
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
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white border-4 border-amber-300 rounded-xl shadow-2xl z-50">
                        {transactionDropdown.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            onClick={() => setIsTransactionsOpen(false)}
                            className={`block px-4 py-3 text-sm font-bold transition-all ${
                              location.pathname === item.href
                                ? "text-amber-900 bg-gradient-to-r from-amber-200 to-amber-300"
                                : "text-amber-900 hover:bg-gradient-to-r hover:from-amber-100 hover:to-amber-200"
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
                  <div className="flex items-center space-x-2 bg-amber-800 px-4 py-2 rounded-xl border-2 border-amber-600 shadow-lg">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-xl border-2 border-amber-300">
                      <span className="text-white text-sm font-bold">
                        {user?.fullName?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm">
                      <p className="font-bold text-white">{user?.fullName}</p>
                      <p className="text-amber-200 font-semibold">
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
                <div className="text-sm text-amber-200 font-semibold">
                  Not logged in
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-amber-700 rounded-xl border-2 border-amber-600 bg-amber-800 shadow-lg transition-all"
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
        <div className="lg:hidden border-t-4 border-amber-600 bg-gradient-to-b from-amber-800 to-amber-900 shadow-2xl">
          <nav className="px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-4 py-3 rounded-xl text-base font-bold transition-all shadow-lg ${
                  location.pathname === item.href
                    ? "text-amber-900 bg-gradient-to-r from-amber-200 to-amber-300 border-2 border-amber-400"
                    : "text-white bg-amber-700 hover:bg-gradient-to-r hover:from-amber-200 hover:to-amber-300 hover:text-amber-900 border-2 border-amber-600"
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
                      ? "text-amber-900 bg-gradient-to-r from-amber-200 to-amber-300 border-2 border-amber-400"
                      : "text-white bg-amber-700 border-2 border-amber-600"
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
                            ? "text-amber-900 bg-gradient-to-r from-amber-200 to-amber-300 border-2 border-amber-400"
                            : "text-white bg-amber-600 hover:bg-gradient-to-r hover:from-amber-200 hover:to-amber-300 hover:text-amber-900 border-2 border-amber-500"
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