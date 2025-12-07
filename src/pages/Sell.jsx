import React, { useState, useEffect } from 'react';
import { sellAPI, bankAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

function Sell() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentHistoryModal, setShowPaymentHistoryModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedCustomers, setExpandedCustomers] = useState({});
  
  // Filter states
  const [filters, setFilters] = useState({
    customerName: '',
    dateFrom: '',
    dateTo: '',
  });

  const [formData, setFormData] = useState({
    CustomerName: '',
    ItemName: '',
    Under: '',
    Quantity: '',
    Amount: '',
    VatAmount: '',
    BillNumber: '',
    CustomCharges: '',
    PhoneNumber: '',
    VehicleNumber: '',
    PaymentStatus: 'Pending',
    PaymentDeadline: '',
    ModeofPayment: '',
    DeliveryAddress: '',
  });

  const [customerSuggestions, setCustomerSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [paymentCustomerSuggestions, setPaymentCustomerSuggestions] = useState([]);
  const [showPaymentSuggestions, setShowPaymentSuggestions] = useState(false);
  const [banks, setBanks] = useState([]);

  const [paymentData, setPaymentData] = useState({
    CustomerName: '',
    paymentAmount: '',
    ModeofPayment: '',
  });

  useEffect(() => {
    fetchOrders();
    fetchBanks();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await sellAPI.getAll();
      setOrders(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch sell orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchBanks = async () => {
    try {
      const response = await bankAPI.getAll();
      console.log('Banks fetched:', response.data);
      setBanks(response.data || []);
    } catch (err) {
      console.error('Failed to fetch banks:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Clear ModeofPayment when PaymentStatus changes to Pending
    // Clear PaymentDeadline when PaymentStatus changes to Confirmed
    const updatedFormData = { ...formData, [name]: value };
    if (name === 'PaymentStatus' && value === 'Pending') {
      updatedFormData.ModeofPayment = '';
    }
    if (name === 'PaymentStatus' && value === 'Confirmed') {
      updatedFormData.PaymentDeadline = '';
    }
    
    setFormData(updatedFormData);

    // Auto-fill customer details when typing customer name
    if (name === 'CustomerName' && value.length > 0) {
      const matches = orders.filter(order => 
        order.CustomerName.toLowerCase().includes(value.toLowerCase())
      );
      
      const uniqueCustomers = [];
      const seenNames = new Set();
      
      matches.forEach(order => {
        if (!seenNames.has(order.CustomerName)) {
          seenNames.add(order.CustomerName);
          uniqueCustomers.push(order);
        }
      });

      setCustomerSuggestions(uniqueCustomers);
      setShowSuggestions(uniqueCustomers.length > 0);
    } else if (name === 'CustomerName') {
      setShowSuggestions(false);
      setCustomerSuggestions([]);
    }
  };

  const selectCustomer = (customer) => {
    setFormData({
      ...formData,
      CustomerName: customer.CustomerName,
      PhoneNumber: customer.PhoneNumber || '',
      DeliveryAddress: customer.DeliveryAddress || ''
    });
    setShowSuggestions(false);
    setCustomerSuggestions([]);
  };

  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({ ...paymentData, [name]: value });

    if (name === 'CustomerName' && value.length > 0) {
      const filtered = orders.filter(order => 
        order.CustomerName.toLowerCase().includes(value.toLowerCase())
      );
      
      const uniqueCustomers = Array.from(
        new Map(filtered.map(order => [order.CustomerName, order])).values()
      );
      setPaymentCustomerSuggestions(uniqueCustomers);
      setShowPaymentSuggestions(true);
    } else {
      setPaymentCustomerSuggestions([]);
      setShowPaymentSuggestions(false);
    }
  };

  const selectPaymentCustomer = (customer) => {
    setPaymentData({
      ...paymentData,
      CustomerName: customer.CustomerName
    });
    setShowPaymentSuggestions(false);
    setPaymentCustomerSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await sellAPI.create(formData);
      setSuccess(response.message || 'Sell order created successfully!');
      setShowAddModal(false);
      setFormData({
        CustomerName: '',
        ItemName: '',
        Under: '',
        Quantity: '',
        Amount: '',
        VatAmount: '',
        BillNumber: '',
        CustomCharges: '',
        PhoneNumber: '',
        VehicleNumber: '',
        PaymentStatus: 'Pending',
        PaymentDeadline: '',
        ModeofPayment: '',
        DeliveryAddress: '',
      });
      fetchOrders();
    } catch (err) {
      setError(err.message || 'Failed to create sell order');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await sellAPI.applyPayment(paymentData);
      setSuccess(response.message || 'Payment applied successfully!');
      setShowPaymentModal(false);
      setPaymentData({ CustomerName: '', paymentAmount: '', ModeofPayment: '' });
      fetchOrders();
    } catch (err) {
      setError(err.message || 'Failed to apply payment');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPaid = (payments) => {
    return payments.reduce((sum, payment) => sum + payment.amount, 0);
  };

  const openPaymentModal = (order) => {
    setSelectedOrder(order);
    setPaymentData({
      CustomerName: order.CustomerName,
      paymentAmount: '',
      ModeofPayment: 'Cash'
    });
    setShowPaymentModal(true);
  };

  const viewPaymentHistory = (order) => {
    setSelectedOrder(order);
    setShowPaymentHistoryModal(true);
  };

  const toggleCustomer = (customerName) => {
    setExpandedCustomers(prev => ({
      ...prev,
      [customerName]: !prev[customerName]
    }));
  };

  const clearFilters = () => {
    setFilters({
      customerName: '',
      dateFrom: '',
      dateTo: '',
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const groupOrdersByCustomer = () => {
    const grouped = {};
    
    // Apply filters
    const filteredOrders = orders.filter(order => {
      // Filter by customer name
      if (filters.customerName && !order.CustomerName.toLowerCase().includes(filters.customerName.toLowerCase())) {
        return false;
      }
      
      // Filter by date range
      if (filters.dateFrom || filters.dateTo) {
        const orderDate = new Date(order.createdAt);
        if (filters.dateFrom && orderDate < new Date(filters.dateFrom)) {
          return false;
        }
        if (filters.dateTo && orderDate > new Date(filters.dateTo + 'T23:59:59')) {
          return false;
        }
      }
      
      return true;
    });

    // Group by customer
    filteredOrders.forEach(order => {
      if (!grouped[order.CustomerName]) {
        grouped[order.CustomerName] = [];
      }
      grouped[order.CustomerName].push(order);
    });

    return grouped;
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
      {/* Header Section with Wood Theme */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 rounded-2xl shadow-2xl p-8 mb-8 border-4 border-amber-700">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="bg-amber-100 p-4 rounded-xl shadow-lg">
              <svg className="w-12 h-12 text-amber-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-amber-50 tracking-wide drop-shadow-lg">Sell Dashboard</h1>
              <p className="text-amber-200 mt-1 text-sm">Shyam Veneer - Premium Plywood</p>
            </div>
          </div>
          <div className="space-x-3">
            <button
              onClick={() => setShowPaymentModal(true)}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border-2 border-green-500"
            >
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Payment
              </span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-8 py-3 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border-2 border-amber-500"
            >
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Sell Order
              </span>
            </button>
          </div>
        </div>
      </div>

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

      {success && (
        <div className="bg-green-50 border-l-4 border-green-600 text-green-800 px-6 py-4 rounded-lg mb-4 shadow-lg">
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {success}
          </div>
        </div>
      )}

      {/* Filter Section with Wood Theme */}
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border-4 border-amber-200">
        <h2 className="text-2xl font-bold mb-6 text-amber-900 flex items-center">
          <svg className="w-7 h-7 mr-3 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search & Filter Orders
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-semibold text-amber-900 mb-2">Customer Name</label>
            <input
              type="text"
              name="customerName"
              value={filters.customerName}
              onChange={handleFilterChange}
              placeholder="Search by name..."
              className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-amber-900 mb-2">Date From</label>
            <input
              type="date"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleFilterChange}
              className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-amber-900 mb-2">Date To</label>
            <input
              type="date"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleFilterChange}
              className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white shadow-sm"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {loading && <LoadingSpinner />}

      {/* Orders Table with Wood Theme */}
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border-4 border-amber-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y-2 divide-amber-200">
            <thead className="bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-amber-50 uppercase tracking-wider border-r border-amber-600">Order#</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-amber-50 uppercase tracking-wider border-r border-amber-600">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-amber-50 uppercase tracking-wider border-r border-amber-600">Item</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-amber-50 uppercase tracking-wider border-r border-amber-600">Under</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-amber-50 uppercase tracking-wider border-r border-amber-600">Quantity</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-amber-50 uppercase tracking-wider border-r border-amber-600">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-amber-50 uppercase tracking-wider border-r border-amber-600">VAT Amount</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-amber-50 uppercase tracking-wider border-r border-amber-600">Bill#</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-amber-50 uppercase tracking-wider border-r border-amber-600">Custom Charges</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-amber-50 uppercase tracking-wider border-r border-amber-600">Phone</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-amber-50 uppercase tracking-wider border-r border-amber-600">Vehicle</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-amber-50 uppercase tracking-wider border-r border-amber-600">Payment Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-amber-50 uppercase tracking-wider border-r border-amber-600">Payment Deadline</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-amber-50 uppercase tracking-wider border-r border-amber-600">Mode of Payment</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-amber-50 uppercase tracking-wider border-r border-amber-600">Delivery Address</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-amber-50 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y-2 divide-amber-100">
              {Object.keys(groupOrdersByCustomer()).length === 0 ? (
                <tr>
                  <td colSpan="16" className="px-6 py-4 text-center text-gray-500">
                    No sell orders found
                  </td>
                </tr>
              ) : (
                Object.entries(groupOrdersByCustomer()).map(([customerName, customerOrders]) => {
                  const isExpanded = expandedCustomers[customerName];
                  const totalOrders = customerOrders.length;
                  const totalAmount = customerOrders.reduce((sum, order) => sum + order.Amount, 0);
                  const totalPaidAmount = customerOrders.reduce((sum, order) => {
                    return sum + calculateTotalPaid(order.Payments || []);
                  }, 0);
                  const totalDue = totalAmount - totalPaidAmount;
                  const allConfirmed = customerOrders.every(order => order.PaymentStatus === 'Confirmed');

                  return (
                    <React.Fragment key={customerName}>
                      {/* Customer Summary Row */}
                      <tr 
                        onClick={() => toggleCustomer(customerName)}
                        className="bg-blue-50 hover:bg-blue-100 cursor-pointer font-semibold"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="flex items-center">
                            {isExpanded ? '▼' : '▶'} 
                            <span className="ml-2">{totalOrders} orders</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customerName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{totalAmount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            allConfirmed 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {allConfirmed ? 'All Confirmed' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <span className="text-gray-500">Summary</span>
                        </td>
                      </tr>

                      {/* Individual Orders - Only show when expanded */}
                      {isExpanded && customerOrders.map((order) => {
                        const totalPaid = calculateTotalPaid(order.Payments || []);
                        const dueAmount = order.Amount - totalPaid;
                        return (
                          <tr key={order._id} className="hover:bg-gray-50 bg-white">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 pl-12">{order.OrderNumber}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">└─ {order.CustomerName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.ItemName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.Under || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.Quantity}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{order.Amount}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{order.VatAmount || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.BillNumber || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{order.CustomCharges || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.PhoneNumber || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.VehicleNumber || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                order.PaymentStatus === 'Confirmed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {order.PaymentStatus}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {order.PaymentDeadline ? new Date(order.PaymentDeadline).toLocaleDateString() : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.ModeofPayment || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.DeliveryAddress || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              <button
                                onClick={() => openPaymentModal(order)}
                                className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded text-xs"
                              >
                                Add Payment
                              </button>
                              <button
                                onClick={() => viewPaymentHistory(order)}
                                className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-2 py-1 rounded text-xs"
                                title="View payment history"
                              >
                                Payments ({order.Payments?.length || 0})
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Sell Order Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Add Sell Order</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
                <input
                  type="text"
                  name="CustomerName"
                  value={formData.CustomerName}
                  onChange={handleInputChange}
                  onFocus={() => formData.CustomerName && setShowSuggestions(customerSuggestions.length > 0)}
                  required
                  autoComplete="off"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                {/* Customer Suggestions Dropdown */}
                {showSuggestions && customerSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto">
                    {customerSuggestions.map((customer, index) => (
                      <div
                        key={index}
                        onClick={() => selectCustomer(customer)}
                        className="px-3 py-2 cursor-pointer hover:bg-gray-100 border-b border-gray-100"
                      >
                        <div className="font-medium">{customer.CustomerName}</div>
                        {customer.PhoneNumber && (
                          <div className="text-sm text-gray-500">{customer.PhoneNumber}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
                <select
                  name="ItemName"
                  value={formData.ItemName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Item Name</option>
                  <option value="2.5mm Core">2.5mm Core</option>
                  <option value="2.5mm Fali">2.5mm Fali</option>
                  <option value="1.8mm Core">1.8mm Core</option>
                  <option value="1.8mm Fali">1.8mm Fali</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Under</label>
                <select
                  name="Under"
                  value={formData.Under}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Category</option>
                  <option value="Bank Accounts">Bank Accounts</option>
                  <option value="Bank OCC A/c">Bank OCC A/c</option>
                  <option value="Bank OD A/c">Bank OD A/c</option>
                  <option value="Branch/Divisions">Branch/Divisions</option>
                  <option value="Capital Account">Capital Account</option>
                  <option value="Cash-in-hand">Cash-in-hand</option>
                  <option value="Current Assets">Current Assets</option>
                  <option value="Current Liabilities">Current Liabilities</option>
                  <option value="Deposits (Asset)">Deposits (Asset)</option>
                  <option value="Direct Expenses">Direct Expenses</option>
                  <option value="Direct Incomes">Direct Incomes</option>
                  <option value="Duties & Taxes">Duties & Taxes</option>
                  <option value="Expenses (Direct)">Expenses (Direct)</option>
                  <option value="Expenses (Indirect)">Expenses (Indirect)</option>
                  <option value="Fixed Assets">Fixed Assets</option>
                  <option value="Income (Direct)">Income (Direct)</option>
                  <option value="Income (Indirect)">Income (Indirect)</option>
                  <option value="Indirect Expenses">Indirect Expenses</option>
                  <option value="Indirect Incomes">Indirect Incomes</option>
                  <option value="Investments">Investments</option>
                  <option value="Loans & Advances (Asset)">Loans & Advances (Asset)</option>
                  <option value="Loans (Liability)">Loans (Liability)</option>
                  <option value="Misc. Expenses (ASSET)">Misc. Expenses (ASSET)</option>
                  <option value="Provisions">Provisions</option>
                  <option value="Purchase Accounts">Purchase Accounts</option>
                  <option value="Reserves & Surplus">Reserves & Surplus</option>
                  <option value="Retained Earnings">Retained Earnings</option>
                  <option value="Sales Accounts">Sales Accounts</option>
                  <option value="Secured Loans">Secured Loans</option>
                  <option value="Stock-in-hand">Stock-in-hand</option>
                  <option value="Sundry Creditors">Sundry Creditors</option>
                  <option value="Sundry Debitors">Sundry Debitors</option>
                  <option value="Suspense A/c">Suspense A/c</option>
                  <option value="Unsecured Loans">Unsecured Loans</option>
                  <option value="VAT A/C">VAT A/C</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                <input
                  type="number"
                  name="Quantity"
                  value={formData.Quantity}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
                <input
                  type="number"
                  name="Amount"
                  value={formData.Amount}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">VAT Amount</label>
                <input
                  type="number"
                  name="VatAmount"
                  value={formData.VatAmount}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bill Number</label>
                <input
                  type="text"
                  name="BillNumber"
                  value={formData.BillNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Custom Charges</label>
                <input
                  type="number"
                  name="CustomCharges"
                  value={formData.CustomCharges}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="PhoneNumber"
                  value={formData.PhoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number</label>
                <input
                  type="text"
                  name="VehicleNumber"
                  value={formData.VehicleNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mode of Payment</label>
                <select
                  name="ModeofPayment"
                  value={formData.ModeofPayment}
                  onChange={handleInputChange}
                  disabled={formData.PaymentStatus === 'Pending'}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formData.PaymentStatus === 'Pending' ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
                  }`}
                >
                  <option value="">Select Payment Mode</option>
                  {formData.PaymentStatus === 'Confirmed' && (
                    <>
                      {banks.filter(bank => bank.isActive).map((bank) => (
                        <option key={bank._id} value={bank.bankName}>
                          {bank.bankName}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                <select
                  name="PaymentStatus"
                  value={formData.PaymentStatus}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Deadline</label>
                <input
                  type="datetime-local"
                  name="PaymentDeadline"
                  value={formData.PaymentDeadline}
                  onChange={handleInputChange}
                  disabled={formData.PaymentStatus === 'Confirmed'}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formData.PaymentStatus === 'Confirmed' ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
                  }`}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                <textarea
                  name="DeliveryAddress"
                  value={formData.DeliveryAddress}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="col-span-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Sell Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Add Payment</h2>
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
                <input
                  type="text"
                  name="CustomerName"
                  value={paymentData.CustomerName}
                  onChange={handlePaymentInputChange}
                  required
                  autoComplete="off"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                {/* Payment Customer Suggestions Dropdown */}
                {showPaymentSuggestions && paymentCustomerSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto">
                    {paymentCustomerSuggestions.map((customer, index) => (
                      <div
                        key={index}
                        onClick={() => selectPaymentCustomer(customer)}
                        className="px-3 py-2 cursor-pointer hover:bg-gray-100 border-b border-gray-100"
                      >
                        <div className="font-medium">{customer.CustomerName}</div>
                        <div className="text-sm text-gray-500">Balance: ₹{customer.Amount - calculateTotalPaid(customer.Payments || [])}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Amount *</label>
                <input
                  type="number"
                  name="paymentAmount"
                  value={paymentData.paymentAmount}
                  onChange={handlePaymentInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mode of Payment *</label>
                <select
                  name="ModeofPayment"
                  value={paymentData.ModeofPayment}
                  onChange={handlePaymentInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Payment Mode</option>
                  {banks.filter(bank => bank.isActive).map((bank) => (
                    <option key={bank._id} value={bank.bankName}>
                      {bank.bankName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment History Modal */}
      {showPaymentHistoryModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Payment History</h2>
              <button
                onClick={() => setShowPaymentHistoryModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="mb-4 p-4 bg-gray-50 rounded">
              <div className="grid grid-cols-2 gap-4">
                <div><span className="font-medium">Customer:</span> {selectedOrder.CustomerName}</div>
                <div><span className="font-medium">Order Number:</span> {selectedOrder.OrderNumber}</div>
                <div><span className="font-medium">Item:</span> {selectedOrder.ItemName}</div>
                <div><span className="font-medium">Total Amount:</span> ₹{selectedOrder.Amount}</div>
                <div><span className="font-medium">Amount Paid:</span> ₹{calculateTotalPaid(selectedOrder.Payments || [])}</div>
                <div><span className="font-medium">Amount Due:</span> ₹{selectedOrder.Amount - calculateTotalPaid(selectedOrder.Payments || [])}</div>
              </div>
            </div>
            
            {selectedOrder.Payments && selectedOrder.Payments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mode of Payment</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedOrder.Payments.map((payment, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">₹{payment.amount}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{payment.ModeofPayment}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No payments recorded</p>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default Sell;