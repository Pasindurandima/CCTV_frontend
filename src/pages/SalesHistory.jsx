import React, { useState, useEffect } from 'react';

function SalesHistory() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Fetch completed orders from backend
  useEffect(() => {
    fetchCompletedOrders();
  }, []);

  const fetchCompletedOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/sales-history');
      if (!response.ok) {
        throw new Error('Failed to fetch sales history');
      }
      const data = await response.json();
      
      // Parse product details from JSON string and transform data
      const salesHistory = data.map(sale => ({
        id: sale.orderId,
        customerName: sale.customerName,
        customerEmail: sale.customerEmail,
        customerPhone: sale.customerPhone,
        shippingAddress: sale.shippingAddress,
        productCount: sale.productCount,
        totalAmount: sale.totalAmount,
        status: 'COMPLETED',
        paymentMethod: sale.paymentMethod,
        orderDate: sale.orderDate,
        completedDate: sale.completedDate,
        items: sale.productDetails ? JSON.parse(sale.productDetails) : []
      })).sort((a, b) => new Date(b.completedDate) - new Date(a.completedDate));
      
      setOrders(salesHistory);
      setFilteredOrders(salesHistory);
      setError(null);
    } catch (err) {
      console.error('Error fetching sales history:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Search functionality
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(order =>
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerPhone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toString().includes(searchTerm)
      );
      setFilteredOrders(filtered);
    }
  }, [searchTerm, orders]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Calculate statistics
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalOrders = orders.length;
  const totalItems = orders.reduce((sum, order) => sum + order.productCount, 0);

  // Group orders by customer
  const customerOrders = filteredOrders.reduce((acc, order) => {
    const key = order.customerEmail;
    if (!acc[key]) {
      acc[key] = {
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        orders: [],
        totalSpent: 0,
        totalOrders: 0
      };
    }
    acc[key].orders.push(order);
    acc[key].totalSpent += order.totalAmount;
    acc[key].totalOrders += 1;
    return acc;
  }, {});

  const customerList = Object.values(customerOrders);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-5 py-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-0">💰 Sales History</h1>
        <div className="text-center py-16 bg-white rounded-xl shadow">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading sales history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-5 py-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-0">💰 Sales History</h1>
        <div className="text-center py-16 bg-white rounded-xl shadow">
          <p>⚠️ Error: {error}</p>
          <button onClick={fetchCompletedOrders} className="bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-600 transition mt-4">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-5 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-slate-800 m-0">💰 Sales History</h1>
        <button onClick={fetchCompletedOrders} className="bg-gradient-to-r from-yellow-300 to-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-600 transition -translate-y-0.5">🔄 Refresh</button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-xl p-6 flex gap-4 items-center shadow hover:-translate-y-1 transition">
          <div className="text-5xl">💵</div>
          <div className="flex-1">
            <h3>Total Revenue</h3>
            <p className="text-3xl font-bold text-slate-800 mt-1">Rs {totalRevenue.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 flex gap-4 items-center shadow hover:-translate-y-1 transition">
          <div className="text-5xl">📦</div>
          <div className="flex-1">
            <h3>Completed Orders</h3>
            <p className="text-3xl font-bold text-slate-800 mt-1">{totalOrders}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 flex gap-4 items-center shadow hover:-translate-y-1 transition">
          <div className="text-5xl">🛍️</div>
          <div className="flex-1">
            <h3>Items Sold</h3>
            <p className="text-3xl font-bold text-slate-800 mt-1">{totalItems}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 flex gap-4 items-center shadow hover:-translate-y-1 transition">
          <div className="text-5xl">👥</div>
          <div className="flex-1">
            <h3>Unique Customers</h3>
            <p className="text-3xl font-bold text-slate-800 mt-1">{customerList.length}</p>
          </div>
        </div>
      </div>

      {/* Search Box */}
      <div className="mb-8">
        <div className="bg-white rounded-xl p-4 shadow flex items-center gap-3">
          <span className="text-2xl text-slate-600">🔍</span>
          <input
            type="text"
            placeholder="Search by customer name, email, phone, or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border-none outline-none text-lg text-slate-800 placeholder:text-slate-400"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="bg-red-500 text-white border-none w-8 h-8 rounded-full cursor-pointer text-lg flex items-center justify-center hover:bg-red-600 transition hover:-rotate-90">✕</button>
          )}
        </div>
      </div>

      {/* Customer Sales History */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow">
          <p>No completed sales found {searchTerm && 'for your search'}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {customerList.map((customer, index) => (
            <div key={index} className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden">
              <div 
                className="p-6 flex justify-between items-center cursor-pointer bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 transition"
                onClick={() => setSelectedCustomer(selectedCustomer === index ? null : index)}
              >
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-800 m-0">👤 {customer.customerName}</h3>
                  <p className="m-2 text-blue-500 text-sm">{customer.customerEmail}</p>
                  {customer.customerPhone && (
                    <p className="m-2 text-slate-600 text-sm">📱 {customer.customerPhone}</p>
                  )}
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-slate-600 font-medium">Total Orders</span>
                    <span className="text-lg font-bold text-slate-800">{customer.totalOrders}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-slate-600 font-medium">Total Spent</span>
                    <span className="text-lg font-bold text-green-600">Rs {customer.totalSpent.toFixed(2)}</span>
                  </div>
                  <button className="bg-blue-500 text-white border-none w-10 h-10 rounded-full cursor-pointer text-lg flex items-center justify-center hover:bg-blue-600 transition">
                    {selectedCustomer === index ? '▲' : '▼'}
                  </button>
                </div>
              </div>

              {selectedCustomer === index && (
                <div className="p-6 bg-slate-50 border-t-2 border-slate-200">
                  <h4 className="m-0 mb-4 text-slate-800 text-lg font-bold">📋 Order History</h4>
                  <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
                    <thead className="bg-gradient-to-r from-purple-600 to-purple-700">
                      <tr>
                        <th className="p-3.5 text-left text-white font-semibold uppercase text-sm tracking-widest">Order ID</th>
                        <th className="p-3.5 text-left text-white font-semibold uppercase text-sm tracking-widest">Date</th>
                        <th className="p-3.5 text-left text-white font-semibold uppercase text-sm tracking-widest">Items</th>
                        <th className="p-3.5 text-left text-white font-semibold uppercase text-sm tracking-widest">Products</th>
                        <th className="p-3.5 text-left text-white font-semibold uppercase text-sm tracking-widest">Amount</th>
                        <th className="p-3.5 text-left text-white font-semibold uppercase text-sm tracking-widest">Payment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customer.orders.map((order) => (
                        <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                          <td className="p-3.5 font-bold text-blue-500">#{order.id}</td>
                          <td className="p-3.5 text-slate-700">{formatDate(order.orderDate)}</td>
                          <td className="p-3.5 text-center text-slate-800">{order.productCount} items</td>
                          <td className="p-3.5">
                            {order.items && order.items.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5">
                                {order.items.map((item, idx) => (
                                  <span key={idx} className="bg-blue-100 text-blue-900 py-1 px-2.5 rounded-full text-xs font-semibold">
                                    {item.productName} x{item.quantity}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">N/A</span>
                            )}
                          </td>
                          <td className="p-3.5 font-bold text-green-600 text-lg">Rs {order.totalAmount.toFixed(2)}</td>
                          <td className="p-3.5">
                            <span className={`inline-block py-1 px-3 rounded-full text-xs font-semibold ${order.paymentMethod === 'cash' ? 'bg-yellow-100 text-amber-900' : 'bg-blue-100 text-blue-900'}`}>
                              {order.paymentMethod === 'cash' ? '💵 COD' : '💳 Online'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-100 border-t-3 border-purple-600">
                      <tr>
                        <td colSpan="4" className="p-4 font-bold text-slate-800 text-right">Customer Total</td>
                        <td className="p-4 font-bold text-blue-500 text-lg">Rs {customer.totalSpent.toFixed(2)}</td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SalesHistory;
