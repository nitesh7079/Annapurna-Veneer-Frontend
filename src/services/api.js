import axios from 'axios';

const getApiUrl = () => {
  // Shyam Veneer - Use deployed backend by default. Change here if you want a different base.
  const deployed = 'https://shyam-veneer-backend.onrender.com/api/v1';
  console.log('Shyam Veneer API - Using deployed backend:', deployed);
  return deployed;
};

// Shyam Veneer - Test API connectivity
const testApiConnectivity = async (apiUrl) => {
  try {
    const testUrl = apiUrl.replace('/api/v1', '/api/v1/accounts/balance');
    console.log('Shyam Veneer API - Testing connectivity to:', testUrl);
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(5000)
    });
    
    if (response.ok) {
      console.log('Shyam Veneer API - Connectivity test successful');
      return true;
    } else {
      console.error('Shyam Veneer API - Connectivity test failed with status:', response.status);
      return false;
    }
  } catch (error) {
    console.error('Shyam Veneer API - Connectivity test error:', error);
    return false;
  }
};

const apiUrl = getApiUrl();
console.log('Shyam Veneer - API URL being used:', apiUrl);
console.log('Shyam Veneer - Current hostname:', window.location.hostname);
console.log('Shyam Veneer - Current port:', window.location.port);

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
  withCredentials: false,
});

