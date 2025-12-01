import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const inactivityTimer = useRef(null);
  const sessionCheckTimer = useRef(null);
  
  // Session timeout settings
  const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes of inactivity
  const SESSION_DURATION = 24 * 60 * 60 * 1000; // 1 day session duration



  // Set up activity listeners
  useEffect(() => {
    if (user) {
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
      
      const activityHandler = () => updateActivity();
      
      // Add event listeners
      events.forEach(event => {
        document.addEventListener(event, activityHandler, true);
      });
      
      return () => {
        // Cleanup event listeners
        events.forEach(event => {
          document.removeEventListener(event, activityHandler, true);
        });
      };
    }
  }, [user]);
  
  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
      if (sessionCheckTimer.current) {
        clearInterval(sessionCheckTimer.current);
      }
    };
  }, []);

  const login = (userData, token) => {
    const now = Date.now();
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('loginTime', now.toString());
    localStorage.setItem('lastActivity', now.toString());
    
    if (token) {
      localStorage.setItem('token', token);
    }
    
    // Start activity tracking
    resetInactivityTimer();
    
    // Set up periodic session validation
    sessionCheckTimer.current = setInterval(() => {
      if (!isSessionValid()) {
        autoLogout();
      }
    }, 60000); // Check every minute
  };

  const logout = () => {
    // Clear all timers
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }
    if (sessionCheckTimer.current) {
      clearInterval(sessionCheckTimer.current);
    }
    
    // Clear state and storage (but keep selectedCompany for potential re-login)
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('loginTime');
    localStorage.removeItem('lastActivity');
    // Note: We don't remove 'selectedCompany' here - only when switching companies
  };

  // Check if session is still valid
  const isSessionValid = () => {
    const loginTime = localStorage.getItem('loginTime');
    const lastActivity = localStorage.getItem('lastActivity');
    
    if (!loginTime || !lastActivity) {
      return false;
    }
    
    const now = Date.now();
    const loginTimestamp = parseInt(loginTime);
    const lastActivityTimestamp = parseInt(lastActivity);
    
    // Check if session has expired (1 day)
    if (now - loginTimestamp > SESSION_DURATION) {
      return false;
    }
    
    // Check if user has been inactive too long (30 minutes)
    if (now - lastActivityTimestamp > INACTIVITY_TIMEOUT) {
      return false;
    }
    
    return true;
  };
  
  // Update last activity timestamp
  const updateActivity = () => {
    if (user) {
      const now = Date.now();
      localStorage.setItem('lastActivity', now.toString());
      resetInactivityTimer();
    }
  };
  
  // Reset inactivity timer
  const resetInactivityTimer = () => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }
    
    inactivityTimer.current = setTimeout(() => {
      if (user) {
        autoLogout();
      }
    }, INACTIVITY_TIMEOUT);
  };
  
  // Auto logout function
  const autoLogout = () => {
    logout();
    // Show notification to user
    if (typeof window !== 'undefined') {
      alert('Your session has expired due to inactivity. Please log in again.');
      // Reload page to redirect to login
      window.location.reload();
    }
  };
  
  // Check session on app start
  useEffect(() => {
    const initializeAuth = () => {
      const savedUser = localStorage.getItem('user');
      
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          
          // Check if session is still valid
          if (isSessionValid()) {
            setUser(userData);
            resetInactivityTimer();
            
            // Set up periodic session validation
            sessionCheckTimer.current = setInterval(() => {
              if (!isSessionValid()) {
                autoLogout();
              }
            }, 60000);
          } else {
            // Session expired, clear everything
            logout();
          }
        } catch (error) {
          // Invalid user data, clear storage
          logout();
        }
      }
      
      setLoading(false);
    };
    
    initializeAuth();
  }, []);

  const isAuthenticated = () => {
    return user !== null && isSessionValid();
  };

  const isAdmin = () => {
    return user && user.isAdmin === true && isSessionValid();
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;