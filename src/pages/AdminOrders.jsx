import React, { useState, useEffect } from 'react';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterPayment, setFilterPayment] = useState('all'); // all, cash, online
  const [filterStatus, setFilterStatus] = useState('all'); // all, pending, completed, cancelled
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch orders from backend
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/orders');
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      // Sort by date, newest first
      const sortedOrders = data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
      setOrders(sortedOrders);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8080/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        // Update the orders list immediately
        setOrders(orders.map(order => 
          order.id === orderId ? updatedOrder : order
        ));
        // Update selected order if it's the current one
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(updatedOrder);
        }
        // Show success message
        const statusEmoji = {
          'PENDING': '⏳',
          'PROCESSING': '🔄',
          'SHIPPED': '🚚',
          'COMPLETED': '✅',
          'CANCELLED': '❌'
        };
        alert(`${statusEmoji[newStatus] || '✓'} Order #${orderId} status updated to ${newStatus}`);
      } else {
        const errorText = await response.text();
        alert(`Failed to update order status: ${errorText || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error updating order:', err);
      alert(`Error updating order status: ${err.message}`);
    }
  };

  const deleteOrder = async (orderId) => {
    if (window.confirm(`⚠️ Are you sure you want to delete Order #${orderId}?\n\nThis action cannot be undone.`)) {
      try {
        const response = await fetch(`http://localhost:8080/api/orders/${orderId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Remove the order from the local state immediately
          setOrders(orders.filter(order => order.id !== orderId));
          setSelectedOrder(null);
          alert(`🗑️ Order #${orderId} has been deleted successfully`);
        } else {
          const errorText = await response.text();
          alert(`Failed to delete order: ${errorText || 'Unknown error'}`);
        }
      } catch (err) {
        console.error('Error deleting order:', err);
        alert(`Error deleting order: ${err.message}`);
      }
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const paymentMatch = filterPayment === 'all' || order.paymentMethod === filterPayment;
    const statusMatch = filterStatus === 'all' || order.status.toLowerCase() === filterStatus;
    return paymentMatch && statusMatch;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-5 py-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-0">📦 Order Management</h1>
        <div className="text-center py-16 bg-white rounded-xl shadow">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-5 py-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-0">📦 Order Management</h1>
        <div className="text-center py-16 bg-white rounded-xl shadow">
          <p>⚠️ Error: {error}</p>
          <button onClick={fetchOrders} className="bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-600 transition mt-4">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-5 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-slate-800 m-0">📦 Order Management</h1>
        <button onClick={fetchOrders} className="bg-gradient-to-r from-yellow-200 to-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-600 transition -translate-y-0.5">🔄 Refresh</button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-xl p-6 flex gap-4 items-center shadow hover:-translate-y-1 transition">
          <div className="text-5xl">📋</div>
          <div className="flex-1">
            <h3>Total Orders</h3>
            <p className="text-3xl font-bold text-slate-800 mt-1">{orders.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 flex gap-4 items-center shadow hover:-translate-y-1 transition">
          <div className="text-5xl">⏳</div>
          <div className="flex-1">
            <h3>Pending</h3>
            <p className="text-3xl font-bold text-slate-800 mt-1">{orders.filter(o => o.status === 'PENDING').length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 flex gap-4 items-center shadow hover:-translate-y-1 transition">
          <div className="text-5xl">💵</div>
          <div className="flex-1">
            <h3>Cash on Delivery</h3>
            <p className="text-3xl font-bold text-slate-800 mt-1">{orders.filter(o => o.paymentMethod === 'cash').length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 flex gap-4 items-center shadow hover:-translate-y-1 transition">
          <div className="text-5xl">💳</div>
          <div className="flex-1">
            <h3>Online Payment</h3>
            <p className="text-3xl font-bold text-slate-800 mt-1">{orders.filter(o => o.paymentMethod === 'online').length}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-xl mb-5 flex gap-5 flex-wrap shadow">
        <div className="flex gap-2 items-center">
          <label className="font-semibold text-slate-600">Payment Method:</label>
          <select value={filterPayment} onChange={(e) => setFilterPayment(e.target.value)} className="py-2 px-4 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500">
            <option value="all">All Payments</option>
            <option value="cash">Cash on Delivery</option>
            <option value="online">Online Payment</option>
          </select>
        </div>
        <div className="flex gap-2 items-center">
          <label className="font-semibold text-slate-600">Status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="py-2 px-4 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl p-5 shadow overflow-x-auto">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow">
            <p>No orders found matching the filters</p>
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="p-4 text-left font-semibold text-slate-600 border-b-2 border-slate-200">Order ID</th>
                <th className="p-4 text-left font-semibold text-slate-600 border-b-2 border-slate-200">Customer</th>
                <th className="p-4 text-left font-semibold text-slate-600 border-b-2 border-slate-200">Contact</th>
                <th className="p-4 text-left font-semibold text-slate-600 border-b-2 border-slate-200">Items</th>
                <th className="p-4 text-left font-semibold text-slate-600 border-b-2 border-slate-200">Total</th>
                <th className="p-4 text-left font-semibold text-slate-600 border-b-2 border-slate-200">Payment</th>
                <th className="p-4 text-left font-semibold text-slate-600 border-b-2 border-slate-200">Status</th>
                <th className="p-4 text-left font-semibold text-slate-600 border-b-2 border-slate-200">Date</th>
                <th className="p-4 text-left font-semibold text-slate-600 border-b-2 border-slate-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} onClick={() => setSelectedOrder(order)} className="cursor-pointer hover:bg-slate-50 transition">
                  <td className="p-4 border-b border-slate-200 font-bold text-orange-500">#{order.id}</td>
                  <td className="p-4 border-b border-slate-200">{order.customerName}</td>
                  <td className="p-4 border-b border-slate-200">
                    <div className="flex flex-col gap-1">
                      <div>{order.customerEmail}</div>
                      <div className="text-sm text-slate-600">{order.customerPhone || 'N/A'}</div>
                    </div>
                  </td>
                  <td className="p-4 border-b border-slate-200 text-center">
                    <span className="inline-block py-1 px-2.5 bg-indigo-100 text-orange-500 rounded-full text-sm font-semibold">
                      {order.productCount} {order.productCount === 1 ? 'item' : 'items'}
                    </span>
                  </td>
                  <td className="p-4 border-b border-slate-200 font-bold text-black text-m">Rs {order.totalAmount?.toFixed(2)}</td>
                  <td className="p-4 border-b border-slate-200">
                    <span className={`inline-block py-1.5 px-3 rounded-full text-sm font-semibold ${order.paymentMethod === 'cash' ? 'bg-yellow-100 text-amber-900' : 'bg-blue-100 text-blue-900'}`}>
                      {order.paymentMethod === 'cash' ? '💵 COD' : '💳 Online'}
                    </span>
                  </td>
                  <td className="p-4 border-b border-slate-200">
                    <span className={`inline-block py-1.5 px-3 rounded-full text-sm font-semibold uppercase ${order.status?.toLowerCase() === 'pending' ? 'bg-yellow-100 text-amber-900' : order.status?.toLowerCase() === 'processing' ? 'bg-blue-100 text-blue-900' : order.status?.toLowerCase() === 'shipped' ? 'bg-indigo-100 text-indigo-700' : order.status?.toLowerCase() === 'completed' ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 border-b border-slate-200 text-slate-600 text-sm">{formatDate(order.orderDate)}</td>
                  <td className="p-4 border-b border-slate-200">
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(order);
                        }}
                        className="bg-orange-500 text-white py-2 px-3 rounded hover:bg-blue-600 transition scale-100 hover:scale-110"
                        title="View Details"
                      >
                        👁️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-white bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-[1000] p-4 sm:p-8" onClick={() => setSelectedOrder(null)}>
          <div className="bg-slate-100 rounded-3xl max-w-6xl w-[95vw] lg:w-[90vw] max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/15 border border-slate-200 animate-in" onClick={(e) => e.stopPropagation()}>
            {/* Header with Status Badge */}
            <div className="bg-black py-6 px-8 flex justify-between items-center rounded-3xl rounded-b-none text-white">
              <div className="flex items-center gap-4">
                <h2 className="text-3xl font-bold">Order #{selectedOrder.id}</h2>
                <span className={`py-2 px-5 rounded-full text-sm font-bold uppercase tracking-wide ${selectedOrder.status?.toLowerCase() === 'pending' ? 'bg-yellow-400 bg-opacity-20' : selectedOrder.status?.toLowerCase() === 'processing' ? 'bg-blue-400 bg-opacity-20' : selectedOrder.status?.toLowerCase() === 'shipped' ? 'bg-indigo-400 bg-opacity-20' : selectedOrder.status?.toLowerCase() === 'completed' ? 'bg-green-400 bg-opacity-20' : 'bg-red-400 bg-opacity-20'}`}>
                  {selectedOrder.status}
                </span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="bg-orange bg-opacity-20 border-none text-white text-3xl cursor-pointer w-11 h-11 rounded-full flex items-center justify-center hover:bg-opacity-30 transition -rotate-0 hover:rotate-90">✕</button>
            </div>
            
            <div className="p-6">
              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* LEFT COLUMN - Customer & Order Info */}
                <div className="flex flex-col gap-5">
                  
                  {/* Customer Information Card */}
                  <div className="bg-white rounded-2xl shadow overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition">
                    <div className="bg-gradient-to-r from-slate-100 to-slate-200 py-4 px-5 border-b-2 border-slate-200">
                      <h3 className="text-lg font-bold text-slate-800 m-0">👤 Customer Details</h3>
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-center py-3 border-b border-slate-100">
                        <span className="font-semibold text-slate-600 text-sm">Name</span>
                        <span className="font-medium text-slate-800 text-sm text-right">{selectedOrder.customerName}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-slate-100">
                        <span className="font-semibold text-slate-600 text-sm">Email</span>
                        <span className="font-medium text-slate-800 text-sm text-right">{selectedOrder.customerEmail}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-slate-100">
                        <span className="font-semibold text-slate-600 text-sm">Phone</span>
                        <span className="font-medium text-slate-800 text-sm text-right">{selectedOrder.customerPhone || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center py-3">
                        <span className="font-semibold text-slate-600 text-sm">Address</span>
                        <span className="font-medium text-slate-800 text-sm text-right">{selectedOrder.shippingAddress || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Information Card */}
                  <div className="bg-white rounded-2xl shadow overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition">
                    <div className="bg-gradient-to-r from-slate-100 to-slate-200 py-4 px-5 border-b-2 border-slate-200">
                      <h3 className="text-lg font-bold text-slate-800 m-0">📋 Order Details</h3>
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-center py-3 border-b border-slate-100">
                        <span className="font-semibold text-slate-600 text-sm">Order ID</span>
                        <span className="font-medium text-slate-800 text-sm text-right">#{selectedOrder.id}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-slate-100">
                        <span className="font-semibold text-slate-600 text-sm">Date</span>
                        <span className="font-medium text-slate-800 text-sm text-right">{new Date(selectedOrder.orderDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-slate-100">
                        <span className="font-semibold text-slate-600 text-sm">Time</span>
                        <span className="font-medium text-slate-800 text-sm text-right">{new Date(selectedOrder.orderDate).toLocaleTimeString()}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-slate-100">
                        <span className="font-semibold text-slate-600 text-sm">Total Items</span>
                        <span className="font-medium text-slate-800 text-sm text-right">{selectedOrder.productCount} {selectedOrder.productCount === 1 ? 'item' : 'items'}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-slate-100">
                        <span className="font-semibold text-slate-600 text-sm">Payment</span>
                        <span className={`inline-block py-1 px-3 rounded-full text-xs font-semibold ${selectedOrder.paymentMethod === 'cash' ? 'bg-yellow-100 text-amber-900' : 'bg-blue-100 text-blue-900'}`}>
                          {selectedOrder.paymentMethod === 'cash' ? '💵 COD' : '💳 Online'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-3 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 mx-(-5) mb-(-5) rounded-b-2xl">
                        <span className="font-semibold text-slate-600 text-sm">Total Amount</span>
                        <span className="text-2xl font-bold text-orange-500">Rs {selectedOrder.totalAmount?.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Notes if exists */}
                  {selectedOrder.notes && (
                    <div className="bg-white rounded-2xl shadow overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition">
                      <div className="bg-gradient-to-r from-slate-100 to-slate-200 py-4 px-5 border-b-2 border-slate-200">
                        <h3 className="text-lg font-bold text-slate-800 m-0">📝 Notes</h3>
                      </div>
                      <div className="p-5">
                        <p className="m-0 text-slate-700 leading-relaxed bg-slate-50 p-3 rounded border-l-4 border-blue-500">{selectedOrder.notes}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* RIGHT COLUMN - Products & Actions */}
                <div className="flex flex-col gap-5">
                  
                  {/* Products Ordered Card */}
                  <div className="bg-white rounded-2xl shadow overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition">
                    <div className="bg-gradient-to-r from-slate-100 to-slate-200 py-4 px-5 border-b-2 border-slate-200">
                      <h3 className="text-lg font-bold text-slate-800 m-0">🛍️ Products Ordered</h3>
                    </div>
                    <div className="p-5">
                      {selectedOrder.items && selectedOrder.items.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-orange-500">
                                <th className="p-3.5 text-left text-white font-semibold text-sm uppercase tracking-widest">Product</th>
                                <th className="p-3.5 text-left text-white font-semibold text-sm uppercase tracking-widest">Qty</th>
                                <th className="p-3.5 text-left text-white font-semibold text-sm uppercase tracking-widest">Price</th>
                                <th className="p-3.5 text-left text-white font-semibold text-sm uppercase tracking-widest">Subtotal</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedOrder.items.map((item, index) => (
                                <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                  <td className="p-3.5 font-semibold text-slate-800">{item.productName}</td>
                                  <td className="p-3.5 text-center font-bold text-orange-500">{item.quantity}</td>
                                  <td className="p-3.5 text-right text-slate-600">Rs {item.price.toFixed(2)}</td>
                                  <td className="p-3.5 text-right font-bold text-blue-600">Rs {(item.price * item.quantity).toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot className="bg-slate-50 border-t-3 border-orange-600">
                              <tr>
                                <td colSpan="3" className="p-4 font-bold text-slate-800">Total</td>
                                <td className="p-2 font-bold text-orange-500 text-lg">Rs {selectedOrder.totalAmount?.toFixed(2)}</td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-10 text-slate-600 italic bg-slate-50 rounded border-2 border-dashed border-slate-200">No product details available</div>
                      )}
                    </div>
                  </div>

                  {/* Status Update Card */}
                  <div className="bg-white rounded-2xl shadow overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition">
                    <div className="bg-gradient-to-r from-slate-100 to-slate-200 py-4 px-5 border-b-2 border-slate-200">
                      <h3 className="text-lg font-bold text-slate-800 m-0">🔄 Update Status</h3>
                    </div>
                    <div className="p-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <button
                          onClick={() => updateOrderStatus(selectedOrder.id, 'PENDING')}
                          className={`flex flex-col items-center gap-2 p-4 border-2 rounded-2xl cursor-pointer transition ${selectedOrder.status === 'PENDING' ? 'bg-yellow-100 border-yellow-400 scale-105 shadow-lg' : 'bg-yellow-100 border-transparent hover:shadow-md'} ${selectedOrder.status === 'PENDING' ? '' : ''}`}
                          disabled={selectedOrder.status === 'PENDING'}
                        >
                          <span className="text-2xl">⏳</span>
                          <span className="text-xs uppercase tracking-wide font-semibold text-amber-900">Pending</span>
                        </button>
                        <button
                          onClick={() => updateOrderStatus(selectedOrder.id, 'PROCESSING')}
                          className={`flex flex-col items-center gap-2 p-4 border-2 rounded-2xl cursor-pointer transition ${selectedOrder.status === 'PROCESSING' ? 'bg-blue-100 border-blue-400 scale-105 shadow-lg' : 'bg-blue-100 border-transparent hover:shadow-md'} ${selectedOrder.status === 'PROCESSING' ? '' : ''}`}
                          disabled={selectedOrder.status === 'PROCESSING'}
                        >
                          <span className="text-2xl">🔄</span>
                          <span className="text-xs uppercase tracking-wide font-semibold text-blue-900">Processing</span>
                        </button>
                        <button
                          onClick={() => updateOrderStatus(selectedOrder.id, 'SHIPPED')}
                          className={`flex flex-col items-center gap-2 p-4 border-2 rounded-2xl cursor-pointer transition ${selectedOrder.status === 'SHIPPED' ? 'bg-indigo-100 border-indigo-400 scale-105 shadow-lg' : 'bg-indigo-100 border-transparent hover:shadow-md'} ${selectedOrder.status === 'SHIPPED' ? '' : ''}`}
                          disabled={selectedOrder.status === 'SHIPPED'}
                        >
                          <span className="text-2xl">🚚</span>
                          <span className="text-xs uppercase tracking-wide font-semibold text-indigo-700">Shipped</span>
                        </button>
                        <button
                          onClick={() => updateOrderStatus(selectedOrder.id, 'COMPLETED')}
                          className={`flex flex-col items-center gap-2 p-4 border-2 rounded-2xl cursor-pointer transition ${selectedOrder.status === 'COMPLETED' ? 'bg-green-100 border-green-400 scale-105 shadow-lg' : 'bg-green-100 border-transparent hover:shadow-md'} ${selectedOrder.status === 'COMPLETED' ? '' : ''}`}
                          disabled={selectedOrder.status === 'COMPLETED'}
                        >
                          <span className="text-2xl">✅</span>
                          <span className="text-xs uppercase tracking-wide font-semibold text-green-900">Completed</span>
                        </button>
                        <button
                          onClick={() => updateOrderStatus(selectedOrder.id, 'CANCELLED')}
                          className={`flex flex-col items-center gap-2 p-4 border-2 rounded-2xl cursor-pointer transition ${selectedOrder.status === 'CANCELLED' ? 'bg-red-100 border-red-400 scale-105 shadow-lg' : 'bg-red-100 border-transparent hover:shadow-md'} ${selectedOrder.status === 'CANCELLED' ? '' : ''}`}
                          disabled={selectedOrder.status === 'CANCELLED'}
                        >
                          <span className="text-2xl">❌</span>
                          <span className="text-xs uppercase tracking-wide font-semibold text-red-900">Cancelled</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => window.print()}
                      className="flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 shadow hover:shadow-lg transition -translate-y-0.5"
                    >
                      🖨️ Print Order
                    </button>
                    <button
                      onClick={() => deleteOrder(selectedOrder.id)}
                      className="flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold hover:from-red-600 hover:to-red-700 shadow hover:shadow-lg transition -translate-y-0.5"
                    >
                      🗑️ Delete Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