api.interceptors.request.use(
  (config) => {
    // Add JWT token and userId from localStorage to all requests
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    
    if (savedToken) {
      config.headers['Authorization'] = `Bearer ${savedToken}`;
      console.log('Shyam Veneer API - Added JWT token to request');
    }
    
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        console.log('Shyam Veneer API - User from localStorage:', user);
        if (user && user.id) {
          config.headers['x-user-id'] = user.id;
          console.log('Shyam Veneer API - Added x-user-id header:', user.id);
        }
      } catch (error) {
        console.error('Shyam Veneer API - Error parsing user from localStorage:', error);
      }
    }
    
    console.log('Shyam Veneer API - Request:', {
      url: config.baseURL + config.url,
      method: config.method,
      data: config.data,
      hasToken: !!savedToken,
      userId: config.headers['x-user-id']
    });
    return config;
  },
  (error) => {
    console.error('Shyam Veneer API - Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('Shyam Veneer API - Response:', response.data);
    return response;
  },
  (error) => {
    console.error('Shyam Veneer API - Response Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });
    return Promise.reject(error);
  }
);

// Shyam Veneer - User Authentication API
export const userAPI = {
  register: async (userData) => {
    try {
      const response = await api.post('/user/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/user/login', credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

// Shyam Veneer - Buy Orders API
export const buyAPI = {
  // Get all buy orders
  getAll: async () => {
    try {
      const response = await api.get('/buy');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch buy orders' };
    }
  },

  // Create new buy order
  create: async (buyData) => {
    try {
      const response = await api.post('/buy', buyData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create buy order' };
    }
  },

  // Apply payment to buy orders
  applyPayment: async (paymentData) => {
    try {
      const response = await api.post('/buy/payments', paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to apply payment' };
    }
  },
};

// Shyam Veneer - Sell Orders API
export const sellAPI = {
  // Get all sell orders
  getAll: async () => {
    try {
      const response = await api.get('/sell');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch sell orders' };
    }
  },

  // Create new sell order
  create: async (sellData) => {
    try {
      const response = await api.post('/sell', sellData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create sell order' };
    }
  },

  // Apply payment to sell orders
  applyPayment: async (paymentData) => {
    try {
      const response = await api.post('/sell/payments', paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to apply payment' };
    }
  },
};

// Shyam Veneer - Buy/Sell API (kept for backward compatibility with BuySell.jsx and Reports.jsx)
export const buySellAPI = {
  // Get all buy/sell entries
  getAll: async () => {
    try {
      const response = await api.get('/buySell');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch data' };
    }
  },

  // Create new buy/sell entry
  create: async (buySellData) => {
    try {
      const response = await api.post('/buySell', buySellData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create entry' };
    }
  },
};

// Shyam Veneer - Account Management API
export const accountAPI = {
  // Get all transactions
  getAll: async (filters = {}) => {
    try {
      // Clean filters and build query parameters
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([key, value]) => value !== '' && value !== null && value !== undefined)
      );
      const queryParams = new URLSearchParams(cleanFilters).toString();
      const response = await api.get(`/accounts${queryParams ? '?' + queryParams : ''}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch transactions' };
    }
  },

  // Get latest transaction per person (case-sensitive, unique people only)
  getLatestPerPerson: async (filters = {}) => {
    try {
      console.log('Shyam Veneer API - Fetching latest transactions per person with filters:', filters);
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([key, value]) => value !== '' && value !== null && value !== undefined)
      );
      const queryParams = new URLSearchParams(cleanFilters).toString();
      const url = `/accounts/latest-per-person${queryParams ? '?' + queryParams : ''}`;
      console.log('Shyam Veneer API - URL for latest per person:', `${api.defaults.baseURL}${url}`);
      
      const response = await api.get(url);
      console.log('Shyam Veneer API - Latest per person response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Shyam Veneer API - Failed to fetch latest transactions per person:', error);
      
      // Enhanced error handling for cross-device access
      if (error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
        const currentHost = window.location.hostname;
        throw { 
          message: `Network error: Cannot connect to ${api.defaults.baseURL}. 
          Current device: ${currentHost}
          Please ensure:
          1. Backend server is running on port 3001
          2. Server is accessible from your WiFi network
          3. Both devices are on the same network` 
        };
      }
      
      if (error.response?.status === 0) {
        throw { 
          message: `Connection failed: Cannot reach server at ${api.defaults.baseURL}. 
          This usually happens when:
          1. Server is not running
          2. Different network/WiFi
          3. Firewall blocking connection
          4. Wrong IP address
          
          Try accessing: ${api.defaults.baseURL.replace('/api/v1', '')}/api/v1/accounts/balance directly in browser` 
        };
      }
      
      if (error.code === 'ECONNREFUSED') {
        throw { 
          message: `Server not running: The backend server is not responding on port 3001.
          Please start the server with: npm start` 
        };
      }
      
      throw error.response?.data || { message: 'Failed to fetch latest transactions per person' };
    }
  },

  // Create new transaction
  create: async (transactionData) => {
    try {
      console.log('Shyam Veneer API - Creating transaction:', transactionData);
      const response = await api.post('/accounts', transactionData);
      console.log('Shyam Veneer API - Transaction created:', response.data);
      return response.data;
    } catch (error) {
      console.error('Shyam Veneer API - Transaction error:', error);
      console.error('Shyam Veneer API - Error response:', error.response);
      
      if (error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
        throw { message: 'Network connection failed. Please check your internet connection.' };
      }
      
      if (error.response?.status === 0) {
        throw { message: 'Cannot connect to server. Please check if the server is running.' };
      }
      
      throw error.response?.data || { message: 'Failed to create transaction' };
    }
  },

  // Get current balance
  getBalance: async () => {
    try {
      const response = await api.get('/accounts/balance');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch balance' };
    }
  },

  // Get account summary
  getSummary: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await api.get(`/accounts/summary${queryParams ? '?' + queryParams : ''}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch summary' };
    }
  },

  // Delete transaction
  delete: async (id) => {
    try {
      const response = await api.delete(`/accounts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete transaction' };
    }
  },

  // Get pending payments
  getPendingPayments: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await api.get(`/accounts/pending/payments${queryParams ? '?' + queryParams : ''}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch pending payments' };
    }
  },

  // Confirm payment
  confirmPayment: async (transactionId, confirmedAmount) => {
    try {
      const response = await api.put(`/accounts/${transactionId}/confirm`, { confirmedAmount });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to confirm payment' };
    }
  },
};

// Shyam Veneer - Other Credit API
export const otherCreditAPI = {
  // Get all other credit transactions
  getAll: async () => {
    try {
      const response = await api.get('/otherCredit');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch other credit transactions' };
    }
  },

  // Add new other credit transaction
  add: async (creditData) => {
    try {
      const response = await api.post('/otherCredit', creditData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add other credit transaction' };
    }
  },

  // Add payment to other credit transaction
  addPayment: async (paymentData) => {
    try {
      const response = await api.post('/otherCredit/payments', paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add payment to other credit transaction' };
    }
  },
};

// Shyam Veneer - Other Debit API
export const otherDebitAPI = {
  // Get all other debit transactions
  getAll: async () => {
    try {
      const response = await api.get('/otherDebit');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch other debit transactions' };
    }
  },

  // Add new other debit transaction
  add: async (debitData) => {
    try {
      const response = await api.post('/otherDebit', debitData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add other debit transaction' };
    }
  },

  // Add payment to other debit transaction
  addPayment: async (paymentData) => {
    try {
      const response = await api.post('/otherDebit/payments', paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add payment to other debit transaction' };
    }
  },
};

// Shyam Veneer - Bank Management API
export const bankAPI = {
  // Get all banks
  getAll: async () => {
    try {
      const response = await api.get('/banks');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch banks' };
    }
  },

  // Get payment methods (Cash + all banks)
  getPaymentMethods: async () => {
    try {
      const response = await api.get('/banks/payment-methods');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch payment methods' };
    }
  },

  // Get bank transactions
  getBankTransactions: async (bankId) => {
    try {
      const response = await api.get(`/banks/${bankId}/transactions`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch bank transactions' };
    }
  },
};

// Shyam Veneer - Notification Management API
export const notificationAPI = {
  // Get all notifications
  getAll: async () => {
    try {
      const response = await api.get('/notifications/all');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch notifications' };
    }
  },

  // Get unread notifications
  getUnread: async () => {
    try {
      const response = await api.get('/notifications/unreaded');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch unread notifications' };
    }
  },

  // Create new notification
  create: async (notificationData) => {
    try {
      const response = await api.post('/notifications/newNotification', notificationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create notification' };
    }
  },

  // Mark notification as read
  markAsRead: async (id) => {
    try {
      const response = await api.put(`/notifications/markAsRead/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to mark notification as read' };
    }
  },

  // Manual check for overdue payments
  checkOverdue: async () => {
    try {
      const response = await api.post('/notifications/checkOverdue');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to check overdue payments' };
    }
  },
};

export default api;