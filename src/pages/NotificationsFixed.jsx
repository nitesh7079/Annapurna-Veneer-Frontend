import React, { useState, useEffect } from 'react';
import { notificationAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const NotificationsFixed = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [markingAsRead, setMarkingAsRead] = useState(null);
  
  // Filter states
  const [filterType, setFilterType] = useState('all'); // 'all', 'unread', 'read'
  const [searchName, setSearchName] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [transactionTypeFilter, setTransactionTypeFilter] = useState('all');

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await notificationAPI.getAll();
      if (response.success) {
        setNotifications(response.data);
        setFilteredNotifications(response.data);
      }
    } catch (err) {
      setError('Failed to fetch notifications');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter notifications based on current filters
  const applyFilters = () => {
    let filtered = [...notifications];

    // Filter by read/unread status
    if (filterType === 'unread') {
      filtered = filtered.filter(notif => !notif.IsReaded);
    } else if (filterType === 'read') {
      filtered = filtered.filter(notif => notif.IsReaded);
    }

    // Filter by customer name
    if (searchName.trim()) {
      filtered = filtered.filter(notif => 
        notif.CustomerName && notif.CustomerName.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    // Filter by transaction type
    if (transactionTypeFilter !== 'all') {
      filtered = filtered.filter(notif => 
        notif.TransactionType && notif.TransactionType.includes(transactionTypeFilter)
      );
    }

    // Filter by date
    if (searchDate) {
      const searchDateObj = new Date(searchDate);
      filtered = filtered.filter(notif => {
        const notifDate = new Date(notif.createdAt || notif.NotificationDate);
        return notifDate.toDateString() === searchDateObj.toDateString();
      });
    }

    setFilteredNotifications(filtered);
  };

  // Apply filters whenever filters change
  useEffect(() => {
    applyFilters();
  }, [notifications, filterType, searchName, searchDate, transactionTypeFilter]);

  // Calculate statistics
  const getStatistics = () => {
    const total = notifications.length;
    const unread = notifications.filter(notif => !notif.IsReaded).length;
    const read = notifications.filter(notif => notif.IsReaded).length;
    
    return { total, unread, read };
  };

  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      setMarkingAsRead(id);
      const response = await notificationAPI.markAsRead(id);
      if (response.success) {
        setNotifications(prev => 
          prev.map(notif => 
            notif._id === id ? { ...notif, IsReaded: true } : notif
          )
        );
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
      setError('Failed to mark notification as read');
    } finally {
      setMarkingAsRead(null);
    }
  };

  // Manual check for overdue payments
  const checkOverduePayments = async () => {
    try {
      setLoading(true);
      const response = await notificationAPI.checkOverdue();
      if (response.success) {
        await fetchNotifications();
        alert(`Overdue check completed. ${response.data.overdue.notificationsCreated} new notifications created.`);
      }
    } catch (err) {
      console.error('Error checking overdue payments:', err);
      setError('Failed to check overdue payments');
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            {/* Header skeleton */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 border-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-300 p-4 rounded-xl w-16 h-16"></div>
                  <div className="space-y-2">
                    <div className="h-8 bg-gray-300 rounded w-48"></div>
                    <div className="h-4 bg-gray-300 rounded w-64"></div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <div className="h-12 bg-gray-300 rounded-xl w-32"></div>
                  <div className="h-12 bg-gray-300 rounded-xl w-24"></div>
                </div>
              </div>
            </div>
            
            {/* Statistics cards skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white border-4 p-6 rounded-2xl shadow-2xl">
                  <div className="flex items-center">
                    <div className="bg-gray-300 p-4 rounded-xl w-16 h-16"></div>
                    <div className="ml-4 space-y-2">
                      <div className="h-6 bg-gray-300 rounded w-32"></div>
                      <div className="h-10 bg-gray-300 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Filter controls skeleton */}
            <div className="bg-white border-4 rounded-2xl shadow-2xl p-6 space-y-6">
              <div className="h-8 bg-gray-300 rounded w-48"></div>
              
              {/* Filter buttons skeleton */}
              <div className="flex flex-wrap gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-gray-300 rounded-xl w-24"></div>
                ))}
              </div>
              
              {/* Search inputs skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-32"></div>
                    <div className="h-12 bg-gray-300 rounded-xl"></div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Notifications list skeleton */}
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-white rounded-2xl shadow-xl border-l-4 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex space-x-4 flex-1">
                      <div className="bg-gray-300 p-3 rounded-xl w-12 h-12"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <div className="h-6 bg-gray-300 rounded w-20"></div>
                      <div className="h-8 bg-gray-300 rounded w-24"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statistics = getStatistics();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 rounded-2xl shadow-2xl p-8 mb-8 border-4 border-amber-700">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-amber-100 p-4 rounded-xl shadow-lg">
                <svg className="w-12 h-12 text-amber-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-amber-50 tracking-wide drop-shadow-lg">Notifications</h1>
                <p className="text-amber-200 mt-1 text-sm">Annapurna Veneer - Premium Plywood</p>
              </div>
            </div>
            <div className="space-x-3">
              <button
                onClick={checkOverduePayments}
                className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-6 py-3 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
              >
                Check Overdue
              </button>
              <button
                onClick={fetchNotifications}
                className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-3 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-600 text-red-800 px-6 py-4 rounded-lg mb-4 shadow-lg">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white border-4 border-amber-300 p-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow">
            <div className="flex items-center">
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 shadow-lg">
                <svg className="w-10 h-10 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-bold text-amber-900">Total Notifications</h3>
                <p className="text-4xl font-bold text-blue-600">{statistics.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border-4 border-amber-300 p-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow">
            <div className="flex items-center">
              <div className="p-4 rounded-xl bg-gradient-to-br from-red-100 to-red-200 shadow-lg">
                <svg className="w-10 h-10 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-bold text-amber-900">Unread</h3>
                <p className="text-4xl font-bold text-red-600">{statistics.unread}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border-4 border-amber-300 p-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow">
            <div className="flex items-center">
              <div className="p-4 rounded-xl bg-gradient-to-br from-green-100 to-green-200 shadow-lg">
                <svg className="w-10 h-10 text-green-700" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-bold text-amber-900">Read</h3>
                <p className="text-4xl font-bold text-green-600">{statistics.read}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white border-4 border-amber-200 rounded-2xl shadow-2xl p-6">
          <h3 className="text-2xl font-bold text-amber-900 mb-6">Filter & Search</h3>
          
          {/* Quick Filter Buttons */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFilterType('all')}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all transform hover:scale-105 ${
                  filterType === 'all'
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-xl'
                    : 'bg-amber-100 text-amber-900 hover:bg-amber-200 border-2 border-amber-300'
                }`}
              >
                All ({statistics.total})
              </button>
              <button
                onClick={() => setFilterType('unread')}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all transform hover:scale-105 ${
                  filterType === 'unread'
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-xl'
                    : 'bg-red-50 text-red-900 hover:bg-red-100 border-2 border-red-300'
                }`}
              >
                Unread ({statistics.unread})
              </button>
              <button
                onClick={() => setFilterType('read')}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all transform hover:scale-105 ${
                  filterType === 'read'
                    ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-xl'
                    : 'bg-green-50 text-green-900 hover:bg-green-100 border-2 border-green-300'
                }`}
              >
                Read ({statistics.read})
              </button>
            </div>
          </div>
          
          {/* Search and Filter Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Customer Name Search */}
            <div>
              <label className="block text-sm font-bold text-amber-900 mb-2">Search by Customer Name</label>
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Enter customer name..."
                className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
              />
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-bold text-amber-900 mb-2">Filter by Date</label>
              <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
              />
            </div>

            {/* Transaction Type Filter */}
            <div>
              <label className="block text-sm font-bold text-amber-900 mb-2">Transaction Type</label>
              <select
                value={transactionTypeFilter}
                onChange={(e) => setTransactionTypeFilter(e.target.value)}
                className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
              >
                <option value="all">All Types</option>
                <option value="Buy">Buy</option>
                <option value="Sell">Sell</option>
                <option value="OtherCredit">Other Credit</option>
                <option value="OtherDebit">Other Debit</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterType('all');
                  setSearchName('');
                  setSearchDate('');
                  setTransactionTypeFilter('all');
                }}
                className="w-full px-4 py-3 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
            <p className="text-sm text-amber-900 font-semibold">
              Showing <span className="text-amber-700 text-lg">{filteredNotifications.length}</span> of <span className="text-amber-700 text-lg">{statistics.total}</span> notifications
            </p>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white border-4 border-amber-200 rounded-2xl shadow-2xl overflow-hidden">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center text-amber-800">
              {notifications.length === 0 ? (
                <div>
                  <div className="text-6xl mb-4">🎉</div>
                  <p className="text-xl font-bold text-amber-900">No notifications found</p>
                  <p className="text-sm text-amber-700">All caught up!</p>
                </div>
              ) : (
                <div>
                  <div className="text-6xl mb-4">🔍</div>
                  <p className="text-xl font-bold text-amber-900">No notifications match your filters</p>
                  <p className="text-sm text-amber-700">Try adjusting your search criteria</p>
                </div>
              )}
            </div>
          ) : (
            <div className="divide-y divide-amber-200">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-6 transition-colors ${
                    notification.IsReaded 
                      ? 'bg-amber-50/30' 
                      : 'bg-white border-l-4 border-amber-600 shadow-lg'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-xl font-bold text-amber-900">
                          {notification.CustomerName}
                        </h3>
                        {!notification.IsReaded && (
                          <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-200 to-amber-300 text-amber-900 border-2 border-amber-400 shadow-md">
                            NEW
                          </span>
                        )}
                        {notification.TransactionType && (
                          <span className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold border-2 shadow-md ${
                            notification.TransactionType.includes('Buy') ? 'bg-purple-100 text-purple-800 border-purple-300' :
                            notification.TransactionType.includes('Sell') ? 'bg-green-100 text-green-800 border-green-300' :
                            notification.TransactionType.includes('Credit') ? 'bg-blue-100 text-blue-800 border-blue-300' :
                            'bg-orange-100 text-orange-800 border-orange-300'
                          }`}>
                            {notification.TransactionType.replace('-Reminder', '')}
                          </span>
                        )}
                        {notification.OverdueDays > 0 && (
                          <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-2 border-red-300 shadow-md">
                            {notification.OverdueDays} days overdue
                          </span>
                        )}
                      </div>
                      
                      <p className="text-amber-900 mb-3">
                        <span className="font-bold">Item:</span> {notification.ItemName}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-6 mb-4">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 p-4 rounded-xl">
                          <p className="text-sm font-bold text-blue-800 mb-1">Total Amount</p>
                          <p className="text-lg font-bold text-blue-900">
                            {formatCurrency(notification.Amount)}
                          </p>
                        </div>
                        <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 p-4 rounded-xl">
                          <p className="text-sm font-bold text-red-800 mb-1">Pending Amount</p>
                          <p className={`text-lg font-bold ${
                            notification.PendingAmount > 0 ? 'text-red-700' : 'text-green-700'
                          }`}>
                            {formatCurrency(notification.PendingAmount)}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-sm text-amber-700 font-semibold">
                        <span className="font-bold">Created:</span> {formatDate(notification.createdAt || notification.NotificationDate)}
                      </p>
                    </div>
                    
                    <div className="ml-6 flex flex-col space-y-2">
                      {!notification.IsReaded ? (
                        <button
                          onClick={() => markAsRead(notification._id)}
                          disabled={markingAsRead === notification._id}
                          className={`px-6 py-2 text-sm font-bold rounded-xl transition-all transform ${
                            markingAsRead === notification._id
                              ? 'bg-amber-200 text-amber-500 cursor-not-allowed'
                              : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-xl hover:scale-105'
                          }`}
                        >
                          {markingAsRead === notification._id ? 'Marking...' : 'Mark as Read'}
                        </button>
                      ) : (
                        <div className="flex items-center text-green-600 px-6 py-2 bg-green-50 rounded-xl border-2 border-green-300">
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-bold">Read</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsFixed;