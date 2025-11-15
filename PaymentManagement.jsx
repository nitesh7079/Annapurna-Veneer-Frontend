import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://shyam-veneer-backend.onrender.com/api/v1';

const PaymentManagement = () => {
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [partialPaymentData, setPartialPaymentData] = useState({
    paymentAmount: '',
    customerName: '',
    modeOfPayment: 'Cash'
  });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    transactionType: '',
    itemName: '',
    name: ''
  });

  // Fetch all pending transactions
  const fetchPendingTransactions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/buySell`, {
        params: {
          transactionType: filters.transactionType || undefined,
          itemName: filters.itemName || undefined,
          name: filters.name || undefined,
          limit: 100 // Get more records for payment management
        }
      });
      
      // Filter only pending transactions
      const pending = response.data.data.filter(t => t.paymentStatus === 'Pending');
      setPendingTransactions(pending);
    } catch (error) {
      console.error('Error fetching pending transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle transaction selection
  const handleTransactionSelect = (transactionId) => {
    setSelectedTransactions(prev => {
      if (prev.includes(transactionId)) {
        return prev.filter(id => id !== transactionId);
      } else {
        return [...prev, transactionId];
      }
    });
  };

  // Select all transactions
  const selectAllTransactions = () => {
    const allIds = pendingTransactions.map(t => t._id);
    setSelectedTransactions(allIds);
  };

  // Clear all selections
  const clearAllSelections = () => {
    setSelectedTransactions([]);
  };

  // Calculate total pending amount for selected transactions
  const calculateSelectedTotal = () => {
    return selectedTransactions.reduce((total, id) => {
      const transaction = pendingTransactions.find(t => t._id === id);
      if (transaction) {
        return total + (transaction.amount - (transaction.paidAmount || 0));
      }
      return total;
    }, 0);
  };

  // Handle partial payment
  const handlePartialPayment = async () => {
    if (selectedTransactions.length === 0) {
      alert('Please select at least one transaction');
      return;
    }

    if (!partialPaymentData.paymentAmount || partialPaymentData.paymentAmount <= 0) {
      alert('Please enter a valid payment amount');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/buySell/partial-payment`, {
        transactionIds: selectedTransactions,
        paymentAmount: parseFloat(partialPaymentData.paymentAmount),
        customerName: partialPaymentData.customerName,
        modeOfPayment: partialPaymentData.modeOfPayment
      });

      alert(`Partial payment of ₹${partialPaymentData.paymentAmount} applied successfully!`);
      
      // Reset form and selections
      setPartialPaymentData({
        paymentAmount: '',
        customerName: '',
        modeOfPayment: 'Cash'
      });
      setSelectedTransactions([]);
      
      // Refresh transactions
      fetchPendingTransactions();
      
    } catch (error) {
      console.error('Error processing partial payment:', error);
      alert('Error processing payment: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Confirm individual payment
  const confirmSinglePayment = async (transactionId, fullAmount = null) => {
    try {
      setLoading(true);
      const payload = {};
      if (fullAmount) payload.amount = fullAmount;

      await axios.patch(`${API_BASE_URL}/buySell/confirm-payment/${transactionId}`, payload);
      
      alert('Payment confirmed successfully!');
      fetchPendingTransactions();
      
    } catch (error) {
      console.error('Error confirming payment:', error);
      alert('Error confirming payment: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
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
    fetchPendingTransactions();
  };

  useEffect(() => {
    fetchPendingTransactions();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Payment Management</h2>
        
        {/* Filters */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              name="transactionType"
              value={filters.transactionType}
              onChange={handleFilterChange}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All Transaction Types</option>
              <option value="Buy">Buy</option>
              <option value="Sell">Sell</option>
            </select>
            
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

        {/* Selection Summary */}
        {pendingTransactions.length > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Transaction Selection</h3>
              <div className="space-x-2">
                <button
                  onClick={selectAllTransactions}
                  className="bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600"
                >
                  Select All
                </button>
                <button
                  onClick={clearAllSelections}
                  className="bg-gray-500 text-white px-3 py-2 rounded text-sm hover:bg-gray-600"
                >
                  Clear All
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Selected Transactions</p>
                <p className="text-xl font-bold">{selectedTransactions.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Pending Amount</p>
                <p className="text-xl font-bold text-orange-600">₹{calculateSelectedTotal().toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Transactions</p>
                <p className="text-xl font-bold">{pendingTransactions.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* Partial Payment Form */}
        {selectedTransactions.length > 0 && (
          <div className="bg-green-50 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-4">Process Partial Payment</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="number"
                placeholder="Payment Amount"
                value={partialPaymentData.paymentAmount}
                onChange={(e) => setPartialPaymentData(prev => ({
                  ...prev,
                  paymentAmount: e.target.value
                }))}
                className="px-3 py-2 border border-gray-300 rounded-md"
                min="0"
                step="0.01"
              />
              
              <input
                type="text"
                placeholder="Customer Name (Optional)"
                value={partialPaymentData.customerName}
                onChange={(e) => setPartialPaymentData(prev => ({
                  ...prev,
                  customerName: e.target.value
                }))}
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
              
              <select
                value={partialPaymentData.modeOfPayment}
                onChange={(e) => setPartialPaymentData(prev => ({
                  ...prev,
                  modeOfPayment: e.target.value
                }))}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
              </select>
              
              <button
                onClick={handlePartialPayment}
                disabled={loading || selectedTransactions.length === 0}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:opacity-50"
              >
                Process Payment
              </button>
            </div>
          </div>
        )}

        {/* Transactions Table */}
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border-b">
                    <input
                      type="checkbox"
                      checked={selectedTransactions.length === pendingTransactions.length && pendingTransactions.length > 0}
                      onChange={() => {
                        if (selectedTransactions.length === pendingTransactions.length) {
                          clearAllSelections();
                        } else {
                          selectAllTransactions();
                        }
                      }}
                    />
                  </th>
                  <th className="px-4 py-2 border-b text-left">Date</th>
                  <th className="px-4 py-2 border-b text-left">Type</th>
                  <th className="px-4 py-2 border-b text-left">Customer</th>
                  <th className="px-4 py-2 border-b text-left">Item</th>
                  <th className="px-4 py-2 border-b text-left">Total Amount</th>
                  <th className="px-4 py-2 border-b text-left">Paid Amount</th>
                  <th className="px-4 py-2 border-b text-left">Pending Amount</th>
                  <th className="px-4 py-2 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingTransactions.map((transaction) => {
                  const pendingAmount = transaction.amount - (transaction.paidAmount || 0);
                  return (
                    <tr key={transaction._id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b">
                        <input
                          type="checkbox"
                          checked={selectedTransactions.includes(transaction._id)}
                          onChange={() => handleTransactionSelect(transaction._id)}
                        />
                      </td>
                      <td className="px-4 py-2 border-b">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 border-b">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          transaction.transactionType === 'Buy' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {transaction.transactionType}
                        </span>
                      </td>
                      <td className="px-4 py-2 border-b">{transaction.name}</td>
                      <td className="px-4 py-2 border-b">{transaction.itemName}</td>
                      <td className="px-4 py-2 border-b">₹{transaction.amount.toLocaleString()}</td>
                      <td className="px-4 py-2 border-b">₹{(transaction.paidAmount || 0).toLocaleString()}</td>
                      <td className="px-4 py-2 border-b font-semibold text-orange-600">
                        ₹{pendingAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-2 border-b">
                        <button
                          onClick={() => confirmSinglePayment(transaction._id)}
                          className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 mr-2"
                        >
                          Confirm Full Payment
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {pendingTransactions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No pending transactions found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentManagement;