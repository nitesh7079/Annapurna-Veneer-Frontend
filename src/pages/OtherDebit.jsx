import React, { useState, useEffect } from 'react';
import { bankAPI, otherDebitAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { downloadOtherDebitPDF, downloadOtherDebitExcel } from '../utils/downloadUtils';

function OtherDebit() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentHistoryModal, setShowPaymentHistoryModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedNames, setExpandedNames] = useState({});
  const [banks, setBanks] = useState([]);

  // Filter states
  const [filters, setFilters] = useState({
    name: '',
    dateFrom: '',
    dateTo: '',
    category: '',
  });

  const [formData, setFormData] = useState({
    Name: '',
    Amount: '',
    ModeofPayment: '',
    Category: 'Other',
    TransactionName: '',
    TransactionType: 'Debit',
    PaymentStatus: 'Pending',
    Description: '',
    OpeningBalance: '',
  });

  const [nameSuggestions, setNameSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [paymentNameSuggestions, setPaymentNameSuggestions] = useState([]);
  const [showPaymentSuggestions, setShowPaymentSuggestions] = useState(false);

  const [paymentData, setPaymentData] = useState({
    Name: '',
    paymentAmount: '',
    ModeofPayment: '',
  });

  useEffect(() => {
    fetchTransactions();
    fetchBanks();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await otherDebitAPI.getAll();
      setTransactions(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch transactions');
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
    const updatedFormData = { ...formData, [name]: value };
    if (name === 'PaymentStatus' && value === 'Pending') {
      updatedFormData.ModeofPayment = '';
    }
    
    setFormData(updatedFormData);

    // Auto-fill name details when typing name
    if (name === 'Name' && value.length > 0) {
      const matches = transactions.filter(transaction => 
        transaction.Name.toLowerCase().includes(value.toLowerCase())
      );
      
      const uniqueNames = [];
      const seenNames = new Set();
      
      matches.forEach(transaction => {
        if (!seenNames.has(transaction.Name)) {
          seenNames.add(transaction.Name);
          uniqueNames.push(transaction);
        }
      });

      setNameSuggestions(uniqueNames);
      setShowSuggestions(uniqueNames.length > 0);
    } else if (name === 'Name') {
      setShowSuggestions(false);
      setNameSuggestions([]);
    }
  };

  const selectName = (transaction) => {
    setFormData({
      ...formData,
      Name: transaction.Name,
      Category: transaction.Category || 'Other'
    });
    setShowSuggestions(false);
    setNameSuggestions([]);
  };

  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({ ...paymentData, [name]: value });

    if (name === 'Name' && value.length > 0) {
      const filtered = transactions.filter(transaction => 
        transaction.Name.toLowerCase().includes(value.toLowerCase())
      );
      
      const uniqueNames = Array.from(
        new Map(filtered.map(transaction => [transaction.Name, transaction])).values()
      );
      setPaymentNameSuggestions(uniqueNames);
      setShowPaymentSuggestions(true);
    } else {
      setPaymentNameSuggestions([]);
      setShowPaymentSuggestions(false);
    }
  };

  const selectPaymentName = (transaction) => {
    setPaymentData({
      ...paymentData,
      Name: transaction.Name
    });
    setShowPaymentSuggestions(false);
    setPaymentNameSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const name = formData.Name?.trim();
    const txnName = formData.TransactionName?.trim() || formData.Name?.trim() || formData.Category;
    const description = formData.Description?.trim();

    if (!name) {
      setError('Name is required');
      return;
    }

    setLoading(true);

    try {
      const dataToSend = {
        ...formData,
        Name: name,
        TransactionName: txnName,
        Description: description,
        TransactionType: 'Debit'
      };
      console.log('Sending data to backend:', dataToSend);
      const response = await otherDebitAPI.create(dataToSend);
      setSuccess(response.message || 'Transaction created successfully!');
      setShowAddModal(false);
      setFormData({
        Name: '',
        Amount: '',
        ModeofPayment: '',
        Category: 'Other',
        TransactionName: '',
        TransactionType: 'Debit',
        PaymentStatus: 'Pending',
        Description: '',
        OpeningBalance: '',
      });
      fetchTransactions();
    } catch (err) {
      setError(err.message || 'Failed to create transaction');
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
      const response = await otherDebitAPI.applyPayment(paymentData);
      setSuccess(response.message || 'Payment applied successfully!');
      setShowPaymentModal(false);
      setPaymentData({ Name: '', paymentAmount: '', ModeofPayment: '' });
      fetchTransactions();
    } catch (err) {
      setError(err.message || 'Failed to apply payment');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPaid = (payments) => {
    return payments.reduce((sum, payment) => sum + payment.amount, 0);
  };

  const openEditModal = (transaction) => {
    setSelectedTransaction(transaction);
    setFormData({
      Name: transaction.Name,
      Amount: transaction.Amount,
      ModeofPayment: transaction.ModeofPayment || '',
      Category: transaction.Category,
      TransactionName: transaction.TransactionName,
      TransactionType: transaction.TransactionType,
      PaymentStatus: transaction.PaymentStatus,
      Description: transaction.Description || '',
      OpeningBalance: transaction.OpeningBalance || '',
    });
    setIsEditMode(true);
    setShowEditModal(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const name = formData.Name?.trim();
    const txnName = formData.TransactionName?.trim() || formData.Name?.trim() || formData.Category;
    const description = formData.Description?.trim();

    if (!name) {
      setError('Name is required');
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        Name: name,
        TransactionName: txnName,
        Description: description,
        TransactionType: 'Debit'
      };
      console.log('Updating transaction:', dataToSend);
      const response = await otherDebitAPI.update(selectedTransaction._id, dataToSend);
      setSuccess(response.message || 'Transaction updated successfully!');
      setShowEditModal(false);
      setIsEditMode(false);
      setFormData({
        Name: '',
        Amount: '',
        ModeofPayment: '',
        Category: 'Other',
        TransactionName: '',
        TransactionType: 'Debit',
        PaymentStatus: 'Pending',
        Description: '',
        OpeningBalance: '',
      });
      setSelectedTransaction(null);
      fetchTransactions();
    } catch (err) {
      setError(err.message || 'Failed to update transaction');
    } finally {
      setLoading(false);
    }
  };

  const openPaymentModal = (transaction) => {
    setSelectedTransaction(transaction);
    setPaymentData({
      Name: transaction.Name,
      paymentAmount: '',
      ModeofPayment: 'Cash'
    });
    setShowPaymentModal(true);
  };

  const viewPaymentHistory = (transaction) => {
    setSelectedTransaction(transaction);
    setShowPaymentHistoryModal(true);
  };

  const toggleName = (name) => {
    setExpandedNames(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const clearFilters = () => {
    setFilters({
      name: '',
      dateFrom: '',
      dateTo: '',
      category: '',
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const groupTransactionsByName = () => {
    const grouped = {};
    
    // Apply filters
    const filteredTransactions = transactions.filter(transaction => {
      // Filter by name
      if (filters.name && !transaction.Name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }
      
      // Filter by category
      if (filters.category && transaction.Category !== filters.category) {
        return false;
      }
      
      // Filter by date range
      if (filters.dateFrom || filters.dateTo) {
        const transactionDate = new Date(transaction.createdAt);
        if (filters.dateFrom && transactionDate < new Date(filters.dateFrom)) {
          return false;
        }
        if (filters.dateTo && transactionDate > new Date(filters.dateTo + 'T23:59:59')) {
          return false;
        }
      }
      
      return true;
    });

    // Group by name
    filteredTransactions.forEach(transaction => {
      if (!grouped[transaction.Name]) {
        grouped[transaction.Name] = [];
      }
      grouped[transaction.Name].push(transaction);
    });

    return grouped;
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-800 rounded-2xl shadow-2xl p-8 mb-8 border-4 border-teal-600">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="bg-cyan-100 p-4 rounded-xl shadow-lg">
              <svg className="w-12 h-12 text-teal-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-cyan-50 tracking-wide drop-shadow-lg">Other Debit</h1>
              <p className="text-cyan-200 mt-1 text-sm">Annapurna Veneer - Premium Plywood</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
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
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-8 py-3 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border-2 border-yellow-400"
            >
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Debit
              </span>
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => downloadOtherDebitPDF(transactions)}
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                PDF
              </button>
              <button
                onClick={() => downloadOtherDebitExcel(transactions)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Excel
              </button>
            </div>
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

      {/* Filters */}
      <div className="bg-white border-4 border-teal-200 p-6 rounded-2xl shadow-xl">
        <h3 className="text-xl font-bold mb-4 text-teal-900">Filters</h3>
        <div className="grid grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-semibold text-teal-800 mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              placeholder="Search name..."
              className="w-full px-4 py-2 border-2 border-teal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-teal-800 mb-2">Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border-2 border-teal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm"
            >
              <option value="">All Categories</option>
              {[
                "Bank Accounts", "Bank OCC A/c", "Bank OD A/c", "Branch / Divisions", "Capital Account",
                "Cash-in-hand", "Current Assets", "Current Liabilities", "Deposits (Asset)", "Direct Expenses",
                "Direct Incomes", "Duties & Taxes", "Expenses (Direct)", "Expenses (Indirect)", "Fixed Assets",
                "Income (Direct)", "Income (Indirect)", "Indirect Expenses", "Indirect Incomes", "Investments",
                "Loans & Advances (Asset)", "Loans (Liability)", "Misc. Expenses (ASSET)", "Provisions",
                "Purchase Accounts", "Reserves & Surplus", "Retained Earnings", "Sales Accounts", "Secured Loans",
                "Stock-in-hand", "Sundry Creditors", "Sundry Debtors", "Suspense A/c", "Unsecured Loans",
                "Purchase", "Expense", "Utility", "Sundry Debitors", "Other"
              ].map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-teal-800 mb-2">Date From</label>
            <input
              type="date"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border-2 border-teal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-teal-800 mb-2">Date To</label>
            <input
              type="date"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border-2 border-teal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl font-semibold shadow-lg transition-all"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white border-4 border-teal-200 rounded-2xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-teal-200">
            <thead className="bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-cyan-50 uppercase tracking-wider border-r border-teal-600">Order#</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-cyan-50 uppercase tracking-wider border-r border-teal-600">Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-cyan-50 uppercase tracking-wider border-r border-teal-600">Category</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-cyan-50 uppercase tracking-wider border-r border-teal-600">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-cyan-50 uppercase tracking-wider border-r border-teal-600">Payment Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-cyan-50 uppercase tracking-wider border-r border-teal-600">Mode of Payment</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-cyan-50 uppercase tracking-wider border-r border-teal-600">Description</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-cyan-50 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.keys(groupTransactionsByName()).length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                    No debit transactions found
                  </td>
                </tr>
              ) : (
                Object.entries(groupTransactionsByName()).map(([name, nameTransactions]) => {
                  const isExpanded = expandedNames[name];
                  const totalTransactions = nameTransactions.length;
                  const totalAmount = nameTransactions.reduce((sum, transaction) => sum + transaction.Amount, 0);
                  const totalPaidAmount = nameTransactions.reduce((sum, transaction) => {
                    return sum + calculateTotalPaid(transaction.Payments || []);
                  }, 0);
                  const totalDue = totalAmount - totalPaidAmount;
                  const allConfirmed = nameTransactions.every(transaction => transaction.PaymentStatus === 'Confirmed');

                  return (
                    <React.Fragment key={name}>
                      {/* Name Summary Row */}
                      <tr 
                        onClick={() => toggleName(name)}
                        className="bg-red-50 hover:bg-red-100 cursor-pointer font-semibold"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="flex items-center">
                            {isExpanded ? 'Γû╝' : 'Γû╢'} 
                            <span className="ml-2">{totalTransactions} transactions</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Γé╣{totalAmount}</td>
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <span className="text-gray-500">Summary</span>
                        </td>
                      </tr>

                      {/* Individual Transactions - Only show when expanded */}
                      {isExpanded && nameTransactions.map((transaction) => {
                        const totalPaid = calculateTotalPaid(transaction.Payments || []);
                        const dueAmount = transaction.Amount - totalPaid;
                        return (
                          <tr key={transaction._id} className="hover:bg-gray-50 bg-white">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 pl-12">{transaction.OrderNumber}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">ΓööΓöÇ {transaction.Name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.Category}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Γé╣{transaction.Amount}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                transaction.PaymentStatus === 'Confirmed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {transaction.PaymentStatus}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.ModeofPayment || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.Description || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              <button
                                onClick={() => openEditModal(transaction)}
                                className="text-purple-600 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-2 py-1 rounded text-xs"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => openPaymentModal(transaction)}
                                className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded text-xs"
                              >
                                Add Payment
                              </button>
                              <button
                                onClick={() => viewPaymentHistory(transaction)}
                                className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-2 py-1 rounded text-xs"
                                title="View payment history"
                              >
                                Payments ({transaction.Payments?.length || 0})
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

      {/* Add Debit Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Add Debit Transaction</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  name="Name"
                  value={formData.Name}
                  onChange={handleInputChange}
                  onFocus={() => formData.Name && setShowSuggestions(nameSuggestions.length > 0)}
                  autoComplete="off"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                {/* Name Suggestions Dropdown */}
                {showSuggestions && nameSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto">
                    {nameSuggestions.map((transaction, index) => (
                      <div
                        key={index}
                        onClick={() => selectName(transaction)}
                        className="px-3 py-2 cursor-pointer hover:bg-gray-100 border-b border-gray-100"
                      >
                        <div className="font-medium">{transaction.Name}</div>
                        <div className="text-sm text-gray-500">{transaction.Category}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
                <input
                  type="number"
                  name="Amount"
                  value={formData.Amount}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  name="Category"
                  value={formData.Category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Category</option>
                  {[
                    "Bank Accounts", "Bank OCC A/c", "Bank OD A/c", "Branch / Divisions", "Capital Account",
                    "Cash-in-hand", "Current Assets", "Current Liabilities", "Deposits (Asset)", "Direct Expenses",
                    "Direct Incomes", "Duties & Taxes", "Expenses (Direct)", "Expenses (Indirect)", "Fixed Assets",
                    "Income (Direct)", "Income (Indirect)", "Indirect Expenses", "Indirect Incomes", "Investments",
                    "Loans & Advances (Asset)", "Loans (Liability)", "Misc. Expenses (ASSET)", "Provisions",
                    "Purchase Accounts", "Reserves & Surplus", "Retained Earnings", "Sales Accounts", "Secured Loans",
                    "Stock-in-hand", "Sundry Creditors", "Sundry Debtors", "Suspense A/c", "Unsecured Loans",
                    "Purchase", "Expense", "Utility", "Sundry Debitors", "Other"
                  ].map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Opening Balance</label>
                <input
                  type="number"
                  name="OpeningBalance"
                  value={formData.OpeningBalance}
                  onChange={handleInputChange}
                  placeholder="Enter opening balance (if any)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  name="Description"
                  value={formData.Description}
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
                  {loading ? 'Creating...' : 'Create Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Debit Transaction Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Edit Debit Transaction</h2>
            <form onSubmit={handleUpdateSubmit} className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  name="Name"
                  value={formData.Name}
                  onChange={handleInputChange}
                  autoComplete="off"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  name="Category"
                  value={formData.Category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Category</option>
                  {[
                    "Bank Accounts", "Bank OCC A/c", "Bank OD A/c", "Branch / Divisions", "Capital Account",
                    "Cash-in-hand", "Current Assets", "Current Liabilities", "Deposits (Asset)", "Direct Expenses",
                    "Direct Incomes", "Duties & Taxes", "Expenses (Direct)", "Expenses (Indirect)", "Fixed Assets",
                    "Income (Direct)", "Income (Indirect)", "Indirect Expenses", "Indirect Incomes", "Investments",
                    "Loans & Advances (Asset)", "Loans (Liability)", "Misc. Expenses (ASSET)", "Provisions",
                    "Purchase Accounts", "Reserves & Surplus", "Retained Earnings", "Sales Accounts", "Secured Loans",
                    "Stock-in-hand", "Sundry Creditors", "Sundry Debtors", "Suspense A/c", "Unsecured Loans",
                    "Purchase", "Expense", "Utility", "Sundry Debitors", "Other"
                  ].map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Opening Balance</label>
                <input
                  type="number"
                  name="OpeningBalance"
                  value={formData.OpeningBalance}
                  onChange={handleInputChange}
                  placeholder="Enter opening balance (if any)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  name="Description"
                  value={formData.Description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="col-span-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setIsEditMode(false);
                    setSelectedTransaction(null);
                  }}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update Transaction'}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  name="Name"
                  value={paymentData.Name}
                  onChange={handlePaymentInputChange}
                  autoComplete="off"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                {/* Payment Name Suggestions Dropdown */}
                {showPaymentSuggestions && paymentNameSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto">
                    {paymentNameSuggestions.map((transaction, index) => (
                      <div
                        key={index}
                        onClick={() => selectPaymentName(transaction)}
                        className="px-3 py-2 cursor-pointer hover:bg-gray-100 border-b border-gray-100"
                      >
                        <div className="font-medium">{transaction.Name}</div>
                        <div className="text-sm text-gray-500">Balance: Γé╣{transaction.Amount - calculateTotalPaid(transaction.Payments || [])}</div>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mode of Payment *</label>
                <select
                  name="ModeofPayment"
                  value={paymentData.ModeofPayment}
                  onChange={handlePaymentInputChange}
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
      {showPaymentHistoryModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Payment History</h2>
              <button
                onClick={() => setShowPaymentHistoryModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Γ£ò
              </button>
            </div>
            <div className="mb-4 p-4 bg-gray-50 rounded">
              <div className="grid grid-cols-2 gap-4">
                <div><span className="font-medium">Name:</span> {selectedTransaction.Name}</div>
                <div><span className="font-medium">Order Number:</span> {selectedTransaction.OrderNumber}</div>
                <div><span className="font-medium">Transaction:</span> {selectedTransaction.TransactionName}</div>
                <div><span className="font-medium">Total Amount:</span> Γé╣{selectedTransaction.Amount}</div>
                <div><span className="font-medium">Amount Paid:</span> Γé╣{calculateTotalPaid(selectedTransaction.Payments || [])}</div>
                <div><span className="font-medium">Amount Due:</span> Γé╣{selectedTransaction.Amount - calculateTotalPaid(selectedTransaction.Payments || [])}</div>
              </div>
            </div>
            
            {selectedTransaction.Payments && selectedTransaction.Payments.length > 0 ? (
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
                    {selectedTransaction.Payments.map((payment, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">Γé╣{payment.amount}</td>
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

export default OtherDebit;





