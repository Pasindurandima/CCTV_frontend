import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'USER'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    setSuccess('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: formData.role
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Registration successful! Redirecting to login...');
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(data));
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Network error. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-70px)] flex justify-center items-center bg-gradient-to-br from-indigo-500 to-purple-600 p-5">
      <div className="bg-white p-10 rounded-lg shadow-2xl w-full max-w-[450px]">
        <h1 className="text-3xl text-slate-800 mb-8 text-center">Register</h1>
        
        {error && (
          <div className="mb-5 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-5 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="fullName" className="block mb-2 text-slate-800 font-semibold">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full py-3 px-4 border-2 border-gray-300 rounded-md text-base transition-all focus:outline-none focus:border-blue-500"
              required
              disabled={loading}
            />
          </div>
          <div className="mb-5">
            <label htmlFor="email" className="block mb-2 text-slate-800 font-semibold">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full py-3 px-4 border-2 border-gray-300 rounded-md text-base transition-all focus:outline-none focus:border-blue-500"
              required
              disabled={loading}
            />
          </div>
          <div className="mb-5">
            <label htmlFor="password" className="block mb-2 text-slate-800 font-semibold">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password (min 6 characters)"
              className="w-full py-3 px-4 border-2 border-gray-300 rounded-md text-base transition-all focus:outline-none focus:border-blue-500"
              required
              disabled={loading}
              minLength="6"
            />
          </div>
          <div className="mb-5">
            <label htmlFor="confirmPassword" className="block mb-2 text-slate-800 font-semibold">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="w-full py-3 px-4 border-2 border-gray-300 rounded-md text-base transition-all focus:outline-none focus:border-blue-500"
              required
              disabled={loading}
            />
          </div>
          <div className="mb-5">
            <label htmlFor="role" className="block mb-2 text-slate-800 font-semibold">
              Register As
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full py-3 px-4 border-2 border-gray-300 rounded-md text-base transition-all focus:outline-none focus:border-blue-500"
              required
              disabled={loading}
            >
              <option value="USER">User (Customer)</option>
              <option value="ADMIN">Admin (Shop Owner)</option>
            </select>
            <p className="text-sm text-gray-600 mt-2">
              {formData.role === 'ADMIN' 
                ? '🔑 Admin can manage products and view all orders' 
                : '🛒 User can browse and purchase products'}
            </p>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white border-none py-4 rounded-md cursor-pointer text-lg mt-2 transition-all hover:bg-blue-600 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <div className="mt-5 text-center">
          <p className="text-gray-600 mb-2">
            Already have an account? <Link to="/login" className="text-blue-500 no-underline font-semibold hover:text-blue-700 hover:underline">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
