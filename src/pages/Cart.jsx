import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Cart() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-[1200px] mx-auto py-6 md:py-10 px-3 sm:px-4 md:px-5 mt-20 lg:mt-24">
        <h1 className="text-2xl sm:text-3xl md:text-4xl text-slate-800 mb-6 md:mb-8">Shopping Cart</h1>
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 md:p-10 text-center">
          <div className="text-5xl sm:text-6xl mb-3 md:mb-4">🛒</div>
          <h2 className="text-xl sm:text-2xl text-gray-600 mb-3 md:mb-4">Your cart is empty</h2>
          <p className="text-sm sm:text-base text-gray-500 mb-4 md:mb-6">Add some products to get started!</p>
          <Link to="/store">
            <button className="bg-blue-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-all font-semibold text-sm sm:text-base">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto py-6 md:py-10 px-3 sm:px-4 md:px-5 mt-20 lg:mt-24">
      <h1 className="text-2xl sm:text-3xl md:text-4xl text-slate-800 mb-6 md:mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-3 md:gap-4 border-b border-gray-200 pb-3 md:pb-4 mb-3 md:mb-4 last:border-0 last:mb-0 flex-col sm:flex-row">
                <div className="w-full sm:w-24 h-48 sm:h-24 rounded-lg overflow-hidden flex-shrink-0 bg-white flex items-center justify-center">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-2xl sm:text-3xl">📷</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-1 line-clamp-2">{item.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-500 mb-2">{item.category}</p>
                  <p className="text-lg sm:text-xl text-orange-500 font-bold">Rs {item.price}</p>
                </div>
                <div className="flex flex-col sm:flex-col items-start sm:items-end gap-2">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 active:text-red-800 font-semibold text-xs sm:text-sm transition-colors"
                  >
                    ✕ Remove
                  </button>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="bg-gray-200 hover:bg-gray-300 active:bg-gray-400 w-7 h-7 sm:w-8 sm:h-8 rounded-lg font-bold text-sm sm:text-base transition-colors"
                    >
                      −
                    </button>
                    <span className="w-10 sm:w-12 text-center font-semibold text-sm sm:text-base">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="bg-gray-200 hover:bg-gray-300 active:bg-gray-400 w-7 h-7 sm:w-8 sm:h-8 rounded-lg font-bold text-sm sm:text-base transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-base sm:text-lg font-bold text-slate-800">
                    Rs {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={clearCart}
                className="text-red-500 hover:text-red-700 active:text-red-800 font-semibold text-sm transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 sticky top-20 md:top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-4">Order Summary</h2>
            
            <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
              <div className="flex justify-between text-sm md:text-base text-gray-600">
                <span>Subtotal</span>
                <span>Rs {getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm md:text-base text-gray-600">
                <span>Shipping</span>
                <span className="text-xs md:text-sm">Calculated at checkout</span>
              </div>
              <div className="border-t border-gray-200 pt-2 md:pt-3 flex justify-between text-lg md:text-xl font-bold text-slate-800">
                <span>Total</span>
                <span>Rs {getCartTotal().toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleCheckout}
                className="w-full bg-green-500 text-white py-2 md:py-3 rounded-lg font-bold hover:bg-green-600 active:bg-green-700 transition-all text-sm md:text-base"
              >
                Proceed to Checkout
              </button>

              <Link to="/store">
                <button className="w-full bg-gray-200 text-slate-800 py-2 md:py-3 rounded-lg font-semibold hover:bg-gray-300 active:bg-gray-400 transition-all text-sm md:text-base">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
