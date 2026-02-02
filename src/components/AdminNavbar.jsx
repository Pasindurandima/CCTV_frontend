import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

function AdminNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = React.useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    // Dispatch custom event to notify App component of auth change
    window.dispatchEvent(new Event('authChange'));
    navigate('/admin/login');
  };

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white flex justify-center items-center text-base fixed top-0 w-full z-[999] shadow-md border-b border-gray-200">
      <div className="flex justify-between items-center w-full max-w-[1400px] px-4 md:px-6 lg:px-12 py-3 lg:py-0 h-auto lg:h-[70px]">
        
         {/* Logo */}
        <Link to="/admin/dashboard" className="text-black cursor-pointer no-underline font-bold flex items-center hover:opacity-75 transition-opacity flex-shrink-0">
          <img src="/assets/logo.jpg" alt="SecU Engineering Logo" className="h-10 sm:h-12 md:h-14 lg:h-16 object-contain" />
          <div className="ml-2 md:ml-3 lg:ml-4 flex flex-col md:flex-row items-start md:items-center">
            <span className="text-orange-500 font-bold text-base md:text-lg lg:text-2xl leading-none">SecU</span>
            <span className="text-black-800 font-normal text-xs md:text-sm lg:text-base ml-0 md:ml-1 leading-none">Engineering</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
<ul className="hidden lg:flex items-center justify-center list-none gap-2 h-full mx-6 xl:mx-8">
          <li className="h-full flex items-center">
            <Link to="/admin/dashboard" className={`text-gray-700 no-underline px-3 xl:px-4 h-full flex items-center transition-all hover:text-orange-500 font-medium border-b-2 text-sm xl:text-base ${isActive('/admin/dashboard') ? 'text-orange-500 border-orange-500' : 'border-transparent'}`}>
              Dashboard
            </Link>
          </li>
          <li className="h-full flex items-center">
            <Link to="/admin/products" className={`text-gray-700 no-underline px-3 xl:px-4 h-full flex items-center transition-all hover:text-orange-500 font-medium border-b-2 text-sm xl:text-base ${isActive('/admin/products') ? 'text-orange-500 border-orange-500' : 'border-transparent'}`}>
              Add Products
            </Link>
          </li>
          <li className="h-full flex items-center">
            <Link to="/admin/inventory" className={`text-gray-700 no-underline px-3 xl:px-4 h-full flex items-center transition-all hover:text-orange-500 font-medium border-b-2 text-sm xl:text-base ${isActive('/admin/inventory') ? 'text-orange-500 border-orange-500' : 'border-transparent'}`}>
              Inventory
            </Link>
          </li>
          <li className="h-full flex items-center">
            <Link to="/admin/orders" className={`text-gray-700 no-underline px-3 xl:px-4 h-full flex items-center transition-all hover:text-orange-500 font-medium border-b-2 text-sm xl:text-base ${isActive('/admin/orders') ? 'text-orange-500 border-orange-500' : 'border-transparent'}`}>
              Orders
            </Link>
          </li>
          <li className="h-full flex items-center">
            <Link to="/admin/sales-history" className={`text-gray-700 no-underline px-3 xl:px-4 h-full flex items-center transition-all hover:text-orange-500 font-medium border-b-2 text-sm xl:text-base ${isActive('/admin/sales-history') ? 'text-orange-500 border-orange-500' : 'border-transparent'}`}>
              Sales
            </Link>
          </li>
          <li className="h-full flex items-center">
            <Link to="/admin/profit-analytics" className={`text-gray-700 no-underline px-3 xl:px-4 h-full flex items-center transition-all hover:text-orange-500 font-medium border-b-2 text-sm xl:text-base ${isActive('/admin/profit-analytics') ? 'text-orange-500 border-orange-500' : 'border-transparent'}`}>
              Analytics
            </Link>
          </li>
          <li className="h-full flex items-center">
            <Link to="/admin/reports" className={`text-gray-700 no-underline px-3 xl:px-4  flex items-center transition-all hover:text-orange-500 font-medium border-b-2 text-sm xl:text-base ${isActive('/admin/reports') ? 'text-orange-500 border-orange-500' : 'border-transparent'}`}>
              Reports
            </Link>
          </li>
        </ul>

        {/* Logout Button - Desktop */}
        {user && (
       <button
          type="button"
          onClick={handleLogout}
          className="hidden lg:flex h-9 bg-orange-500 text-white px-5 items-center gap-2 rounded"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 fill-white"
            viewBox="0 0 24 24"
          >
            <path d="M16 17v-2H7V9h9V7l5 5-5 5z"/>
          </svg>
          Logout
        </button>

        )}

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-gray-700 hover:text-orange-500 transition-colors p-2"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed top-16 md:top-20 left-0 right-0 bg-white shadow-lg border-b border-gray-200 lg:hidden max-h-[calc(100vh-70px)] overflow-y-auto z-[998]">
          <ul className="list-none p-4 space-y-2">
            <li>
              <Link
                to="/admin/dashboard"
                onClick={handleLinkClick}
                className={`block w-full text-left px-4 py-3 rounded transition-all font-medium text-sm md:text-base ${
                  isActive('/admin/dashboard')
                    ? 'bg-orange-100 text-orange-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/admin/products"
                onClick={handleLinkClick}
                className={`block w-full text-left px-4 py-3 rounded transition-all font-medium text-sm md:text-base ${
                  isActive('/admin/products')
                    ? 'bg-orange-100 text-orange-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Add Products
              </Link>
            </li>
            <li>
              <Link
                to="/admin/inventory"
                onClick={handleLinkClick}
                className={`block w-full text-left px-4 py-3 rounded transition-all font-medium text-sm md:text-base ${
                  isActive('/admin/inventory')
                    ? 'bg-orange-100 text-orange-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Inventory
              </Link>
            </li>
            <li>
              <Link
                to="/admin/orders"
                onClick={handleLinkClick}
                className={`block w-full text-left px-4 py-3 rounded transition-all font-medium text-sm md:text-base ${
                  isActive('/admin/orders')
                    ? 'bg-orange-100 text-orange-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Orders
              </Link>
            </li>
            <li>
              <Link
                to="/admin/sales-history"
                onClick={handleLinkClick}
                className={`block w-full text-left px-4 py-3 rounded transition-all font-medium text-sm md:text-base ${
                  isActive('/admin/sales-history')
                    ? 'bg-orange-100 text-orange-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Sales
              </Link>
            </li>
            <li>
              <Link
                to="/admin/profit-analytics"
                onClick={handleLinkClick}
                className={`block w-full text-left px-4 py-3 rounded transition-all font-medium text-sm md:text-base ${
                  isActive('/admin/profit-analytics')
                    ? 'bg-orange-100 text-orange-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Analytics
              </Link>
            </li>
            <li>
              <Link
                to="/admin/reports"
                onClick={handleLinkClick}
                className={`block w-full text-left px-4 py-3 rounded transition-all font-medium text-sm md:text-base ${
                  isActive('/admin/reports')
                    ? 'bg-orange-100 text-orange-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Reports
              </Link>
            </li>
            {user && (
              <li className="border-t border-gray-200 pt-2 mt-2">
                <button
                  onClick={() => {
                    handleLinkClick();
                    handleLogout();
                  }}
                  className="w-full bg-orange-500 text-white px-4 py-2.5 md:py-3 rounded font-bold hover:bg-orange-600 transition-all text-sm md:text-base"
                >
                  🚪 Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}

export default AdminNavbar;
