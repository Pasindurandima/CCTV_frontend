import { useState, useEffect } from 'react';
import '../styles/AdminSales.css';

const AdminSales = () => {
  const [salesData] = useState([
    { id: 1, orderNo: 'ORD-001', product: 'Smart Camera Pro', customer: 'John Doe', amount: 299.99, date: '2026-01-15', status: 'Completed' },
    { id: 2, orderNo: 'ORD-002', product: 'NVR 8 Channel', customer: 'Jane Smith', amount: 899.99, date: '2026-01-15', status: 'Pending' },
    { id: 3, orderNo: 'ORD-003', product: 'Video Doorbell', customer: 'Mike Johnson', amount: 199.99, date: '2026-01-14', status: 'Completed' },
    { id: 4, orderNo: 'ORD-004', product: 'Smart Lock Pro', customer: 'Sarah Wilson', amount: 349.99, date: '2026-01-14', status: 'Completed' },
    { id: 5, orderNo: 'ORD-005', product: 'Wireless Camera Set', customer: 'Tom Brown', amount: 599.99, date: '2026-01-13', status: 'Shipped' },
  ]);

  const totalSales = salesData.reduce((sum, sale) => sum + sale.amount, 0);
  const completedSales = salesData.filter(s => s.status === 'Completed').length;

  return (
    <div className="admin-sales">
      <div className="sales-header">
        <h1>💰 Sales Management</h1>
        <div className="sales-summary">
          <div className="summary-item">
            <h3>Rs {totalSales.toFixed(2)}</h3>
            <p>Total Sales</p>
          </div>
          <div className="summary-item">
            <h3>{salesData.length}</h3>
            <p>Total Orders</p>
          </div>
          <div className="summary-item">
            <h3>{completedSales}</h3>
            <p>Completed</p>
          </div>
        </div>
      </div>

      <div className="sales-table-container">
        <table className="sales-table">
          <thead>
            <tr>
              <th>Order No</th>
              <th>Product</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {salesData.map(sale => (
              <tr key={sale.id}>
                <td className="order-no">{sale.orderNo}</td>
                <td>{sale.product}</td>
                <td>{sale.customer}</td>
                <td className="amount">Rs {sale.amount}</td>
                <td>{sale.date}</td>
                <td>
                  <span className={`status-badge ${sale.status.toLowerCase()}`}>
                    {sale.status}
                  </span>
                </td>
                <td>
                  <button className="view-btn">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSales;
