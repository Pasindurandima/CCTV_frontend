import { useState, useEffect } from 'react';
import '../styles/AdminAnalytics.css';

const AdminAnalytics = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const categoryData = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});

  const brandData = products.reduce((acc, product) => {
    acc[product.brand] = (acc[product.brand] || 0) + 1;
    return acc;
  }, {});

  const priceRanges = {
    '0-200': products.filter(p => p.price < 200).length,
    '200-500': products.filter(p => p.price >= 200 && p.price < 500).length,
    '500-1000': products.filter(p => p.price >= 500 && p.price < 1000).length,
    '1000+': products.filter(p => p.price >= 1000).length
  };

  return (
    <div className="admin-analytics">
      <div className="analytics-header">
        <h1>📈 Analytics & Reports</h1>
        <p>Detailed insights and product performance</p>
      </div>

      <div className="analytics-grid">
        {/* Category Distribution Chart */}
        <div className="analytics-card">
          <h3>📊 Category Distribution</h3>
          <div className="pie-chart-container">
            {Object.entries(categoryData).map(([category, count], index) => (
              <div key={category} className="pie-item">
                <div className="pie-color" style={{ background: `hsl(${index * 60}, 70%, 60%)` }}></div>
                <span className="pie-label">{category}</span>
                <span className="pie-value">{count} ({((count / products.length) * 100).toFixed(1)}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Brand Analysis */}
        <div className="analytics-card">
          <h3>🏢 Top Brands</h3>
          <div className="brand-list">
            {Object.entries(brandData)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 10)
              .map(([brand, count], index) => (
                <div key={brand} className="brand-item">
                  <span className="brand-rank">#{index + 1}</span>
                  <span className="brand-name">{brand}</span>
                  <div className="brand-bar">
                    <div 
                      className="brand-bar-fill" 
                      style={{ width: `${(count / products.length) * 100}%` }}
                    ></div>
                  </div>
                  <span className="brand-count">{count}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Price Range Distribution */}
        <div className="analytics-card full-width">
          <h3>💵 Price Range Distribution</h3>
          <div className="price-range-chart">
            {Object.entries(priceRanges).map(([range, count]) => (
              <div key={range} className="price-range-item">
                <div className="price-range-label">${range}</div>
                <div className="price-range-bar-container">
                  <div 
                    className="price-range-bar" 
                    style={{ height: `${(count / Math.max(...Object.values(priceRanges))) * 100}%` }}
                  >
                    <span className="price-count">{count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="analytics-card full-width">
          <h3>📅 Monthly Performance Trends</h3>
          <div className="trend-chart">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => (
              <div key={month} className="trend-item">
                <div className="trend-bar-container">
                  <div 
                    className="trend-bar" 
                    style={{ height: `${Math.random() * 80 + 20}%` }}
                  ></div>
                </div>
                <div className="trend-label">{month}</div>
                <div className="trend-value">${(Math.random() * 5000 + 1000).toFixed(0)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Performance */}
        <div className="analytics-card full-width">
          <h3>🎯 Product Performance Metrics</h3>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon">👁️</div>
              <div className="metric-info">
                <h4>2,547</h4>
                <p>Total Views</p>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-icon">🛒</div>
              <div className="metric-info">
                <h4>156</h4>
                <p>Cart Additions</p>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-icon">💳</div>
              <div className="metric-info">
                <h4>89</h4>
                <p>Purchases</p>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-icon">📊</div>
              <div className="metric-info">
                <h4>34.9%</h4>
                <p>Conversion Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
