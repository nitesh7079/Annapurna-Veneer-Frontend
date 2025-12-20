import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    PhoneNo: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Client-side validation for registration
    if (!isLogin) {
      if (!formData.fullName?.trim()){
        setError('Full name is required');
        setLoading(false);
        return;
      }
      if (!formData.email?.trim()) {
        setError('Email is required');
        setLoading(false);
        return;
      }
      if (!formData.password?.trim()) {
        setError('Password is required');
        setLoading(false);
        return;
      }
      if (!formData.PhoneNo?.trim()) {
        setError('Phone number is required');
        setLoading(false);
        return;
      }
    }

    try {
      const url = isLogin 
        ? 'https://shyam-veneer-backend-1.onrender.com/api/v1/user/login'
        : 'https://shyam-veneer-backend-1.onrender.com/api/v1/user/register';
      
      const body = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      // Add timeout and better error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      let data;
      
      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error(`Server returned invalid response (${response.status})`);
      }

      if (!response.ok) {
        // Use the server's error message if available
        const errorMessage = data?.message || `Server error: ${response.status}`;
        throw new Error(errorMessage);
      }

      if (data.success) {
        login(data.data, data.token);
        // Auto redirect to home page after successful login/registration
        navigate('/');
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      console.error('Authentication error:', err);
      
      if (err.name === 'AbortError') {
        setError('Connection timeout. Please check your internet connection and try again.');
      } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        setError('Unable to connect to server. Please ensure the server is running and try again.');
      } else if (err.message.includes('User already exists')) {
        setError('An account with this email already exists. Please try logging in instead.');
      } else if (err.message.includes('Server returned invalid response')) {
        setError('Server communication error. Please try again in a moment.');
      } else {
        // Show the actual server error message instead of generic message
        setError(err.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      password: '',
      PhoneNo: ''
    });
    setError('');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Plywood Sheets */}
        <div className="absolute top-10 left-10 w-32 h-20 bg-gradient-to-r from-amber-200 to-amber-300 rounded-lg shadow-xl opacity-20 animate-bounce-slow transform rotate-12"></div>
        <div className="absolute top-32 right-20 w-24 h-16 bg-gradient-to-r from-orange-200 to-orange-300 rounded-lg shadow-xl opacity-30 animate-float transform -rotate-6"></div>
        <div className="absolute bottom-32 left-32 w-40 h-24 bg-gradient-to-r from-yellow-200 to-amber-200 rounded-lg shadow-xl opacity-25 animate-pulse transform rotate-3"></div>
        
        {/* Furniture Silhouettes */}
        <div className="absolute top-20 right-32 w-16 h-24 bg-amber-300 opacity-15 animate-sway rounded-t-lg"></div>
        <div className="absolute bottom-20 right-10 w-20 h-12 bg-orange-300 opacity-20 animate-float-slow rounded-lg"></div>
        <div className="absolute top-1/2 left-5 w-12 h-20 bg-yellow-400 opacity-15 animate-bounce-slow rounded-lg"></div>
        
        {/* Wood Grain Patterns */}
        <div className="absolute top-1/4 left-1/4 w-48 h-2 bg-amber-400 opacity-10 animate-slide-right rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-32 h-2 bg-orange-400 opacity-15 animate-slide-left rounded-full"></div>
        
        {/* Sawdust Particles */}
        <div className="absolute top-16 left-1/2 w-2 h-2 bg-amber-500 opacity-30 animate-ping rounded-full"></div>
        <div className="absolute bottom-40 left-1/3 w-1 h-1 bg-orange-500 opacity-40 animate-pulse rounded-full"></div>
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-yellow-500 opacity-35 animate-bounce rounded-full"></div>
      </div>
      
      <div className="max-w-md w-full bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-2xl border-4 border-amber-200 p-8 backdrop-blur-sm relative z-10">
        <div className="text-center mb-8">
          {/* Company Logo/Brand */}
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-600 to-amber-800 rounded-2xl shadow-2xl flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
              <span className="text-2xl font-bold text-white">SV</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 bg-clip-text text-transparent mb-2">
            {isLogin ? 'Welcome Back' : 'Join Us'}
          </h1>
          <p className="text-amber-700 text-lg font-medium">
            Annapurna Veneer - Premium Plywood Solutions
          </p>
          <p className="text-amber-600 mt-1">
            {isLogin ? 'Sign in to your account' : 'Create your account today'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-xl mb-4 shadow-lg">
            <div className="flex items-center">
              <span className="text-red-500 mr-2">⚠️</span>
              {error}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-sm font-bold text-amber-800 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required={!isLogin}
                className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-amber-800 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-amber-800 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
              placeholder="Enter your password"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-bold text-amber-800 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="PhoneNo"
                value={formData.PhoneNo}
                onChange={handleChange}
                required={!isLogin}
                className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
                placeholder="Enter your phone number"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold py-4 px-6 rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={toggleMode}
            className="text-amber-700 hover:text-amber-900 text-sm font-semibold transition-colors duration-300 hover:underline"
          >
            {isLogin 
              ? "Don't have an account? Register here" 
              : "Already have an account? Login here"
            }
          </button>
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-amber-100 to-orange-100 border-2 border-amber-300 rounded-xl shadow-lg">
          <p className="text-sm text-amber-800 text-center">
            <strong className="text-amber-900">🏭 Premium Plywood Solutions</strong>
            <br />
            <span className="text-amber-700">Quality wood products for your furniture needs</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;