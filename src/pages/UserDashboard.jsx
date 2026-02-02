import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/UserDashboard.css';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0
  });

  useEffect(() => {
    // Get user from localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    
    // Mock orders data (replace with actual API call)
    const mockOrders = [
      { id: 1, date: '2026-01-15', total: 2999, status: 'Delivered', items: 2 },
      { id: 2, date: '2026-01-10', total: 4599, status: 'Shipping', items: 1 },
      { id: 3, date: '2026-01-05', total: 1799, status: 'Processing', items: 3 }
    ];
    setOrders(mockOrders);
    
    // Calculate stats
    setStats({
      totalOrders: mockOrders.length,
      pendingOrders: mockOrders.filter(o => o.status !== 'Delivered').length,
      completedOrders: mockOrders.filter(o => o.status === 'Delivered').length
    });
  }, []);

  return (
    <div className="user-dashboard">
      <div className="dashboard-container">
        {/* Welcome Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Welcome back, {user?.fullName}! 👋</h1>
          <p className="dashboard-subtitle">Here's what's happening with your account</p>
        </div>

        {/* Quick Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <h3>{stats.totalOrders}</h3>
              <p>Total Orders</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h3>{stats.pendingOrders}</h3>
              <p>Pending Orders</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{stats.completedOrders}</h3>
              <p>Completed</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>Rs {orders.reduce((sum, o) => sum + o.total, 0)}</h3>
              <p>Total Spent</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2 className="section-title">Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/store" className="action-card">
              <div className="action-icon">🛒</div>
              <h3>Browse Store</h3>
              <p>Explore our products</p>
            </Link>
            <Link to="/orders" className="action-card">
              <div className="action-icon">📋</div>
              <h3>My Orders</h3>
              <p>Track your purchases</p>
            </Link>
            <Link to="/profile" className="action-card">
              <div className="action-icon">👤</div>
              <h3>Profile</h3>
              <p>Manage your account</p>
            </Link>
            <Link to="/contact" className="action-card">
              <div className="action-icon">📞</div>
              <h3>Support</h3>
              <p>Get help</p>
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="recent-orders">
          <div className="section-header">
            <h2 className="section-title">Recent Orders</h2>
            <Link to="/orders" className="view-all-link">View All →</Link>
          </div>
          
          {orders.length === 0 ? (
            <div className="no-orders">
              <p>No orders yet</p>
              <Link to="/store" className="shop-now-btn">Start Shopping</Link>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div>
                      <h3>Order #{order.id}</h3>
                      <p className="order-date">{order.date}</p>
                    </div>
                    <span className={`order-status status-${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="order-details">
                    <p className="order-items">{order.items} items</p>
                    <p className="order-total">Rs {order.total}</p>
                  </div>
                  <button className="track-btn">Track Order</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Account Info */}
        <div className="account-info">
          <h2 className="section-title">Account Information</h2>
          <div className="info-grid">
            <div className="info-card">
              <div className="info-label">Full Name</div>
              <div className="info-value">{user?.fullName}</div>
            </div>
            <div className="info-card">
              <div className="info-label">Email</div>
              <div className="info-value">{user?.email}</div>
            </div>
            <div className="info-card">
              <div className="info-label">Member Since</div>
              <div className="info-value">January 2026</div>
            </div>
            <div className="info-card">
              <div className="info-label">Account Type</div>
              <div className="info-value">
                <span className="badge-user">Standard User</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
