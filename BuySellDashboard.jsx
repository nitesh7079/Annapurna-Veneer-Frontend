import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://annapurnaveneer.online/api/v1';

const BuySellDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [buyHistory, setBuyHistory] = useState([]);
  const [sellHistory, setSellHistory] = useState([]);
  const [buyPending, setBuyPending] = useState([]);
  const [sellPending, setSellPending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1
  });
  const [filters, setFilters] = useState({
    itemName: '',
    name: ''
  });

  // Fetch Dashboard Summary
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/buySell/dashboard`);
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Buy History
  const fetchBuyHistory = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.itemName && { itemName: filters.itemName }),
        ...(filters.name && { name: filters.name })
      });
      
      const response = await axios.get(`${API_BASE_URL}/buySell/buy/history?${params}`);
      setBuyHistory(response.data.data);
      setPagination(prev => ({
        ...prev,
        page: response.data.pagination.currentPage,
        totalPages: response.data.pagination.totalPages
      }));
    } catch (error) {
      console.error('Error fetching buy history:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Sell History
  const fetchSellHistory = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.itemName && { itemName: filters.itemName }),
        ...(filters.name && { name: filters.name })
      });
      
      const response = await axios.get(`${API_BASE_URL}/buySell/sell/history?${params}`);
      setSellHistory(response.data.data);
      setPagination(prev => ({
        ...prev,
        page: response.data.pagination.currentPage,
        totalPages: response.data.pagination.totalPages
      }));
    } catch (error) {
      console.error('Error fetching sell history:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Buy Pending
  const fetchBuyPending = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.itemName && { itemName: filters.itemName }),
        ...(filters.name && { name: filters.name })
      });
      
      const response = await axios.get(`${API_BASE_URL}/buySell/buy/pending?${params}`);
      setBuyPending(response.data.data);
      setPagination(prev => ({
        ...prev,
        page: response.data.pagination.currentPage,
        totalPages: response.data.pagination.totalPages
      }));
    } catch (error) {
      console.error('Error fetching buy pending:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Sell Pending
  const fetchSellPending = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.itemName && { itemName: filters.itemName }),
        ...(filters.name && { name: filters.name })
      });
      
      const response = await axios.get(`${API_BASE_URL}/buySell/sell/pending?${params}`);
      setSellPending(response.data.data);
      setPagination(prev => ({
        ...prev,
        page: response.data.pagination.currentPage,
        totalPages: response.data.pagination.totalPages
      }));
    } catch (error) {
      console.error('Error fetching sell pending:', error);
    } finally {
      setLoading(false);
    }
  };

  // Confirm Payment
  const confirmPayment = async (id, amount = null) => {
    try {
      const payload = {};
      if (amount) payload.amount = amount;
      
      await axios.patch(`${API_BASE_URL}/buySell/confirm-payment/${id}`, payload);
      
      // Refresh current data
      if (activeTab === 'buyPending') fetchBuyPending(pagination.page);
      if (activeTab === 'sellPending') fetchSellPending(pagination.page);
      
      alert('Payment confirmed successfully!');
    } catch (error) {
      console.error('Error confirming payment:', error);
      alert('Error confirming payment');
    }
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPagination(prev => ({ ...prev, page: 1 }));
    setFilters({ itemName: '', name: '' });
    
    switch (tab) {
      case 'dashboard':
        fetchDashboard();
        break;
      case 'buyHistory':
        fetchBuyHistory(1);
        break;
      case 'sellHistory':
        fetchSellHistory(1);
        break;
      case 'buyPending':
        fetchBuyPending(1);
        break;
      case 'sellPending':
        fetchSellPending(1);
        break;
      default:
        break;
    }
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    setFilters(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Apply filters
  const applyFilters = () => {
    switch (activeTab) {
      case 'buyHistory':
        fetchBuyHistory(1);
        break;
      case 'sellHistory':
        fetchSellHistory(1);
        break;
      case 'buyPending':
        fetchBuyPending(1);
        break;
      case 'sellPending':
        fetchSellPending(1);
        break;
      default:
        break;
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    switch (activeTab) {
      case 'buyHistory':
        fetchBuyHistory(newPage);
        break;
      case 'sellHistory':
        fetchSellHistory(newPage);
        break;
      case 'buyPending':
        fetchBuyPending(newPage);
        break;
      case 'sellPending':
        fetchSellPending(newPage);
        break;
      default:
        break;
    }
  };

  // Initialize dashboard on component mount
  useEffect(() => {
    fetchDashboard();
  }, []);

  // Render Dashboard Summary
  const renderDashboard = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Business Dashboard</h2>
      
      {dashboardData && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800">Buy History</h3>
              <p className="text-2xl font-bold text-green-600">{dashboardData.buyHistory.count}</p>
              <p className="text-sm text-green-600">₹{dashboardData.buyHistory.totalAmount.toLocaleString('en-IN')}</p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800">Sell History</h3>
              <p className="text-2xl font-bold text-blue-600">{dashboardData.sellHistory.count}</p>
              <p className="text-sm text-blue-600">₹{dashboardData.sellHistory.totalAmount.toLocaleString('en-IN')}</p>
            </div>
            
            <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
              <h3 className="text-lg font-semibold text-orange-800">Buy Pending</h3>
              <p className="text-2xl font-bold text-orange-600">{dashboardData.buyPending.count}</p>
              <p className="text-sm text-orange-600">₹{dashboardData.buyPending.pendingAmount.toLocaleString('en-IN')}</p>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-800">Sell Pending</h3>
              <p className="text-2xl font-bold text-purple-600">{dashboardData.sellPending.count}</p>
              <p className="text-sm text-purple-600">₹{dashboardData.sellPending.pendingAmount.toLocaleString('en-IN')}</p>
            </div>
          </div>

          {/* Overall Summary */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Overall Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Transactions</p>
                <p className="text-xl font-bold">{dashboardData.summary.totalTransactions}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Profit/Loss</p>
                <p className={`text-xl font-bold ${dashboardData.summary.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{dashboardData.summary.profitLoss.toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Pending Amount</p>
                <p className="text-xl font-bold text-orange-600">₹{dashboardData.summary.totalPendingAmount.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  // Render Filters
  const renderFilters = () => (
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          name="itemName"
          placeholder="Filter by item name..."
          value={filters.itemName}
          onChange={handleFilterChange}
          className="px-3 py-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          name="name"
          placeholder="Filter by customer name..."
          value={filters.name}
          onChange={handleFilterChange}
          className="px-3 py-2 border border-gray-300 rounded-md"
        />
        <button
          onClick={applyFilters}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );

  // Render Transaction Table
  const renderTransactionTable = (data, showPendingActions = false) => (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border-b">Date</th>
            <th className="px-4 py-2 border-b">Customer</th>
            <th className="px-4 py-2 border-b">Item</th>
            <th className="px-4 py-2 border-b">Quantity</th>
            <th className="px-4 py-2 border-b">Amount</th>
            <th className="px-4 py-2 border-b">Status</th>
            {showPendingActions && <th className="px-4 py-2 border-b">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((transaction) => (
            <tr key={transaction._id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b">
                {new Date(transaction.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 border-b">{transaction.name}</td>
              <td className="px-4 py-2 border-b">{transaction.itemName}</td>
              <td className="px-4 py-2 border-b">{transaction.quantity}</td>
              <td className="px-4 py-2 border-b">₹{transaction.amount.toLocaleString('en-IN')}</td>
              <td className="px-4 py-2 border-b">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  transaction.paymentStatus === 'Confirmed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-orange-100 text-orange-800'
                }`}>
                  {transaction.paymentStatus}
                </span>
              </td>
              {showPendingActions && (
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => confirmPayment(transaction._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                  >
                    Confirm Payment
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Render Pagination
  const renderPagination = () => (
    <div className="flex justify-center items-center space-x-2 mt-6">
      <button
        onClick={() => handlePageChange(pagination.page - 1)}
        disabled={pagination.page === 1}
        className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50"
      >
        Previous
      </button>
      
      <span className="px-4 py-2">
        Page {pagination.page} of {pagination.totalPages}
      </span>
      
      <button
        onClick={() => handlePageChange(pagination.page + 1)}
        disabled={pagination.page === pagination.totalPages}
        className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Navigation Tabs */}
      <div className="mb-8">
        <nav className="flex space-x-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'buyHistory', label: 'Buy History', icon: '📈' },
            { id: 'sellHistory', label: 'Sell History', icon: '📊' },
            { id: 'buyPending', label: 'Buy Pending', icon: '⏳' },
            { id: 'sellPending', label: 'Sell Pending', icon: '⌛' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {!loading && (
          <>
            {activeTab === 'dashboard' && renderDashboard()}
            
            {activeTab === 'buyHistory' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-green-800">Buy History</h2>
                {renderFilters()}
                {renderTransactionTable(buyHistory)}
                {renderPagination()}
              </div>
            )}
            
            {activeTab === 'sellHistory' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-blue-800">Sell History</h2>
                {renderFilters()}
                {renderTransactionTable(sellHistory)}
                {renderPagination()}
              </div>
            )}
            
            {activeTab === 'buyPending' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-orange-800">Buy Pending</h2>
                {renderFilters()}
                {renderTransactionTable(buyPending, true)}
                {renderPagination()}
              </div>
            )}
            
            {activeTab === 'sellPending' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-purple-800">Sell Pending</h2>
                {renderFilters()}
                {renderTransactionTable(sellPending, true)}
                {renderPagination()}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BuySellDashboard;