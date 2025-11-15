import React, { useState, useEffect } from 'react';
import { buyAPI, sellAPI, otherCreditAPI, otherDebitAPI, notificationAPI } from '../services/api';

const Accounting = () => {
  const [financialData, setFinancialData] = useState({
    buy: [],
    sell: [],
    otherCredit: [],
    otherDebit: []
  });
  
  const [summary, setSummary] = useState({
    totalBuyTransactions: 0,
    totalSellTransactions: 0,
    totalOtherCreditTransactions: 0,
    totalOtherDebitTransactions: 0,
    totalBuyAmount: 0,
    totalSellAmount: 0,
    totalOtherCreditAmount: 0,
    totalOtherDebitAmount: 0,
    totalIncome: 0,
    totalExpenses: 0,
    profitLoss: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all financial data
  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [buyData, sellData, creditData, debitData] = await Promise.all([
        buyAPI.getAll(),
        sellAPI.getAll(),
        otherCreditAPI.getAll(),
        otherDebitAPI.getAll()
      ]);

      const newFinancialData = {
        buy: buyData.data || [],
        sell: sellData.data || [],
        otherCredit: creditData.data || [],
        otherDebit: debitData.data || []
      };

      setFinancialData(newFinancialData);
      calculateSummary(newFinancialData);
    } catch (err) {
      console.error('Error fetching financial data:', err);
      setError('Failed to fetch financial data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate financial summary
  const calculateSummary = (data) => {
    const { buy, sell, otherCredit, otherDebit } = data;
    const today = new Date();

    // Calculate total amounts
    const totalBuyAmount = buy.reduce((sum, item) => sum + (item.Amount || 0), 0);
    const totalSellAmount = sell.reduce((sum, item) => sum + (item.Amount || 0), 0);
    const totalOtherCreditAmount = otherCredit.reduce((sum, item) => sum + (item.Amount || 0), 0);
    const totalOtherDebitAmount = otherDebit.reduce((sum, item) => sum + (item.Amount || 0), 0);

    // Calculate income and expenses
    const totalIncome = totalSellAmount + totalOtherCreditAmount;
    const totalExpenses = totalBuyAmount + totalOtherDebitAmount;
    const profitLoss = totalIncome - totalExpenses;

    // Calculate payment deadline information
    const pendingBuyPayments = buy.filter(item => item.PaymentStatus === 'Pending');
    const pendingSellPayments = sell.filter(item => item.PaymentStatus === 'Pending');
    
    const overdueBuyPayments = pendingBuyPayments.filter(item => 
      item.PaymentDeadline && new Date(item.PaymentDeadline) < today
    );
    const overdueSellPayments = pendingSellPayments.filter(item => 
      item.PaymentDeadline && new Date(item.PaymentDeadline) < today
    );

    const upcomingBuyPayments = pendingBuyPayments.filter(item => {
      if (!item.PaymentDeadline) return false;
      const deadline = new Date(item.PaymentDeadline);
      const threeDaysLater = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
      return deadline >= today && deadline <= threeDaysLater;
    });

    const upcomingSellPayments = pendingSellPayments.filter(item => {
      if (!item.PaymentDeadline) return false;
      const deadline = new Date(item.PaymentDeadline);
      const threeDaysLater = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
      return deadline >= today && deadline <= threeDaysLater;
    });

    const overdueAmountBuy = overdueBuyPayments.reduce((sum, item) => sum + (item.Amount || 0), 0);
    const overdueAmountSell = overdueSellPayments.reduce((sum, item) => sum + (item.Amount || 0), 0);

    setSummary({
      totalBuyTransactions: buy.length,
      totalSellTransactions: sell.length,
      totalOtherCreditTransactions: otherCredit.length,
      totalOtherDebitTransactions: otherDebit.length,
      totalBuyAmount,
      totalSellAmount,
      totalOtherCreditAmount,
      totalOtherDebitAmount,
      totalIncome,
      totalExpenses,
      profitLoss,
      pendingPayments: {
        buy: pendingBuyPayments.length,
        sell: pendingSellPayments.length,
        total: pendingBuyPayments.length + pendingSellPayments.length
      },
      overduePayments: {
        buy: overdueBuyPayments.length,
        sell: overdueSellPayments.length,
        total: overdueBuyPayments.length + overdueSellPayments.length,
        amountBuy: overdueAmountBuy,
        amountSell: overdueAmountSell,
        totalAmount: overdueAmountBuy + overdueAmountSell
      },
      upcomingPayments: {
        buy: upcomingBuyPayments.length,
        sell: upcomingSellPayments.length,
        total: upcomingBuyPayments.length + upcomingSellPayments.length
      }
    });
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Get profit/loss color
  const getProfitLossColor = (amount) => {
    if (amount > 0) return 'text-green-600';
    if (amount < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  // Check overdue payments
  const checkOverduePayments = async () => {
    try {
      const response = await notificationAPI.checkOverdue();
      if (response.success) {
        alert(`Found ${response.data.totalOverdue} overdue payments. Notifications created.`);
        fetchAllData(); // Refresh data
      }
    } catch (err) {
      console.error('Error checking overdue payments:', err);
      alert('Failed to check overdue payments');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-lg">Loading financial data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button 
            onClick={fetchAllData}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-6">
      <div className="container mx-auto">
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 rounded-2xl shadow-2xl p-8 mb-6 border-4 border-amber-700">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="bg-amber-100 p-4 rounded-xl shadow-lg">
              <svg className="w-12 h-12 text-amber-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-amber-50 tracking-wide drop-shadow-lg">Accounting Dashboard</h1>
              <p className="text-amber-200 mt-1 text-sm">Annapurna Veneer - Premium Plywood</p>
            </div>
          </div>
          <button 
            onClick={fetchAllData}
            className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-8 py-3 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
          >
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Data
            </span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Income Card */}
        <div className="bg-green-50 border-4 border-green-300 rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-green-800 mb-2">Total Income</h3>
          <p className="text-3xl font-bold text-green-600">{formatCurrency(summary.totalIncome)}</p>
          <p className="text-sm text-green-700 mt-2 font-medium">
            Sell: {formatCurrency(summary.totalSellAmount)} + Other Credit: {formatCurrency(summary.totalOtherCreditAmount)}
          </p>
        </div>

        {/* Expenses Card */}
        <div className="bg-red-50 border-4 border-red-300 rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-red-800 mb-2">Total Expenses</h3>
          <p className="text-3xl font-bold text-red-600">{formatCurrency(summary.totalExpenses)}</p>
          <p className="text-sm text-red-700 mt-2 font-medium">
            Buy: {formatCurrency(summary.totalBuyAmount)} + Other Debit: {formatCurrency(summary.totalOtherDebitAmount)}
          </p>
        </div>

        {/* Profit/Loss Card */}
        <div className={`${summary.profitLoss >= 0 ? 'bg-blue-50 border-blue-300' : 'bg-orange-50 border-orange-300'} border-4 rounded-2xl shadow-xl p-6`}>
          <h3 className="text-xl font-bold text-amber-900 mb-2">Profit / Loss</h3>
          <p className={`text-3xl font-bold ${getProfitLossColor(summary.profitLoss)}`}>
            {formatCurrency(summary.profitLoss)}
          </p>
          <p className="text-sm text-gray-700 mt-2 font-medium">
            {summary.profitLoss >= 0 ? 'Profit' : 'Loss'}
          </p>
        </div>

        {/* Total Transactions Card */}
        <div className="bg-purple-50 border-4 border-purple-300 rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-purple-800 mb-2">Total Transactions</h3>
          <p className="text-3xl font-bold text-purple-600">
            {summary.totalBuyTransactions + summary.totalSellTransactions + 
             summary.totalOtherCreditTransactions + summary.totalOtherDebitTransactions}
          </p>
          <p className="text-sm text-purple-700 mt-2 font-medium">All Categories</p>
        </div>
      </div>

      {/* Payment Deadline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Overdue Payments Card */}
        <div className="bg-red-50 border-4 border-red-300 rounded-2xl shadow-xl p-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-bold text-red-800">Overdue Payments</h3>
            <button
              onClick={checkOverduePayments}
              className="text-xs bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-2 rounded-lg hover:from-red-700 hover:to-red-800 shadow-md font-semibold"
            >
              Check
            </button>
          </div>
          <p className="text-3xl font-bold text-red-600">
            {summary.overduePayments?.total || 0}
          </p>
          <p className="text-sm text-red-700 mt-2 font-medium">
            Amount: {formatCurrency(summary.overduePayments?.totalAmount || 0)}
          </p>
          <div className="text-xs text-red-600 mt-2 font-medium">
            Buy: {summary.overduePayments?.buy || 0} | Sell: {summary.overduePayments?.sell || 0}
          </div>
        </div>

        {/* Upcoming Payments Card */}
        <div className="bg-yellow-50 border-4 border-yellow-300 rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-yellow-800 mb-2">Upcoming Payments</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {summary.upcomingPayments?.total || 0}
          </p>
          <p className="text-sm text-yellow-700 mt-2 font-medium">Due in 3 days</p>
          <div className="text-xs text-yellow-600 mt-2 font-medium">
            Buy: {summary.upcomingPayments?.buy || 0} | Sell: {summary.upcomingPayments?.sell || 0}
          </div>
        </div>

        {/* All Pending Payments Card */}
        <div className="bg-blue-50 border-4 border-blue-300 rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-blue-800 mb-2">Pending Payments</h3>
          <p className="text-3xl font-bold text-blue-600">
            {summary.pendingPayments?.total || 0}
          </p>
          <p className="text-sm text-blue-700 mt-2 font-medium">All pending</p>
          <div className="text-xs text-blue-600 mt-2 font-medium">
            Buy: {summary.pendingPayments?.buy || 0} | Sell: {summary.pendingPayments?.sell || 0}
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Transaction Counts */}
        <div className="bg-white border-4 border-amber-200 rounded-2xl shadow-xl p-6">
          <h3 className="text-2xl font-bold mb-4 text-amber-900">Transaction Counts</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-800 font-medium">Buy Transactions:</span>
              <span className="font-bold text-red-600">{summary.totalBuyTransactions}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-800 font-medium">Sell Transactions:</span>
              <span className="font-bold text-green-600">{summary.totalSellTransactions}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Other Credit:</span>
              <span className="font-semibold text-green-600">{summary.totalOtherCreditTransactions}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Other Debit:</span>
              <span className="font-semibold text-red-600">{summary.totalOtherDebitTransactions}</span>
            </div>
          </div>
        </div>

        {/* Amount Breakdown */}
        <div className="bg-white border-4 border-amber-200 rounded-2xl shadow-xl p-6">
          <h3 className="text-2xl font-bold mb-4 text-amber-900">Amount Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-800 font-medium">Buy Amount:</span>
              <span className="font-bold text-red-600">{formatCurrency(summary.totalBuyAmount)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-800 font-medium">Sell Amount:</span>
              <span className="font-bold text-green-600">{formatCurrency(summary.totalSellAmount)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-800 font-medium">Other Credit:</span>
              <span className="font-bold text-green-600">{formatCurrency(summary.totalOtherCreditAmount)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-800 font-medium">Other Debit:</span>
              <span className="font-bold text-red-600">{formatCurrency(summary.totalOtherDebitAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions Summary */}
      <div className="bg-white border-4 border-amber-200 rounded-2xl shadow-xl p-6">
        <h3 className="text-2xl font-bold mb-4 text-amber-900">Recent Transactions Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Recent Buy */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-red-600 mb-2">Recent Buy Transactions</h4>
            {financialData.buy.slice(0, 3).map((item, index) => (
              <div key={index} className="text-sm mb-1">
                <span className="text-gray-600">{item.Name}</span>
                <span className="float-right font-medium">{formatCurrency(item.Amount)}</span>
              </div>
            ))}
            {financialData.buy.length > 3 && (
              <p className="text-xs text-gray-500 mt-2">...and {financialData.buy.length - 3} more</p>
            )}
          </div>

          {/* Recent Sell */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-600 mb-2">Recent Sell Transactions</h4>
            {financialData.sell.slice(0, 3).map((item, index) => (
              <div key={index} className="text-sm mb-1">
                <span className="text-gray-600">{item.Name}</span>
                <span className="float-right font-medium">{formatCurrency(item.Amount)}</span>
              </div>
            ))}
            {financialData.sell.length > 3 && (
              <p className="text-xs text-gray-500 mt-2">...and {financialData.sell.length - 3} more</p>
            )}
          </div>

          {/* Recent Other Credit */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-600 mb-2">Recent Other Credit</h4>
            {financialData.otherCredit.slice(0, 3).map((item, index) => (
              <div key={index} className="text-sm mb-1">
                <span className="text-gray-600">{item.Name}</span>
                <span className="float-right font-medium">{formatCurrency(item.Amount)}</span>
              </div>
            ))}
            {financialData.otherCredit.length > 3 && (
              <p className="text-xs text-gray-500 mt-2">...and {financialData.otherCredit.length - 3} more</p>
            )}
          </div>

          {/* Recent Other Debit */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-red-600 mb-2">Recent Other Debit</h4>
            {financialData.otherDebit.slice(0, 3).map((item, index) => (
              <div key={index} className="text-sm mb-1">
                <span className="text-gray-600">{item.Name}</span>
                <span className="float-right font-medium">{formatCurrency(item.Amount)}</span>
              </div>
            ))}
            {financialData.otherDebit.length > 3 && (
              <p className="text-xs text-gray-500 mt-2">...and {financialData.otherDebit.length - 3} more</p>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Accounting;
