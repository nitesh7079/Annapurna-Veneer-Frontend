import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const Banks = () => {
    const [banks, setBanks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBank, setSelectedBank] = useState(null);
    const [bankTransactions, setBankTransactions] = useState([]);
    const [bankSummary, setBankSummary] = useState(null);
    const [loadingTransactions, setLoadingTransactions] = useState(false);

    const [formData, setFormData] = useState({
        bankName: '',
        accountNumber: '',
        accountHolderName: '',
        ifscCode: '',
        branchName: '',
        accountType: 'Current',
        contactPerson: '',
        contactNumber: '',
        address: ''
    });

    const getApiUrl = () => {
        return 'https://shyam-veneer-backend-1.onrender.com';
    };

    const API_URL = getApiUrl();

    useEffect(() => {
        fetchBanks();
    }, []);

    const fetchBanks = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/api/v1/banks`);
            if (response.data.success) {
                setBanks(response.data.data);
                setError('');
            }
        } catch (err) {
            console.error('Error fetching banks:', err);
            setError('Failed to fetch bank accounts');
        } finally {
            setLoading(false);
        }
    };

    const fetchBankTransactions = async (bankId) => {
        try {
            setLoadingTransactions(true);
            const response = await axios.get(`${API_URL}/api/v1/banks/${bankId}/transactions?limit=50`);
            if (response.data.success) {
                setBankTransactions(response.data.data.transactions);
                setBankSummary(response.data.data.summary);
            }
        } catch (err) {
            console.error('Error fetching bank transactions:', err);
            setError('Failed to fetch bank transactions');
        } finally {
            setLoadingTransactions(false);
        }
    };

    const handleAddBank = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post(`${API_URL}/api/v1/banks`, formData);
            
            if (response.data.success) {
                // Reset form
                setFormData({
                    bankName: '',
                    accountNumber: '',
                    accountHolderName: '',
                    ifscCode: '',
                    branchName: '',
                    accountType: 'Current',
                    contactPerson: '',
                    contactNumber: '',
                    address: ''
                });
                setShowAddForm(false);
                await fetchBanks(); // Refresh banks list
                setError('');
                alert('Bank account added successfully!');
            }
        } catch (err) {
            console.error('Error adding bank:', err);
            let errorMessage = 'Failed to add bank account';
            
            if (err.response?.data?.errors) {
                const validationErrors = err.response.data.errors
                    .map(error => `${error.field}: ${error.message}`)
                    .join(', ');
                errorMessage = `Validation failed: ${validationErrors}`;
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value.toUpperCase() === value && name === 'ifscCode' ? value.toUpperCase() : value
        }));
    };

    const handleViewTransactions = (bank) => {
        setSelectedBank(bank);
        fetchBankTransactions(bank._id);
    };

    const handleToggleBankStatus = async (bankId, currentStatus) => {
        try {
            const response = await axios.patch(`${API_URL}/api/v1/banks/${bankId}/toggle-status`);
            
            if (response.data.success) {
                await fetchBanks(); // Refresh banks list
                const statusText = currentStatus ? 'disabled' : 'activated';
                alert(`Bank ${statusText} successfully!`);
            }
        } catch (err) {
            console.error('Error toggling bank status:', err);
            const errorMessage = err.response?.data?.message || 'Failed to toggle bank status';
            setError(errorMessage);
            alert(errorMessage);
        }
    };

    const filteredBanks = useMemo(() => {
        if (!searchTerm.trim()) return banks;
        
        return banks.filter(bank =>
            bank.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            bank.accountNumber.includes(searchTerm) ||
            bank.accountHolderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            bank.branchName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [banks, searchTerm]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading && banks.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse space-y-6">
                        {/* Header skeleton */}
                        <div className="bg-white rounded-2xl shadow-2xl p-8 border-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-gray-300 p-4 rounded-xl w-16 h-16"></div>
                                    <div className="space-y-2">
                                        <div className="h-8 bg-gray-300 rounded w-64"></div>
                                        <div className="h-4 bg-gray-300 rounded w-48"></div>
                                    </div>
                                </div>
                                <div className="h-12 bg-gray-300 rounded w-40"></div>
                            </div>
                            {/* Search bar skeleton */}
                            <div className="mt-4">
                                <div className="h-12 bg-gray-300 rounded-xl w-full"></div>
                            </div>
                        </div>
                        
                        {/* Bank cards skeleton */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-white rounded-2xl shadow-xl border-4 p-6 space-y-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-gray-300 p-3 rounded-xl w-12 h-12"></div>
                                        <div className="space-y-2 flex-1">
                                            <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                                            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-4 bg-gray-300 rounded w-full"></div>
                                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                                    </div>
                                    <div className="flex justify-between pt-4">
                                        <div className="h-8 bg-gray-300 rounded w-20"></div>
                                        <div className="h-8 bg-gray-300 rounded w-24"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 rounded-2xl shadow-2xl p-8 mb-6 border-4 border-amber-700">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <div className="bg-amber-100 p-4 rounded-xl shadow-lg">
                                <svg className="w-12 h-12 text-amber-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-amber-50 tracking-wide drop-shadow-lg">Bank Management</h1>
                                <p className="text-amber-200 mt-1 text-sm">Annapurna Veneer - Premium Plywood</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-8 py-3 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border-2 border-amber-500"
                        >
                            <span className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Bank Account
                            </span>
                        </button>
                    </div>
                    
                    <div className="mt-4">
                        <input
                            type="text"
                            placeholder="Search banks by name, account number, holder name, or branch..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white shadow-sm"
                        />
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

                {!selectedBank && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredBanks.map((bank) => (
                            <div key={bank._id} className="bg-white border-4 border-amber-200 rounded-2xl shadow-xl p-6 hover:shadow-2xl hover:border-amber-300 transition-all duration-300">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-xl font-bold text-amber-900">{bank.bankName}</h3>
                                        <span className={`px-3 py-1 rounded-xl text-xs font-semibold shadow-sm ${
                                            bank.isActive ? 'bg-green-100 text-green-800 border-2 border-green-300' : 'bg-red-100 text-red-800 border-2 border-red-300'
                                        }`}>
                                            {bank.isActive ? 'Active' : 'Disabled'}
                                        </span>
                                    </div>
                                    <span className={`px-3 py-1 rounded-xl text-xs font-semibold shadow-sm ${
                                        bank.accountType === 'Current' ? 'bg-blue-100 text-blue-800 border-2 border-blue-300' :
                                        bank.accountType === 'Savings' ? 'bg-green-100 text-green-800 border-2 border-green-300' :
                                        'bg-amber-100 text-amber-800 border-2 border-amber-300'
                                    }`}>
                                        {bank.accountType}
                                    </span>
                                </div>
                                
                                <div className="space-y-2 text-sm text-gray-700">
                                    <p><span className="font-semibold text-amber-900">Account Holder:</span> {bank.accountHolderName}</p>
                                    <p><span className="font-semibold text-amber-900">Account No:</span> ****{bank.accountNumber.slice(-4)}</p>
                                    <p><span className="font-semibold text-amber-900">IFSC:</span> {bank.ifscCode}</p>
                                    <p><span className="font-semibold text-amber-900">Branch:</span> {bank.branchName}</p>
                                    {bank.contactPerson && (
                                        <p><span className="font-semibold text-amber-900">Contact:</span> {bank.contactPerson}</p>
                                    )}
                                </div>

                                <div className="mt-4 pt-4 border-t-2 border-amber-200 space-y-2">
                                    <button
                                        onClick={() => handleViewTransactions(bank)}
                                        className="w-full bg-gradient-to-r from-amber-100 to-amber-200 text-amber-900 font-semibold px-4 py-2 rounded-xl hover:from-amber-200 hover:to-amber-300 shadow-md hover:shadow-lg transition-all"
                                    >
                                        View Transactions
                                    </button>
                                    <button
                                        onClick={() => handleToggleBankStatus(bank._id, bank.isActive)}
                                        className={`w-full px-4 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all ${
                                            bank.isActive 
                                                ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 hover:from-red-200 hover:to-red-300' 
                                                : 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 hover:from-green-200 hover:to-green-300'
                                        }`}
                                    >
                                        {bank.isActive ? 'Disable Bank' : 'Enable Bank'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {filteredBanks.length === 0 && searchTerm && (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <p className="text-gray-600">No banks found matching "{searchTerm}"</p>
                    </div>
                )}

                {filteredBanks.length === 0 && !searchTerm && (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <p className="text-gray-600 mb-4">No bank accounts found</p>
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                        >
                            Add Your First Bank Account
                        </button>
                    </div>
                )}

                {selectedBank && (
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">{selectedBank.bankName}</h2>
                                    <p className="text-gray-600">Account: ****{selectedBank.accountNumber.slice(-4)}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedBank(null);
                                        setBankTransactions([]);
                                        setBankSummary(null);
                                    }}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ← Back to Banks
                                </button>
                            </div>
                            
                            {bankSummary && (
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <p className="text-sm text-green-600">Total Credits</p>
                                        <p className="text-lg font-bold text-green-800">{formatCurrency(bankSummary.totalCredit)}</p>
                                    </div>
                                    <div className="bg-red-50 p-4 rounded-lg">
                                        <p className="text-sm text-red-600">Total Debits</p>
                                        <p className="text-lg font-bold text-red-800">{formatCurrency(bankSummary.totalDebit)}</p>
                                    </div>
                                    <div className={`p-4 rounded-lg ${bankSummary.currentBalance >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
                                        <p className={`text-sm ${bankSummary.currentBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>Current Balance</p>
                                        <p className={`text-lg font-bold ${bankSummary.currentBalance >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>
                                            {formatCurrency(bankSummary.currentBalance)}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600">Transactions</p>
                                        <p className="text-lg font-bold text-gray-800">{bankSummary.transactionCount}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6">
                            {loadingTransactions ? (
                                <div className="text-center py-8">
                                    <div className="text-gray-600">Loading transactions...</div>
                                </div>
                            ) : bankTransactions.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer/Name</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {bankTransactions.map((transaction) => (
                                                <tr key={transaction._id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-2 text-sm text-gray-900">
                                                        {formatDate(transaction.transactionDate)}
                                                    </td>
                                                    <td className="px-4 py-2 text-sm text-gray-900">
                                                        {transaction.customerName}
                                                    </td>
                                                    <td className="px-4 py-2 text-sm text-gray-900">
                                                        {transaction.orderNumber}
                                                    </td>
                                                    <td className="px-4 py-2 text-sm">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                            transaction.transactionType === 'OtherCredit' || transaction.transactionType === 'Sell'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {transaction.transactionType}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2 text-sm font-medium">
                                                        {formatCurrency(transaction.amount)}
                                                    </td>
                                                    <td className="px-4 py-2 text-sm text-gray-600">
                                                        {transaction.description}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-600">No transactions found for this bank account</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Add Bank Modal */}
            {showAddForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">Add Bank Account</h2>
                            <button
                                onClick={() => setShowAddForm(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleAddBank} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Bank Name *
                                </label>
                                <input
                                    type="text"
                                    name="bankName"
                                    value={formData.bankName}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., State Bank of India"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Account Number *
                                </label>
                                <input
                                    type="text"
                                    name="accountNumber"
                                    value={formData.accountNumber}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter account number"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Account Holder Name *
                                </label>
                                <input
                                    type="text"
                                    name="accountHolderName"
                                    value={formData.accountHolderName}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Account holder name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    IFSC Code *
                                </label>
                                <input
                                    type="text"
                                    name="ifscCode"
                                    value={formData.ifscCode}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., SBIN0001234"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Branch Name *
                                </label>
                                <input
                                    type="text"
                                    name="branchName"
                                    value={formData.branchName}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Branch name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Account Type
                                </label>
                                <select
                                    name="accountType"
                                    value={formData.accountType}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="Current">Current</option>
                                    <option value="Savings">Savings</option>
                                    <option value="Business">Business</option>
                                    <option value="Salary">Salary</option>
                                    <option value="NRI">NRI</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Contact Person
                                </label>
                                <input
                                    type="text"
                                    name="contactPerson"
                                    value={formData.contactPerson}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Contact person (optional)"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Contact Number
                                </label>
                                <input
                                    type="tel"
                                    name="contactNumber"
                                    value={formData.contactNumber}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Contact number (optional)"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Address
                                </label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    rows="2"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Bank address (optional)"
                                />
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition duration-200"
                                >
                                    {loading ? 'Adding...' : 'Add Bank'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Banks;