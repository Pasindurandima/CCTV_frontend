import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Menu, X } from "lucide-react";


function Navbar() {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white flex justify-center items-center text-base fixed top-0 w-full z-[999] shadow-md border-b border-gray-200">
      <div className="flex justify-between items-center w-full max-w-[1400px] px-4 md:px-6 lg:px-12 py-3 lg:py-0 h-auto lg:h-[70px]">
        {/* Logo */}
        <Link to="/" className="text-black cursor-pointer no-underline font-bold flex items-center hover:opacity-75 transition-opacity flex-shrink-0">
          <img src="/assets/logo.jpg" alt="SecU Engineering Logo" className="h-12 md:h-16 object-contain" />
          <div className="ml-2 md:ml-4 flex flex-col md:flex-row items-start md:items-center">
            <span className="text-orange-500 font-bold text-lg md:text-2xl leading-none">SecU</span>
            <span className="text-gray-800 font-normal text-xs md:text-base ml-0 md:ml-1 leading-none">Engineering</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex items-center justify-center list-none gap-4 h-full flex-1 mx-8">
          <li className="h-full flex items-center">
            <Link
              to="/"
              className={`text-gray-700 no-underline px-4 h-full flex items-center transition-all hover:text-orange-500 font-medium border-b-2 ${
                isActive("/") ? "text-orange-500 border-orange-500" : "border-transparent"
              }`}
            >
              Home
            </Link>
          </li>

          <li className="h-full flex items-center">
            <Link
              to="/store"
              className={`text-gray-700 no-underline px-4 h-full flex items-center transition-all hover:text-orange-500 font-medium border-b-2 ${
                isActive("/store") ? "text-orange-500 border-orange-500" : "border-transparent"
              }`}
            >
              Store
            </Link>
          </li>

          <li className="h-full flex items-center">
            <Link
              to="/about"
              className={`text-gray-700 no-underline px-4 h-full flex items-center transition-all hover:text-orange-500 font-medium border-b-2 ${
                isActive("/about") ? "text-orange-500 border-orange-500" : "border-transparent"
              }`}
            >
              About us
            </Link>
          </li>

          <li className="h-full flex items-center">
            <Link
              to="/contact"
              className={`text-gray-700 no-underline px-4 h-full flex items-center transition-all hover:text-orange-500 font-medium border-b-2 ${
                isActive("/contact") ? "text-orange-500 border-orange-500" : "border-transparent"
              }`}
            >
              Contact us
            </Link>
          </li>
        </ul>

        {/* Cart Button - Desktop */}
        <Link to="/cart" className="relative hidden lg:block">
          <button className="relative bg-orange-500 text-white no-underline px-6 py-2 h-full flex items-center gap-2 transition-all hover:bg-orange-600 font-bold rounded text-sm">
            <ShoppingCart size={18} className="text-white" />
            Cart

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </Link>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden items-center gap-3">
          {/* Cart Button - Mobile */}
          <Link to="/cart" className="relative">
            <button className="relative bg-orange-500 text-white px-3 py-2 flex items-center gap-1 transition-all hover:bg-orange-600 font-bold rounded text-xs md:text-sm">
              <ShoppingCart size={16} className="text-white" />
              <span className="hidden sm:inline">Cart</span>

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-700 hover:text-orange-500 transition-colors p-2"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed top-16 md:top-20 left-0 right-0 bg-white shadow-lg border-b border-gray-200 lg:hidden max-h-[calc(100vh-70px)] overflow-y-auto z-[998]">
          <ul className="list-none p-4 space-y-2">
            <li>
              <Link
                to="/"
                onClick={handleLinkClick}
                className={`block w-full text-left px-4 py-3 rounded transition-all font-medium ${
                  isActive("/")
                    ? "bg-orange-100 text-orange-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/store"
                onClick={handleLinkClick}
                className={`block w-full text-left px-4 py-3 rounded transition-all font-medium ${
                  isActive("/store")
                    ? "bg-orange-100 text-orange-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Store
              </Link>
            </li>

            <li>
              <Link
                to="/about"
                onClick={handleLinkClick}
                className={`block w-full text-left px-4 py-3 rounded transition-all font-medium ${
                  isActive("/about")
                    ? "bg-orange-100 text-orange-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                About us
              </Link>
            </li>

            <li>
              <Link
                to="/contact"
                onClick={handleLinkClick}
                className={`block w-full text-left px-4 py-3 rounded transition-all font-medium ${
                  isActive("/contact")
                    ? "bg-orange-100 text-orange-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Contact us
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
