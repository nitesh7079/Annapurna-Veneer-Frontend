import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(false);

  // Fetch unread notifications count with robust error handling
  const fetchUnreadCount = async () => {
    try {
      setConnectionError(false);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout
      
      const response = await fetch('https://shyam-veneer-backend-1.onrender.com/api/v1/notifications/unreaded', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setUnreadCount(data.count || 0);
        setNotifications(data.data || []);
      } else {
        console.warn('API returned unsuccessful response:', data.message);
        setUnreadCount(0);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn('Notification fetch timed out');
      } else {
        console.warn('Error fetching notifications:', error.message);
      }
      setConnectionError(true);
      setUnreadCount(0); // Reset to 0 on any error
    }
  };

  // Fetch all notifications
  const fetchAllNotifications = async () => {
    setLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch('https://shyam-veneer-backend-1.onrender.com/api/v1/notifications/all', {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setNotifications(data.data || []);
        }
      }
    } catch (error) {
      console.warn('Error fetching all notifications:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`https://shyam-veneer-backend-1.onrender.com/api/v1/notifications/markAsRead/${notificationId}`, {
        method: 'PUT'
      });
      
      if (response.ok) {
        // Refresh unread count after marking as read
        fetchUnreadCount();
        return true;
      }
    } catch (error) {
      console.warn('Error marking notification as read:', error.message);
    }
    return false;
  };

  // Auto-refresh with exponential backoff on errors
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 3;
    
    const attemptFetch = async () => {
      try {
        await fetchUnreadCount();
        retryCount = 0; // Reset on success
      } catch {
        retryCount++;
        if (retryCount < maxRetries) {
          // Exponential backoff: 2s, 4s, 8s
          setTimeout(attemptFetch, Math.pow(2, retryCount) * 1000);
        }
      }
    };
    
    // Initial fetch with delay
    const initialTimeout = setTimeout(attemptFetch, 1000);
    
    // Set up interval for auto-refresh (every minute)
    const interval = setInterval(attemptFetch, 60000);
    
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  const value = {
    unreadCount,
    notifications,
    loading,
    connectionError,
    fetchUnreadCount,
    fetchAllNotifications,
    markAsRead,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};