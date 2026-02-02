import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import AdminNavbar from './components/AdminNavbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Store from './pages/Store';
import ProductDetail from './pages/ProductDetail';
import ContactUs from './pages/ContactUs';
import AboutUs from './pages/AboutUs';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import AdminDashboard from './pages/AdminDashboard';
import AdminPanel from './pages/AdminPanel';
import AdminInventory from './pages/AdminInventory';
import AdminOrders from './pages/AdminOrders';
import AdminReports from './pages/AdminReports';
import AdminCategories from './pages/AdminCategories';
import SalesHistory from './pages/SalesHistory';
import ProfitAnalytics from './pages/ProfitAnalytics';

function AppContent() {
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin
  useEffect(() => {
    const checkUserRole = () => {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      setIsAdmin(user && user.role === 'ADMIN');
    };

    // Check on mount and location change
    checkUserRole();

    // Listen for storage changes (for logout in different tabs)
    window.addEventListener('storage', checkUserRole);
    
    // Custom event for login/logout
    window.addEventListener('authChange', checkUserRole);

    return () => {
      window.removeEventListener('storage', checkUserRole);
      window.removeEventListener('authChange', checkUserRole);
    };
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Conditional Navbar based on user role - Hide on login page */}
      {location.pathname !== '/admin/login' && (isAdmin ? <AdminNavbar /> : <Navbar />)}
        
        <main className={location.pathname === '/admin/login' ? 'flex-1' : 'flex-1 pt-[70px]'}>
          <Routes>
            {/* Admin Login Route */}
            <Route path="/admin/login" element={<Login />} />
            
            {/* Public User Routes - No authentication required */}
            <Route path="/" element={<Home />} />
            <Route path="/store" element={<Store />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            
            {/* Admin Routes - Protected and only for ADMIN role */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/products" 
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/categories" 
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminCategories />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/inventory" 
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminInventory />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/orders" 
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminOrders />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/sales-history" 
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <SalesHistory />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/profit-analytics" 
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <ProfitAnalytics />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/reports" 
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminReports />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
  );
}

function App() {
  return (
    <CartProvider>
      <Router>
        <AppContent />
      </Router>
    </CartProvider>
  );
}

export default App;
