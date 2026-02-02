import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function OrderSuccess() {
  const location = useLocation();
  const order = location.state?.order;

  return (
    <div className="max-w-[800px] mx-auto py-10 px-5">
      <div className="bg-white rounded-lg shadow-lg p-10 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-3xl text-green-600 font-bold mb-4">Order Placed Successfully!</h1>
        
        {order && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Order Details</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-semibold">#{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Customer Name:</span>
                <span className="font-semibold">{order.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-semibold">{order.customerEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-semibold text-blue-500">Rs {order.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-semibold text-orange-500">{order.status}</span>
              </div>
            </div>
          </div>
        )}

        <p className="text-gray-600 mb-6">
          Thank you for your order! We'll send you a confirmation email shortly.
          <br />
          Our team will contact you soon to confirm the delivery details.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/store">
            <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all">
              Continue Shopping
            </button>
          </Link>
          <Link to="/">
            <button className="bg-gray-200 text-slate-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-all">
              Go to Home
            </button>
          </Link>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Need help?</strong> Contact us at:
            <br />
            📞 077 760 2021 | 077 482 0276
          </p>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
