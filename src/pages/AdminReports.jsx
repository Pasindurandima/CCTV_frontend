import { useState, useEffect } from 'react';

const AdminReports = () => {
  const [reports, setReports] = useState({
    salesReport: [],
    inventoryReport: [],
    productReport: []
  });
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('sales');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchReports();
  }, [dateRange]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8080/api/reports?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
      );
      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) {
      alert('No data to export');
      return;
    }

    let csvContent = '';
    
    // Format specifically for sales report
    if (filename === 'sales_report') {
      const headers = ['Order ID', 'Date', 'Customer', 'Products', 'Amount', 'Status'];
      csvContent = headers.join(',') + '\n';
      
      data.forEach(row => {
        const orderId = row.orderId || '';
        const date = row.orderDate ? new Date(row.orderDate).toLocaleDateString() : '';
        const customer = row.customerName || '';
        const products = row.productCount || '';
        const amount = row.totalAmount ? row.totalAmount.toFixed(2) : '0.00';
        const status = row.status || '';
        
        csvContent += `"${orderId}","${date}","${customer}","${products}","${amount}","${status}"\n`;
      });
    } 
    // Format for inventory report
    else if (filename === 'inventory_report') {
      const headers = ['Product', 'Category', 'Quantity', 'Unit Price', 'Stock Value', 'Status'];
      csvContent = headers.join(',') + '\n';
      
      data.forEach(row => {
        const product = row.productName || '';
        const category = row.category || '';
        const quantity = row.quantity || 0;
        const unitPrice = row.unitPrice ? row.unitPrice.toFixed(2) : '0.00';
        const stockValue = row.stockValue ? row.stockValue.toFixed(2) : '0.00';
        const status = row.isLowStock ? 'Low Stock' : 'In Stock';
        
        csvContent += `"${product}","${category}","${quantity}","${unitPrice}","${stockValue}","${status}"\n`;
      });
    }
    // Format for product report
    else if (filename === 'product_report') {
      const headers = ['Product', 'Category', 'Units Sold', 'Revenue', 'Avg Rating', 'Stock Left'];
      csvContent = headers.join(',') + '\n';
      
      data.forEach(row => {
        const product = row.productName || '';
        const category = row.category || '';
        const unitsSold = row.unitsSold || 0;
        const revenue = row.revenue ? row.revenue.toFixed(2) : '0.00';
        const avgRating = row.avgRating ? row.avgRating.toFixed(1) : 'N/A';
        const stockLeft = row.stockLeft || 0;
        
        csvContent += `"${product}","${category}","${unitsSold}","${revenue}","${avgRating}","${stockLeft}"\n`;
      });
    }
    // Fallback to generic export
    else {
      const headers = Object.keys(data[0]);
      csvContent = headers.join(',') + '\n';
      csvContent += data.map(row => 
        headers.map(header => JSON.stringify(row[header] || '')).join(',')
      ).join('\n');
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const SalesReportTab = () => (
    <div className="opacity-0 animate-[fadeIn_0.4s_ease-out_forwards]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-slate-800 m-0 text-xl sm:text-2xl font-bold flex items-center gap-2">
          <span className="text-2xl">💰</span>
          <span>Sales Report</span>
        </h2>
        <button 
          onClick={() => exportToCSV(reports.salesReport, 'sales_report')} 
          className="bg-gradient-to-r from-green-500 to-green-600 text-white py-2.5 px-5 rounded-lg font-medium shadow-sm hover:shadow-md hover:from-green-600 hover:to-green-700 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 p-5 rounded-xl border border-orange-200/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="m-0 text-slate-600 text-xs font-semibold uppercase tracking-wide">Total Sales</h4>
            <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center">
              <span className="text-lg">💵</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-800 m-0">
            ${reports.salesReport.reduce((sum, item) => sum + (item.totalAmount || 0), 0).toFixed(2)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-5 rounded-xl border border-blue-200/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="m-0 text-slate-600 text-xs font-semibold uppercase tracking-wide">Total Orders</h4>
            <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <span className="text-lg">📦</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-800 m-0">{reports.salesReport.length}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-5 rounded-xl border border-purple-200/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="m-0 text-slate-600 text-xs font-semibold uppercase tracking-wide">Avg Order Value</h4>
            <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <span className="text-lg">📊</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-800 m-0">
            ${reports.salesReport.length > 0 
              ? (reports.salesReport.reduce((sum, item) => sum + (item.totalAmount || 0), 0) / reports.salesReport.length).toFixed(2)
              : '0.00'}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
        <table className="w-full border-collapse">
          <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
            <tr>
              <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide border-b-2 border-slate-200">Order ID</th>
              <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide border-b-2 border-slate-200">Date</th>
              <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide border-b-2 border-slate-200">Customer</th>
              <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide border-b-2 border-slate-200">Products</th>
              <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide border-b-2 border-slate-200">Amount</th>
              <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide border-b-2 border-slate-200">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {reports.salesReport.map((sale, index) => (
              <tr key={index} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors duration-150">
                <td className="p-4 font-medium text-slate-700">#{sale.orderId}</td>
                <td className="p-4 text-slate-600">{new Date(sale.orderDate).toLocaleDateString()}</td>
                <td className="p-4 text-slate-700 font-medium">{sale.customerName}</td>
                <td className="p-4 text-slate-600">{sale.productCount}</td>
                <td className="p-4 font-semibold text-slate-800">${sale.totalAmount?.toFixed(2)}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center justify-center min-w-[90px] py-1.5 px-3 rounded-full text-xs font-semibold transition-all duration-200 ${
                    sale.status?.toLowerCase() === 'completed' 
                      ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                      : sale.status?.toLowerCase() === 'pending' 
                      ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' 
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}>
                    {sale.status}
                  </span>
                </td>
              </tr>
            ))}
            {reports.salesReport.length === 0 && (
              <tr>
                <td colSpan="6" className="p-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                      <span className="text-3xl opacity-50">📭</span>
                    </div>
                    <p className="text-slate-500 font-medium">No sales data available</p>
                    <p className="text-slate-400 text-sm">Try adjusting your date range</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const InventoryReportTab = () => (
    <div className="opacity-0 animate-[fadeIn_0.4s_ease-out_forwards]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-slate-800 m-0 text-xl sm:text-2xl font-bold flex items-center gap-2">
          <span className="text-2xl">📦</span>
          <span>Inventory Report</span>
        </h2>
        <button 
          onClick={() => exportToCSV(reports.inventoryReport, 'inventory_report')} 
          className="bg-gradient-to-r from-green-500 to-green-600 text-white py-2.5 px-5 rounded-lg font-medium shadow-sm hover:shadow-md hover:from-green-600 hover:to-green-700 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-5 rounded-xl border border-blue-200/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="m-0 text-slate-600 text-xs font-semibold uppercase tracking-wide">Total Stock Value</h4>
            <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <span className="text-lg">💰</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-800 m-0">
            ${reports.inventoryReport.reduce((sum, item) => sum + (item.stockValue || 0), 0).toFixed(2)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 p-5 rounded-xl border border-amber-200/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="m-0 text-slate-600 text-xs font-semibold uppercase tracking-wide">Low Stock Items</h4>
            <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
              <span className="text-lg">⚠️</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-800 m-0">
            {reports.inventoryReport.filter(item => item.isLowStock).length}
          </p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100/50 p-5 rounded-xl border border-red-200/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="m-0 text-slate-600 text-xs font-semibold uppercase tracking-wide">Out of Stock</h4>
            <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center">
              <span className="text-lg">❌</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-800 m-0">
            {reports.inventoryReport.filter(item => item.quantity === 0).length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
        <table className="w-full border-collapse">
          <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
            <tr>
              <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide border-b-2 border-slate-200">Product</th>
              <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide border-b-2 border-slate-200">Category</th>
              <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide border-b-2 border-slate-200">Quantity</th>
              <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide border-b-2 border-slate-200">Unit Price</th>
              <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide border-b-2 border-slate-200">Stock Value</th>
              <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide border-b-2 border-slate-200">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {reports.inventoryReport.map((item, index) => (
              <tr key={index} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors duration-150">
                <td className="p-4 font-medium text-slate-700">{item.productName}</td>
                <td className="p-4 text-slate-600">{item.category}</td>
                <td className="p-4 text-slate-700 font-medium">{item.quantity}</td>
                <td className="p-4 text-slate-600">${item.unitPrice?.toFixed(2)}</td>
                <td className="p-4 font-semibold text-slate-800">${item.stockValue?.toFixed(2)}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center justify-center min-w-[90px] py-1.5 px-3 rounded-full text-xs font-semibold transition-all duration-200 ${
                    item.isLowStock 
                      ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' 
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}>
                    {item.isLowStock ? 'Low Stock' : 'In Stock'}
                  </span>
                </td>
              </tr>
            ))}
            {reports.inventoryReport.length === 0 && (
              <tr>
                <td colSpan="6" className="p-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                      <span className="text-3xl opacity-50">📦</span>
                    </div>
                    <p className="text-slate-500 font-medium">No inventory data available</p>
                    <p className="text-slate-400 text-sm">No products found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const ProductReportTab = () => (
    <div className="opacity-0 animate-[fadeIn_0.4s_ease-out_forwards]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-slate-800 m-0 text-xl sm:text-2xl font-bold flex items-center gap-2">
          <span className="text-2xl">📊</span>
          <span>Product Performance Report</span>
        </h2>
        <button 
          onClick={() => exportToCSV(reports.productReport, 'product_report')} 
          className="bg-gradient-to-r from-green-500 to-green-600 text-white py-2.5 px-5 rounded-lg font-medium shadow-sm hover:shadow-md hover:from-green-600 hover:to-green-700 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
        <table className="w-full border-collapse">
          <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
            <tr>
              <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide border-b-2 border-slate-200">Product</th>
              <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide border-b-2 border-slate-200">Category</th>
              <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide border-b-2 border-slate-200">Units Sold</th>
              <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide border-b-2 border-slate-200">Revenue</th>
              <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide border-b-2 border-slate-200">Avg Rating</th>
              <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide border-b-2 border-slate-200">Stock Left</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {reports.productReport.map((product, index) => (
              <tr key={index} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors duration-150">
                <td className="p-4 font-medium text-slate-700">{product.productName}</td>
                <td className="p-4 text-slate-600">{product.category}</td>
                <td className="p-4 text-slate-700 font-medium">{product.unitsSold}</td>
                <td className="p-4 font-semibold text-slate-800">${product.revenue?.toFixed(2)}</td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1 text-amber-600 font-medium">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {product.avgRating?.toFixed(1)}
                  </span>
                </td>
                <td className="p-4 text-slate-600">{product.stockLeft}</td>
              </tr>
            ))}
            {reports.productReport.length === 0 && (
              <tr>
                <td colSpan="6" className="p-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                      <span className="text-3xl opacity-50">📊</span>
                    </div>
                    <p className="text-slate-500 font-medium">No product data available</p>
                    <p className="text-slate-400 text-sm">No performance metrics found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8 transition-opacity duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-[slideDown_0.5s_ease-out]">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2 flex items-center gap-3">
            <span className="text-4xl">📈</span>
            Reports & Analytics
          </h1>
          <p className="text-slate-600 text-base">Comprehensive business insights and reports</p>
        </div>

        {/* Date Range Filter */}
        <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-slate-200 mb-6 animate-[slideUp_0.5s_ease-out]">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div className="flex-1 w-full sm:w-auto">
              <label className="block font-medium text-slate-700 text-sm mb-2">Start Date</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="w-full py-2.5 px-4 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
              />
            </div>
            <div className="flex-1 w-full sm:w-auto">
              <label className="block font-medium text-slate-700 text-sm mb-2">End Date</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="w-full py-2.5 px-4 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
              />
            </div>
            <button 
              onClick={fetchReports} 
              className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2.5 px-8 rounded-lg font-medium shadow-sm hover:shadow-md hover:from-orange-600 hover:to-orange-700 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Apply Filter
              </span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto bg-white p-1 rounded-xl shadow-sm border border-slate-200 animate-[slideUp_0.6s_ease-out]">
          <button 
            className={`flex-1 min-w-[140px] py-3 px-4 sm:px-6 text-sm sm:text-base font-semibold rounded-lg transition-all duration-200 ${
              activeTab === 'sales' 
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-orange-500'
            }`}
            onClick={() => setActiveTab('sales')}
          >
            <span className="flex items-center justify-center gap-2">
              <span>💰</span>
              <span className="hidden sm:inline">Sales Report</span>
              <span className="sm:hidden">Sales</span>
            </span>
          </button>
          <button 
            className={`flex-1 min-w-[140px] py-3 px-4 sm:px-6 text-sm sm:text-base font-semibold rounded-lg transition-all duration-200 ${
              activeTab === 'inventory' 
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-orange-500'
            }`}
            onClick={() => setActiveTab('inventory')}
          >
            <span className="flex items-center justify-center gap-2">
              <span>📦</span>
              <span className="hidden sm:inline">Inventory</span>
              <span className="sm:hidden">Stock</span>
            </span>
          </button>
          <button 
            className={`flex-1 min-w-[140px] py-3 px-4 sm:px-6 text-sm sm:text-base font-semibold rounded-lg transition-all duration-200 ${
              activeTab === 'product' 
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-orange-500'
            }`}
            onClick={() => setActiveTab('product')}
          >
            <span className="flex items-center justify-center gap-2">
              <span>📊</span>
              <span className="hidden sm:inline">Performance</span>
              <span className="sm:hidden">Products</span>
            </span>
          </button>
        </div>

        {/* Report Content */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 sm:p-8 animate-[slideUp_0.7s_ease-out]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <p className="text-slate-600 text-lg font-medium">Loading reports...</p>
              <p className="text-slate-400 text-sm mt-1">Please wait</p>
            </div>
          ) : (
            <>
              {activeTab === 'sales' && <SalesReportTab />}
              {activeTab === 'inventory' && <InventoryReportTab />}
              {activeTab === 'product' && <ProductReportTab />}
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AdminReports;
