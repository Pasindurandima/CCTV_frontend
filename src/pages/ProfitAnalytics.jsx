import React, { useState, useEffect } from 'react';

function ProfitAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedView, setSelectedView] = useState('overview'); // overview, daily, monthly, category

  useEffect(() => {
    fetchProfitAnalytics();
  }, []);

  const fetchProfitAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/profit-analytics');
      if (!response.ok) {
        throw new Error('Failed to fetch profit analytics');
      }
      const data = await response.json();
      setAnalytics(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching profit analytics:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `Rs ${(amount || 0).toFixed(2)}`;
  };

  const formatPercent = (value) => {
    return `${(value || 0).toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-5 py-8">
        <div className="text-center py-16 bg-white rounded-xl shadow">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading profit analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-5 py-8">
        <div className="text-center py-16 bg-white rounded-xl shadow">
          <h2 className="text-2xl font-bold text-slate-800">❌ Error Loading Analytics</h2>
          <p className="text-slate-600 mt-2">{error}</p>
          <button onClick={fetchProfitAnalytics} className="bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-600 transition mt-4">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-5 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-slate-800 m-0">📊 Profit Analytics</h1>
        <button onClick={fetchProfitAnalytics} className="bg-gradient-to-r from-yellow-300 to-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-600 transition -translate-y-0.5">
          🔄 Refresh
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 mb-10">
        <div className="bg-white rounded-2xl p-6 flex gap-5 items-center shadow hover:-translate-y-1 transition border-l-4 border-green-500 bg-gradient-to-br from-white to-green-50">
          <div className="text-5xl">💰</div>
          <div className="flex-1">
            <h3 className="text-sm uppercase tracking-wide font-semibold text-slate-600 mb-2 m-0">Total Profit</h3>
            <p className="text-3xl font-bold text-slate-800 m-0">{formatCurrency(analytics.totalProfit)}</p>
            <span className="text-xs text-slate-500 block mt-1">All Time</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 flex gap-5 items-center shadow hover:-translate-y-1 transition border-l-4 border-blue-500 bg-gradient-to-br from-white to-blue-50">
          <div className="text-5xl">📅</div>
          <div className="flex-1">
            <h3 className="text-sm uppercase tracking-wide font-semibold text-slate-600 mb-2 m-0">Today's Profit</h3>
            <p className="text-3xl font-bold text-slate-800 m-0">{formatCurrency(analytics.todayProfit)}</p>
            <span className="text-xs text-slate-500 block mt-1">{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 flex gap-5 items-center shadow hover:-translate-y-1 transition border-l-4 border-purple-500 bg-gradient-to-br from-white to-purple-50">
          <div className="text-5xl">📆</div>
          <div className="flex-1">
            <h3 className="text-sm uppercase tracking-wide font-semibold text-slate-600 mb-2 m-0">This Month</h3>
            <p className="text-3xl font-bold text-slate-800 m-0">{formatCurrency(analytics.monthProfit)}</p>
            <span className="text-xs text-slate-500 block mt-1">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 flex gap-5 items-center shadow hover:-translate-y-1 transition border-l-4 border-orange-500 bg-gradient-to-br from-white to-orange-50">
          <div className="text-5xl">📈</div>
          <div className="flex-1">
            <h3 className="text-sm uppercase tracking-wide font-semibold text-slate-600 mb-2 m-0">Profit Margin</h3>
            <p className="text-3xl font-bold text-slate-800 m-0">{formatPercent(analytics.profitMargin)}</p>
            <span className="text-xs text-slate-500 block mt-1">Overall</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 flex gap-5 items-center shadow hover:-translate-y-1 transition border-l-4 border-cyan-500 bg-gradient-to-br from-white to-cyan-50">
          <div className="text-5xl">💵</div>
          <div className="flex-1">
            <h3 className="text-sm uppercase tracking-wide font-semibold text-slate-600 mb-2 m-0">Total Revenue</h3>
            <p className="text-3xl font-bold text-slate-800 m-0">{formatCurrency(analytics.totalRevenue)}</p>
            <span className="text-xs text-slate-500 block mt-1">{analytics.totalSales} Sales</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 flex gap-5 items-center shadow hover:-translate-y-1 transition border-l-4 border-red-500 bg-gradient-to-br from-white to-red-50">
          <div className="text-5xl">🏷️</div>
          <div className="flex-1">
            <h3 className="text-sm uppercase tracking-wide font-semibold text-slate-600 mb-2 m-0">Total Cost</h3>
            <p className="text-3xl font-bold text-slate-800 m-0">{formatCurrency(analytics.totalCost)}</p>
            <span className="text-xs text-slate-500 block mt-1">Product Costs</span>
          </div>
        </div>
      </div>

      {/* View Selector */}
      <div className="flex gap-3 mb-8 flex-wrap">
        <button 
          className={`py-3 px-6 rounded-xl font-semibold transition ${selectedView === 'overview' ? 'bg-orange-500 text-white border-purple-600' : 'bg-white border-2 border-slate-200 text-slate-600 hover:border-blue-500 hover:text-blue-500'}`}
          onClick={() => setSelectedView('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`py-3 px-6 rounded-xl font-semibold transition ${selectedView === 'daily' ? 'bg-orange-500 text-white border-purple-600' : 'bg-white border-2 border-slate-200 text-slate-600 hover:border-blue-500 hover:text-blue-500'}`}
          onClick={() => setSelectedView('daily')}
        >
          📅 Daily Profit
        </button>
        <button 
          className={`py-3 px-6 rounded-xl font-semibold transition ${selectedView === 'monthly' ? 'bg-orange-500 text-white border-purple-600' : 'bg-white border-2 border-slate-200 text-slate-600 hover:border-blue-500 hover:text-blue-500'}`}
          onClick={() => setSelectedView('monthly')}
        >
          📆 Monthly Profit
        </button>
        <button 
          className={`py-3 px-6 rounded-xl font-semibold transition ${selectedView === 'category' ? 'bg-orange-500 text-white border-purple-600' : 'bg-white border-2 border-slate-200 text-slate-600 hover:border-blue-500 hover:text-blue-500'}`}
          onClick={() => setSelectedView('category')}
        >
          🏷️ By Product
        </button>
      </div>

      {/* Daily Profit View */}
      {selectedView === 'daily' && analytics.dailyProfit && (
        <div className="bg-white rounded-xl p-8 shadow">
          <h2 className="mb-6 text-slate-800 text-2xl font-bold m-0">📅 Daily Profit (Last 30 Days)</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-orange-500">
                  <th className="p-4 text-left text-white font-semibold uppercase text-sm tracking-widest">Date</th>
                  <th className="p-4 text-left text-white font-semibold uppercase text-sm tracking-widest">Profit</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(analytics.dailyProfit)
                  .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
                  .map(([date, profit]) => (
                    <tr key={date} className="border-b border-slate-100 hover:bg-slate-50 transition">
                      <td className="p-4 text-slate-800">{new Date(date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}</td>
                      <td className={`p-4 font-semibold ${profit > 0 ? 'text-green-600' : 'text-slate-400'}`}>
                        {formatCurrency(profit)}
                      </td>
                    </tr>
                  ))}
              </tbody>
              <tfoot className="bg-slate-100 border-t-3 border-purple-600">
                <tr>
                  <td className="p-4 font-bold text-slate-800"><strong>Total (30 Days)</strong></td>
                  <td className="p-4 font-bold text-blue-500 text-lg">
                    <strong>{formatCurrency(
                      Object.values(analytics.dailyProfit).reduce((sum, val) => sum + val, 0)
                    )}</strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Monthly Profit View */}
      {selectedView === 'monthly' && analytics.monthlyProfit && (
        <div className="bg-white rounded-xl p-8 shadow">
          <h2 className="mb-6 text-slate-800 text-2xl font-bold m-0">📆 Monthly Profit (Last 12 Months)</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-orange-500">
                  <th className="p-4 text-left text-white font-semibold uppercase text-sm tracking-widest">Month</th>
                  <th className="p-4 text-left text-white font-semibold uppercase text-sm tracking-widest">Profit</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(analytics.monthlyProfit)
                  .sort(([monthA], [monthB]) => monthB.localeCompare(monthA))
                  .map(([month, profit]) => {
                    const [year, monthNum] = month.split('-');
                    const monthName = new Date(year, monthNum - 1).toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    });
                    return (
                      <tr key={month} className="border-b border-slate-100 hover:bg-slate-50 transition">
                        <td className="p-4 text-slate-800">{monthName}</td>
                        <td className={`p-4 font-semibold ${profit > 0 ? 'text-green-600' : 'text-slate-400'}`}>
                          {formatCurrency(profit)}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
              <tfoot className="bg-slate-100 border-t-3 border-purple-600">
                <tr>
                  <td className="p-4 font-bold text-slate-800"><strong>Total (12 Months)</strong></td>
                  <td className="p-4 font-bold text-blue-500 text-lg">
                    <strong>{formatCurrency(
                      Object.values(analytics.monthlyProfit).reduce((sum, val) => sum + val, 0)
                    )}</strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Category-wise Profit View */}
      {selectedView === 'category' && analytics.categoryProfit && (
        <div className="bg-white rounded-xl p-8 shadow">
          <h2 className="mb-6 text-slate-800 text-2xl font-bold m-0">🏷️ Profit by Product</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-orange-500">
                  <th className="p-4 text-left text-white font-semibold uppercase text-sm tracking-widest">Product Name</th>
                  <th className="p-4 text-left text-white font-semibold uppercase text-sm tracking-widest">Profit</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(analytics.categoryProfit)
                  .sort(([, profitA], [, profitB]) => profitB - profitA)
                  .map(([product, profit]) => (
                    <tr key={product} className="border-b border-slate-100 hover:bg-slate-50 transition">
                      <td className="p-4 text-slate-800">{product}</td>
                      <td className={`p-4 font-semibold ${profit > 0 ? 'text-green-600' : 'text-slate-400'}`}>
                        {formatCurrency(profit)}
                      </td>
                    </tr>
                  ))}
              </tbody>
              <tfoot className="bg-slate-100 border-t-3 border-purple-600">
                <tr>
                  <td className="p-4 font-bold text-slate-800"><strong>Total Profit</strong></td>
                  <td className="p-4 font-bold text-blue-500 text-lg">
                    <strong>{formatCurrency(
                      Object.values(analytics.categoryProfit).reduce((sum, val) => sum + val, 0)
                    )}</strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Overview - Summary */}
      {selectedView === 'overview' && (
        <div className="bg-white rounded-xl p-8 shadow">
          <h2 className="mb-8 text-slate-800 text-2xl font-bold m-0">📊 Profit Summary</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-50 p-6 rounded-lg border-2 border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-5 m-0">Revenue vs Cost</h3>
              <div className="flex flex-col gap-3">
                <div>
                  <div className="h-12 rounded-lg flex items-center px-4 text-white font-semibold text-sm bg-gradient-to-r from-cyan-500 to-cyan-600 hover:translate-x-2 transition">
                    <span>Revenue: {formatCurrency(analytics.totalRevenue)}</span>
                  </div>
                </div>
                <div>
                  <div className="h-12 rounded-lg flex items-center px-4 text-white font-semibold text-sm bg-gradient-to-r from-red-500 to-red-600 hover:translate-x-2 transition">
                    <span>Cost: {formatCurrency(analytics.totalCost)}</span>
                  </div>
                </div>
                <div>
                  <div className="h-12 rounded-lg flex items-center px-4 text-white font-semibold text-sm bg-gradient-to-r from-green-500 to-green-600 hover:translate-x-2 transition">
                    <span>Profit: {formatCurrency(analytics.totalProfit)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-lg border-2 border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-5 m-0">Key Metrics</h3>
              <ul className="list-none p-0 m-0">
                <li className="p-4 border-b border-slate-200 flex justify-between items-center">
                  <span className="text-slate-600 font-medium">Total Sales</span>
                  <span className="text-slate-800 font-bold text-lg">{analytics.totalSales}</span>
                </li>
                <li className="p-4 border-b border-slate-200 flex justify-between items-center">
                  <span className="text-slate-600 font-medium">Average Order Value</span>
                  <span className="text-slate-800 font-bold text-lg">{formatCurrency(analytics.totalRevenue / analytics.totalSales)}</span>
                </li>
                <li className="p-4 flex justify-between items-center">
                  <span className="text-slate-600 font-medium">Profit Margin</span>
                  <span className="text-slate-800 font-bold text-lg">{formatPercent(analytics.profitMargin)}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfitAnalytics;
