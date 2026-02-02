import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Payment Method, 2: Details Form

  const [paymentMethod, setPaymentMethod] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: '',
    // Card details for online payment
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
    setStep(2); // Move to details form
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Calculate total quantity from all cart items
      const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
      
      // Create order object
      const orderData = {
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: `${formData.address}, ${formData.city}, ${formData.postalCode}`,
        notes: formData.notes,
        totalAmount: getCartTotal(),
        productCount: totalQuantity,
        status: 'PENDING',
        paymentMethod: paymentMethod,
        items: cartItems.map(item => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price
        }))
      };

      // Send order to backend
      const response = await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const order = await response.json();
        
        // Clear cart
        clearCart();
        
        // If payment method is online, redirect to payment gateway
        if (paymentMethod === 'online') {
          // Here you would integrate with actual payment gateway
          alert('Payment processing... (In production, this would redirect to payment gateway)');
          // Example: window.location.href = `https://payment-gateway.com?orderId=${order.id}&amount=${order.totalAmount}`;
        }
        
        // Navigate to order confirmation
        navigate('/order-success', { state: { order } });
      } else {
        const error = await response.json();
        alert('Error placing order: ' + (error.message || 'Please try again'));
      }
    } catch (err) {
      console.error('Order error:', err);
      alert('Network error. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-[800px] mx-auto py-6 md:py-10 px-3 sm:px-4 md:px-5 mt-20 lg:mt-24">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 md:p-10 text-center">
          <div className="text-5xl sm:text-6xl mb-3 md:mb-4">⚠️</div>
          <h2 className="text-xl sm:text-2xl text-gray-600 mb-3 md:mb-4">No items in cart</h2>
          <p className="text-sm sm:text-base text-gray-500 mb-4 md:mb-6">Please add items to your cart before checking out.</p>
          <button
            onClick={() => navigate('/store')}
            className="bg-blue-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-all font-semibold text-sm sm:text-base"
          >
            Go to Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto py-6 md:py-10 px-3 sm:px-4 md:px-5 mt-20 lg:mt-24">
      <h1 className="text-2xl sm:text-3xl md:text-4xl text-slate-800 mb-6 md:mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
            
            {/* Step 1: Payment Method Selection */}
            {step === 1 && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 md:mb-6">Select Payment Method</h2>
                <p className="text-sm sm:text-base text-gray-600 mb-4 md:mb-6">Choose how you would like to pay for your order</p>
                
                <div className="space-y-3 md:space-y-4">
                  <div
                    onClick={() => handlePaymentMethodSelect('cash')}
                    className="border-2 border-gray-300 rounded-lg p-4 sm:p-6 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all active:border-blue-500"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="text-3xl sm:text-4xl flex-shrink-0">💵</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-1 md:mb-2">Cash on Delivery</h3>
                        <p className="text-xs sm:text-sm text-gray-600 mb-2 md:mb-3">Pay with cash when you receive the product at your doorstep</p>
                        <ul className="space-y-0.5 text-xs sm:text-sm text-gray-500">
                          <li>✓ No online payment required</li>
                          <li>✓ Inspect product before payment</li>
                          <li>✓ Safe and secure</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => handlePaymentMethodSelect('online')}
                    className="border-2 border-gray-300 rounded-lg p-4 sm:p-6 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all active:border-blue-500"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="text-3xl sm:text-4xl flex-shrink-0">💳</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-1 md:mb-2">Online Payment</h3>
                        <p className="text-xs sm:text-sm text-gray-600 mb-2 md:mb-3">Pay securely online using your credit/debit card or bank transfer</p>
                        <ul className="space-y-0.5 text-xs sm:text-sm text-gray-500">
                          <li>✓ Secure payment gateway</li>
                          <li>✓ Instant confirmation</li>
                          <li>✓ Multiple payment options</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/cart')}
                  className="mt-4 md:mt-6 w-full bg-gray-200 text-slate-800 py-2 sm:py-3 rounded-lg font-semibold hover:bg-gray-300 active:bg-gray-400 transition-all text-sm sm:text-base"
                >
                  Back to Cart
                </button>
              </div>
            )}

            {/* Step 2: Cash on Delivery - Shipping Form */}
            {step === 2 && paymentMethod === 'cash' && (
              <div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Shipping Information</h2>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                    💵 Cash on Delivery
                  </span>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-3 md:space-y-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1 md:mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="w-full py-3 px-4 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-800 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full py-3 px-4 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                          placeholder="engineering.secu@gmail.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-800 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full py-3 px-4 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                          placeholder="077 760 2021"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-2">
                        Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="w-full py-2 md:py-3 px-3 md:px-4 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-sm md:text-base"
                        placeholder="Street address"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1 md:mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          className="w-full py-2 md:py-3 px-3 md:px-4 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-sm md:text-base"
                          placeholder="City"
                        />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1 md:mb-2">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleChange}
                          className="w-full py-2 md:py-3 px-3 md:px-4 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-sm md:text-base"
                          placeholder="Postal code"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1 md:mb-2">
                        Order Notes (Optional)
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows="3"
                        className="w-full py-2 md:py-3 px-3 md:px-4 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-sm md:text-base"
                        placeholder="Any special instructions for your order"
                      />
                    </div>
                  </div>

                  <div className="mt-4 md:mt-6 flex gap-2 md:gap-4 flex-col sm:flex-row">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 bg-gray-200 text-slate-800 py-2 md:py-3 rounded-lg font-semibold hover:bg-gray-300 active:bg-gray-400 transition-all text-sm md:text-base"
                      disabled={loading}
                    >
                      Change Payment Method
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-green-500 text-white py-2 md:py-3 rounded-lg font-bold hover:bg-green-600 active:bg-green-700 transition-all disabled:bg-gray-400 text-sm md:text-base"
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : 'Place Order'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 2: Online Payment - Card Details Form */}
            {step === 2 && paymentMethod === 'online' && (
              <div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Payment Details</h2>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                    💳 Online Payment
                  </span>
                </div>
                
                <form onSubmit={handleSubmit}>
                  {/* Card Information */}
                  <div className="mb-4 md:mb-6 p-3 md:p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-bold text-slate-800 mb-3 md:mb-4 text-sm md:text-base">Card Information</h3>
                    <div className="space-y-3 md:space-y-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1 md:mb-2">
                          Card Number *
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleChange}
                          required
                          maxLength="16"
                          className="w-full py-2 md:py-3 px-3 md:px-4 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-sm md:text-base"
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-800 mb-2">
                          Cardholder Name *
                        </label>
                        <input
                          type="text"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleChange}
                          required
                          className="w-full py-3 px-4 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                          placeholder="Name on card"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-800 mb-2">
                            Expiry Date *
                          </label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleChange}
                            required
                            placeholder="MM/YY"
                            maxLength="5"
                            className="w-full py-3 px-4 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-800 mb-2">
                            CVV *
                          </label>
                          <input
                            type="text"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleChange}
                            required
                            maxLength="3"
                            className="w-full py-3 px-4 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                            placeholder="123"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Information */}
                  <h3 className="font-bold text-slate-800 mb-4">Shipping Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="w-full py-3 px-4 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-800 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full py-3 px-4 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                          placeholder="engineering.secu@gmail.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-800 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full py-3 px-4 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                          placeholder="077 760 2021"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-2">
                        Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="w-full py-3 px-4 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        placeholder="Street address"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-800 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          className="w-full py-3 px-4 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                          placeholder="City"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-800 mb-2">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleChange}
                          className="w-full py-3 px-4 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                          placeholder="Postal code"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-2">
                        Order Notes (Optional)
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows="3"
                        className="w-full py-3 px-4 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        placeholder="Any special instructions for your order"
                      />
                    </div>
                  </div>

                  <div className="mt-4 md:mt-6 flex gap-2 md:gap-4 flex-col sm:flex-row">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 bg-gray-200 text-slate-800 py-2 md:py-3 rounded-lg font-semibold hover:bg-gray-300 active:bg-gray-400 transition-all text-sm md:text-base"
                      disabled={loading}
                    >
                      Change Payment Method
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-orange-500 text-white py-2 md:py-3 rounded-lg font-bold hover:bg-orange-600 active:bg-orange-700 transition-all disabled:bg-gray-400 text-sm md:text-base"
                      disabled={loading}
                    >
                      {loading ? 'Processing Payment...' : 'Pay Now'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary - Always visible */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 sticky top-20 md:top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
            <h2 className="text-lg md:text-2xl font-bold text-slate-800 mb-3 md:mb-4">Order Summary</h2>
            
            <div className="space-y-2 md:space-y-3 mb-4 max-h-48 md:max-h-60 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600 line-clamp-1">
                    {item.name} x {item.quantity}
                  </span>
                  <span className="font-semibold text-xs sm:text-sm">Rs {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-2 md:pt-3 space-y-1.5 md:space-y-2">
              <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                <span>Subtotal</span>
                <span>Rs {getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t border-gray-200 pt-1.5 md:pt-2 flex justify-between text-lg md:text-xl font-bold text-slate-800">
                <span>Total</span>
                <span>Rs {getCartTotal().toFixed(2)}</span>
              </div>
            </div>

            {step === 1 && (
              <div className="mt-3 md:mt-4 p-2 md:p-3 bg-gray-50 rounded-lg text-xs md:text-sm text-gray-600">
                <p>👆 Select a payment method above to continue</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
