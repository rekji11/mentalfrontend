// src/components/Login.js
import React, { useState } from 'react';
import { loginUser } from '../api';
import { Link } from 'react-router-dom'; // Import Link

function Login({ onLoginSuccess }) {
  // ... (keep all your state and handleSubmit logic the same)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Keep the handleSubmit function exactly as it was before

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await loginUser(username, password);
      onLoginSuccess(data.access_token);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // --- RETURN STATEMENT MODIFIED FOR MODERN DESIGN ---
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Welcome! </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      
      <div className="mt-6">
        <p className="text-sm text-gray-600 mb-2">Don't have an account?</p>
        <Link to="/register" className="w-full inline-block border border-blue-500 text-blue-500 hover:bg-blue-50 font-medium py-2 px-4 rounded-lg transition duration-200">
            Register Now
        </Link>
      </div>
    </div>
  );
}

export default Login;