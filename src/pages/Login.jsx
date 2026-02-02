import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // If an admin is already authenticated, keep them inside the admin area
    try {
      const existing = JSON.parse(localStorage.getItem('user') || 'null');
      if (existing?.role?.toUpperCase() === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else if (existing) {
        // Clear any non-admin residue to prevent privilege confusion
        localStorage.removeItem('user');
      }
    } catch (err) {
      localStorage.removeItem('user');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Only allow admin login
        if (data.role === 'ADMIN') {
          localStorage.setItem('user', JSON.stringify(data));
          // Dispatch custom event to notify App component of auth change
          window.dispatchEvent(new Event('authChange'));
          navigate('/admin/dashboard');
        } else {
          localStorage.removeItem('user');
          setError('Access denied. Admin credentials required.');
        }
      } else {
        setError(data.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white min-h-[calc(100vh-70px)]">
      {/* Hero Section */}
      <section className="relative bg-white min-h-[calc(100vh-70px)] flex items-center px-5 py-16 overflow-hidden">
        {/* Animated background circles */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content - Brand Info */}
            <div className="text-Black">
              <div className="mb-10">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-4">
                  Admin <span className="text-orange-500">Access</span>
                </h1>
                <p className="text-xl md:text-2xl text-Black/90 mb-4">
                  Manage your security solutions and business operations
                </p>
                <p className="text-lg text-black/80">
                  Secure login to your admin control panel. Access dashboard, inventory, orders, and analytics all in one place.
                </p>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">✓</div>
                  <p className="text-black/90">Real-time dashboard analytics</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-2xl">✓</div>
                  <p className="text-black/90">Complete inventory management</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-2xl">✓</div>
                  <p className="text-black/90">Order tracking & fulfillment</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-2xl">✓</div>
                  <p className="text-black/90">Sales & profit analytics</p>
                </div>
              </div>
            </div>

            {/* Right Content - Login Form */}
            <div className="bg-blue-100 p-10 rounded-2xl shadow-2xl">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Admin Login</h2>
              <p className="text-gray-600 mb-8">Enter your credentials to access the admin panel</p>
              
              {error && (
                <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg flex items-start gap-3">
                  <span className="text-xl">⚠️</span>
                  <div>
                    <p className="font-semibold">Login Failed</p>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block mb-2 text-slate-800 font-semibold">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="engineering.secu@gmail.com"
                    className="w-full py-3 px-4 border-2 border-gray-300 rounded-lg text-base transition-all focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block mb-2 text-slate-800 font-semibold">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full py-3 px-4 border-2 border-gray-300 rounded-lg text-base transition-all focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    required
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold text-lg transition-all hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Logging in...</span>
                    </>
                  ) : (
                    <>
                      <span>🔐</span>
                      <span>Login as Admin</span>
                    </>
                  )}
                </button>
              </form>

              {/* Back to Home */}
              <div className="mt-8 pt-8 border-t border-gray-200 text-center">
                <p className="text-gray-600 mb-3">SecU Engineering</p>
                
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;
