import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalRevenue: 0,
    lowStockProducts: 0,
    recentSales: 156,
    avgPrice: 0
  });

  useEffect(() => {
    setMounted(true);
    fetchProducts();
    // Push a new state to browser history so back button navigates to login
    window.history.pushState({ from: 'dashboard' }, '', window.location.href);
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/products');
      const data = await response.json();
      // Ensure data is an array
      const productList = Array.isArray(data) ? data : [];
      setProducts(productList);
      calculateDashboardStats(productList);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      calculateDashboardStats([]);
    }
  };

  const calculateDashboardStats = (productList) => {
    // Ensure productList is an array
    const validList = Array.isArray(productList) ? productList : [];
    const total = validList.length;
    const categories = new Set(validList.map(p => p.category));
    const totalRev = validList.reduce((sum, p) => sum + (p.price * 10), 0); // Simulated sales
    const avgPrice = total > 0 ? (validList.reduce((sum, p) => sum + p.price, 0) / total).toFixed(2) : 0;

    setStats({
      totalProducts: total,
      totalCategories: categories.size,
      totalRevenue: totalRev.toFixed(2),
      lowStockProducts: Math.floor(total * 0.15), // Simulated
      recentSales: 156,
      avgPrice: avgPrice
    });
  };

  const categoryData = Array.isArray(products) ? products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {}) : {};

  const handleBackNavigation = () => {
    navigate('/admin/login');
  };

  // Listen for back button
  useEffect(() => {
    const handlePopState = () => {
      navigate('/admin/login');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigate]);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 transition-opacity duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
   

      {/* Main Content */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-5">
        <div className="max-w-7xl mx-auto">
          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-8 sm:mb-10 md:mb-12">
            {/* Total Products Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 p-4 sm:p-5 md:p-6">
              <div className="flex items-start justify-between gap-2 sm:gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg">📦</span>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm font-semibold uppercase tracking-wide">Total Products</p>
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-bold text-slate-800">{stats.totalProducts}</h3>
                  <p className="text-xs text-slate-500 mt-1.5">In inventory</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-xl flex-shrink-0">
                  <img src="/assets/total products.png" alt="Total Products" className="h-10 sm:h-11 md:h-12 w-10 sm:w-11 md:w-12 object-contain opacity-80" />
                </div>
              </div>
            </div>

            {/* Revenue Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 p-4 sm:p-5 md:p-6">
              <div className="flex items-start justify-between gap-2 sm:gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg">💵</span>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm font-semibold uppercase tracking-wide">Total Revenue</p>
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-bold text-slate-800">${stats.totalRevenue}</h3>
                  <p className="text-xs text-slate-500 mt-1.5">This month</p>
                </div>
                 {/* <div className="bg-blue-50 p-2 sm:p-3 rounded-lg flex-shrink-0">
                <img src="/assets/total revenue.png" alt="Total Revenue" className="h-10 sm:h-11 md:h-12 w-10 sm:w-11 md:w-12 object-contain" />
                </div>  */}
              </div>
            </div>

            {/* Recent Sales Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 p-4 sm:p-5 md:p-6">
              <div className="flex items-start justify-between gap-2 sm:gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg">📈</span>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm font-semibold uppercase tracking-wide">Recent Sales</p>
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-bold text-slate-800">{stats.recentSales}</h3>
                  <p className="text-xs text-slate-500 mt-1.5">Orders completed</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-xl flex-shrink-0">
                  <img src="/assets/recent sales.png" alt="Recent Sales" className="h-10 sm:h-11 md:h-12 w-10 sm:w-11 md:w-12 object-contain opacity-80" />
                </div>
              </div>
            </div>

            {/* Low Stock Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 p-4 sm:p-5 md:p-6">
              <div className="flex items-start justify-between gap-2 sm:gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg">⚠️</span>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm font-semibold uppercase tracking-wide">Low Stock Items</p>
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-bold text-slate-800">{stats.lowStockProducts}</h3>
                  <p className="text-xs text-slate-500 mt-1.5">Need attention</p>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-3 rounded-xl flex-shrink-0">
                  <img src="/assets/low stock.png" alt="Low Stock" className="h-10 sm:h-11 md:h-12 w-10 sm:w-11 md:w-12 object-contain opacity-80" />
                </div>
              </div>
            </div>
          </div>

          {/* Two Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8 mb-6 md:mb-8">
            {/* Category Distribution */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 ease-in-out p-4 sm:p-6 md:p-8">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 mb-4 md:mb-6 flex items-center gap-2">
                <span className="text-2xl">📊</span>
                <span>Products by Category</span>
              </h3>
              <div className="space-y-3 md:space-y-4">
                {Object.entries(categoryData).length > 0 ? (
                  Object.entries(categoryData).map(([category, count]) => {
                    const percentage = (count / stats.totalProducts) * 100;
                    return (
                      <div key={category} className="space-y-1.5 md:space-y-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-gray-700 text-xs sm:text-sm md:text-base truncate">{category}</span>
                          <span className="bg-orange-100 text-orange-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold flex-shrink-0 ml-2">{count}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 md:h-3 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-orange-500 to-white-400 h-full transition-all duration-500 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 text-center py-6 md:py-8 text-sm">No category data available</p>
                )}
              </div>
            </div>

            {/* Quick Statistics */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 ease-in-out p-4 sm:p-6 md:p-8">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 mb-4 md:mb-6 flex items-center gap-2">
                <span className="text-2xl">💹</span>
                <span>Quick Stats</span>
              </h3>
              <div className="space-y-3 md:space-y-4">
                <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 p-3 md:p-4 rounded-lg border border-orange-200/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <p className="text-slate-600 text-xs sm:text-sm font-medium mb-1">Categories</p>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-800">{stats.totalCategories}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-3 md:p-4 rounded-lg border border-blue-200/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <p className="text-slate-600 text-xs sm:text-sm font-medium mb-1">Avg Price</p>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-800">${stats.avgPrice}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-3 md:p-4 rounded-lg border border-purple-200/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <p className="text-slate-600 text-xs sm:text-sm font-medium mb-1">Conversion</p>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-800">12.5%</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-3 md:p-4 rounded-lg border border-green-200/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <p className="text-slate-600 text-xs sm:text-sm font-medium mb-1">Total Views</p>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-800">2,547</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 ease-in-out p-4 sm:p-6 md:p-8 mb-6 md:mb-8">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 mb-4 md:mb-6 flex items-center gap-2">
              <span className="text-2xl">🕐</span>
              <span>Recent Activity</span>
            </h3>
            <div className="space-y-2.5 md:space-y-4">
              <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 border-l-4 border-green-500 bg-green-50 rounded-r-lg hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ease-in-out">
                <span className="text-xl md:text-2xl flex-shrink-0">✅</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm md:text-base">New product "Smart Camera Pro" added</p>
                  <p className="text-xs md:text-sm text-slate-600">Product inventory updated</p>
                </div>
                <span className="text-xs text-slate-500 bg-white px-2 md:px-3 py-0.5 md:py-1 rounded flex-shrink-0 ml-2 whitespace-nowrap">2 hours ago</span>
              </div>
              <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ease-in-out">
                <span className="text-xl md:text-2xl flex-shrink-0">💰</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm md:text-base">Sale completed: $1,299.99</p>
                  <p className="text-xs md:text-sm text-slate-600">CCTV camera package order</p>
                </div>
                <span className="text-xs text-slate-500 bg-white px-2 md:px-3 py-0.5 md:py-1 rounded flex-shrink-0 ml-2 whitespace-nowrap">5 hours ago</span>
              </div>
              <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 border-l-4 border-orange-500 bg-orange-50 rounded-r-lg hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ease-in-out">
                <span className="text-xl md:text-2xl flex-shrink-0">⚠️</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm md:text-base">Low stock alert: Wireless Camera</p>
                  <p className="text-xs md:text-sm text-slate-600">Inventory below minimum threshold</p>
                </div>
                <span className="text-xs text-slate-500 bg-white px-2 md:px-3 py-0.5 md:py-1 rounded flex-shrink-0 ml-2 whitespace-nowrap">1 day ago</span>
              </div>
              <div className="flex items-center gap-4 p-4 border-l-4 border-purple-500 bg-purple-50 rounded-r-lg hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ease-in-out">
                <span className="text-2xl">📝</span>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">Product updated: Night Vision NVR</p>
                  <p className="text-sm text-slate-600">Product specifications modified</p>
                </div>
                <span className="text-sm text-slate-500 bg-white px-3 py-1 rounded">2 days ago</span>
              </div>
            </div>
          </div>

          {/* Top Selling Products */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 ease-in-out p-4 sm:p-6 md:p-8">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 mb-4 md:mb-6 flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              <span>Top Selling Products</span>
            </h3>
            <div className="space-y-2.5 md:space-y-3 overflow-x-auto">
              {products.slice(0, 5).length > 0 ? (
                products.slice(0, 5).map((product, index) => (
                  <div key={product.id} className="flex items-center gap-2 sm:gap-3 md:gap-4 p-3 md:p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ease-in-out border border-slate-100">
                    <div className="flex items-center justify-center w-8 sm:w-9 md:w-10 h-8 sm:h-9 md:h-10 bg-gradient-to-br from-orange-500 to-orange-600 text-white font-bold rounded-full flex-shrink-0 text-xs sm:text-sm">
                      #{index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 text-xs sm:text-sm md:text-base truncate">{product.name}</p>
                      <p className="text-xs md:text-sm text-slate-600 truncate">{product.category}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-slate-800 text-xs sm:text-sm md:text-base">${product.price}</p>
                      <p className="text-xs text-slate-500">{Math.floor(Math.random() * 50 + 10)} sales</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-center py-6 md:py-8 text-sm">No products available</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
